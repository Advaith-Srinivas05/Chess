const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'bai_muchi'; 
const Friend = require('./models/friends');
const Player = require('./models/players');

const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

mongoose.connect("mongodb://localhost:27017/chess")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Single registration endpoint
app.post("/auth/register", async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Check if player already exists
        const existingPlayer = await Player.findOne({ 
            $or: [
                { email: email },
                { player: name }
            ]
        });

        if (existingPlayer) {
            return res.status(409).json({ 
                message: existingPlayer.email === email ? 
                    "Email already in use" : 
                    "Username already in use" 
            });
        }

        // Create single player document
        const player = await Player.create({
            player: name,  // Username
            email: email,
            password: password,
            name: name,    // Display name
            rating: {
                elo: 700,
                peakElo: 700
            },
            statistics: {
                gamesPlayed: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                winRate: 0
            },
            achievements: {
                winStreak: 0,
                bestWinStreak: 0,
                tournamentWins: 0
            }
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: player._id, 
                email: player.email,
                name: player.name
            },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Send response
        res.status(201).json({
            status: "Success",
            token: token,
            user: {
                id: player._id,
                name: player.name,
                email: player.email,
                rating: player.rating.elo
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            message: "Registration failed", 
            error: error.message 
        });
    }
});

// login endpoint
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const player = await Player.findOne({ email });
        
        if (!player || player.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: player._id, email: player.email, name: player.name },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.json({
            status: "Success",
            token: token,
            user: {
                id: player._id,
                name: player.name,
                email: player.email,
                rating: player.rating.elo,
                statistics: {
                    gamesPlayed: player.statistics.gamesPlayed,
                    wins: player.statistics.wins,
                    winRate: player.statistics.winRate
                },
                rating: {
                    elo: player.rating.elo,
                    peakElo: player.rating.peakElo
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

app.get("/verify-token", verifyToken, (req, res) => {
    res.json({ valid: true });
});

// Friend System Routes
app.get("/api/friends", verifyToken, async (req, res) => {
    try {
        console.log("Fetching friends for user:", req.user.userId);
        
        let userFriends = await Friend.findOne({ userId: req.user.userId });
        console.log("Found user friends:", userFriends);
        
        if (!userFriends) {
            console.log("Creating new friend document for user");
            userFriends = await Friend.create({
                userId: req.user.userId,
                friends: [],
                friendRequests: { incoming: [], outgoing: [] }
            });
        }

        // Get friend details
        const friendDetails = await Promise.all(
            userFriends.friends.map(async (friend) => {
                const playerInfo = await Player.findById(friend.friendId);
                return {
                    id: friend.friendId,
                    name: playerInfo?.player || 'Unknown',
                    gamesPlayed: friend.gamesPlayedTogether,
                    lastPlayed: friend.lastPlayed
                };
            })
        );

        // Get incoming request details
        const incomingRequests = await Promise.all(
            userFriends.friendRequests.incoming.map(async (request) => {
                const playerInfo = await Player.findById(request.userId);
                return {
                    id: request.userId,
                    name: playerInfo?.player || 'Unknown',
                    requestedAt: request.requestedAt
                };
            })
        );

        console.log("Sending response:", {
            friends: friendDetails,
            friendRequests: incomingRequests
        });

        res.json({
            friends: friendDetails,
            friendRequests: incomingRequests
        });
    } catch (err) {
        console.error('Error fetching friends:', err);
        res.status(500).json({ message: 'Failed to fetch friends' });
    }
});

app.post("/api/friends/request", verifyToken, async (req, res) => {
    try {
        const { name } = req.body;
        console.log("Friend request from:", req.user.userId, "to:", name);
        
        // Find target user
        const targetUser = await Player.findOne({ player: name });
        if (!targetUser) {
            console.log("Target user not found:", name);
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if trying to add self
        if (targetUser._id.toString() === req.user.userId) {
            console.log("User attempted to add self as friend");
            return res.status(400).json({ message: 'Cannot send friend request to yourself' });
        }

        // Check existing relationship specifically between these two users
        const [senderRelationship, receiverRelationship] = await Promise.all([
            Friend.findOne({ 
                userId: req.user.userId,
                $or: [
                    { 'friends.friendId': targetUser._id },
                    { 'friendRequests.outgoing.userId': targetUser._id }
                ]
            }),
            Friend.findOne({
                userId: targetUser._id,
                'friendRequests.incoming.userId': req.user.userId
            })
        ]);

        if (senderRelationship || receiverRelationship) {
            console.log("Existing relationship found between these users");
            return res.status(400).json({ 
                message: 'You already have a pending request or are already friends with this user'
            });
        }

        // Create friend documents if they don't exist
        const [senderFriendDoc, receiverFriendDoc] = await Promise.all([
            Friend.findOneAndUpdate(
                { userId: req.user.userId },
                { $setOnInsert: { friends: [], friendRequests: { incoming: [], outgoing: [] } } },
                { upsert: true, new: true }
            ),
            Friend.findOneAndUpdate(
                { userId: targetUser._id },
                { $setOnInsert: { friends: [], friendRequests: { incoming: [], outgoing: [] } } },
                { upsert: true, new: true }
            )
        ]);

        // Create the request objects
        const now = new Date();
        const requestObject = {
            userId: req.user.userId,
            requestedAt: now
        };

        const targetRequestObject = {
            userId: targetUser._id,
            requestedAt: now
        };

        // Update both documents without using a transaction
        try {
            await Promise.all([
                // Update sender's outgoing requests
                Friend.updateOne(
                    { userId: req.user.userId },
                    { $addToSet: { 'friendRequests.outgoing': targetRequestObject } }
                ),
                // Update recipient's incoming requests
                Friend.updateOne(
                    { userId: targetUser._id },
                    { $addToSet: { 'friendRequests.incoming': requestObject } }
                )
            ]);

            console.log("Friend request sent successfully");
            res.json({ message: 'Friend request sent successfully' });
        } catch (updateError) {
            console.error('Error updating friend requests:', updateError);
            throw updateError;
        }
    } catch (err) {
        console.error('Error sending friend request:', err);
        res.status(500).json({ 
            message: 'Failed to send friend request',
            error: err.message
        });
    }
});

app.post("/api/friends/accept", verifyToken, async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("Accepting friend request from:", userId, "by:", req.user.userId);

        // Verify request exists
        const userFriends = await Friend.findOne({
            userId: req.user.userId,
            'friendRequests.incoming.userId': userId
        });

        if (!userFriends) {
            console.log("Friend request not found");
            return res.status(404).json({ message: 'Friend request not found' });
        }

        try {
            // Update receiver (current user)
            const receiverUpdate = await Friend.findOneAndUpdate(
                { userId: req.user.userId },
                {
                    $push: {
                        friends: {
                            friendId: userId,
                            gamesPlayedTogether: 0,
                            lastPlayed: null
                        }
                    },
                    $pull: {
                        'friendRequests.incoming': { userId: userId }
                    }
                },
                { new: true }
            );

            if (!receiverUpdate) {
                throw new Error('Failed to update receiver');
            }

            // Update sender
            const senderUpdate = await Friend.findOneAndUpdate(
                { userId: userId },
                {
                    $push: {
                        friends: {
                            friendId: req.user.userId,
                            gamesPlayedTogether: 0,
                            lastPlayed: null
                        }
                    },
                    $pull: {
                        'friendRequests.outgoing': { userId: req.user.userId }
                    }
                },
                { new: true }
            );

            if (!senderUpdate) {
                // Rollback receiver update if sender update fails
                await Friend.findOneAndUpdate(
                    { userId: req.user.userId },
                    {
                        $pull: {
                            friends: { friendId: userId }
                        },
                        $push: {
                            'friendRequests.incoming': {
                                userId: userId,
                                requestedAt: new Date()
                            }
                        }
                    }
                );
                throw new Error('Failed to update sender');
            }

            console.log("Friend request accepted successfully");
            res.json({ message: 'Friend request accepted' });
        } catch (updateError) {
            console.error('Error during friend acceptance updates:', updateError);
            res.status(500).json({ 
                message: 'Failed to process friend request',
                error: updateError.message
            });
        }
    } catch (err) {
        console.error('Error accepting friend request:', err);
        res.status(500).json({ message: 'Failed to accept friend request' });
    }
});

app.post("/api/friends/update-games", verifyToken, async (req, res) => {
    try {
        const { friendId } = req.body;

        await Promise.all([
            Friend.findOneAndUpdate(
                { 
                    userId: req.user.userId,
                    'friends.friendId': friendId
                },
                {
                    $inc: { 'friends.$.gamesPlayedTogether': 1 },
                    $set: { 'friends.$.lastPlayed': new Date() }
                }
            ),
            Friend.findOneAndUpdate(
                { 
                    userId: friendId,
                    'friends.friendId': req.user.userId
                },
                {
                    $inc: { 'friends.$.gamesPlayedTogether': 1 },
                    $set: { 'friends.$.lastPlayed': new Date() }
                }
            )
        ]);

        res.json({ message: 'Games count updated successfully' });
    } catch (err) {
        console.error('Error updating games count:', err);
        res.status(500).json({ message: 'Failed to update games count' });
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
      const players = await Player.find({})
        .select('player rating.elo statistics.gamesPlayed statistics.wins')
        .sort({ 'rating.elo': -1 });
  
      const transformedPlayers = players.map(player => ({
        _id: player._id,
        name: player.player,
        rating: player.rating?.elo || 1200,
        gamesPlayed: player.statistics?.gamesPlayed || 0,
        wins: player.statistics?.wins || 0
      }));
  
      res.json(transformedPlayers);
    } catch (err) {
        console.error('Error in /api/leaderboard:', err);
        res.status(500).json({ 
            message: 'Server Error', 
            error: err.message 
        });
    }
});

const calculateElo = (currentElo, opponentElo, result) => {
    const K = 32; // K-factor
    const expected = 1 / (1 + Math.pow(10, (opponentElo - currentElo) / 400));
    const score = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
    return Math.round(K * (score - expected));
};

app.post('/api/update-rating', async (req, res) => {
    try {
        const { gameResult, playerRating, moves } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, SECRET_KEY); // Use your secret key
        const player = await Player.findOne({ email: decoded.email });

        if (!player) return res.status(404).json({ message: 'Player not found' });

        // Opponent rating (example: retrieved from the bot or other player)
        const opponentRating = player.rating.elo; // Replace with actual logic if dynamic

        // Calculate ELO change
        const eloChange = calculateElo(player.rating.elo, opponentRating, gameResult);
        player.rating.elo += eloChange;

        // Update peakElo if necessary
        if (player.rating.elo > player.rating.peakElo) {
            player.rating.peakElo = player.rating.elo;
        }

        // Update statistics
        player.statistics.gamesPlayed += 1;
        if (gameResult === 'win') {
            player.statistics.wins += 1;
            player.achievements.winStreak += 1;
            if (player.achievements.winStreak > player.achievements.bestWinStreak) {
                player.achievements.bestWinStreak = player.achievements.winStreak;
            }
        } else if (gameResult === 'loss') {
            player.statistics.losses += 1;
            player.achievements.winStreak = 0; // Reset streak on loss
        } else if (gameResult === 'draw') {
            player.statistics.draws += 1;
        }

        // Calculate win rate
        player.statistics.winRate = (
            (player.statistics.wins / player.statistics.gamesPlayed) * 100
        ).toFixed(2);

        // Save player data
        await player.save();

        return res.json({
            newRating: player.rating.elo,
            ratingChange: eloChange,
            message: 'Rating updated successfully',
        });
    } catch (err) {
        console.error('Error updating rating:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.listen(3001, () => {
    console.log("server is running on port 3001")
})