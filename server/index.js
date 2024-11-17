const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'bai_muchi'; 
const Player = require('./models/players'); // Renamed for clarity

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

// Add login endpoint
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const player = await Player.findOne({ email });
        
        if (!player) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (player.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { 
                userId: player._id, 
                email: player.email,
                name: player.name
            },
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
                rating: player.rating.elo
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

app.get("/verify-token", verifyToken, (req, res) => {
    res.json({ valid: true });
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

app.listen(3001, () => {
    console.log("server is running on port 3001")
})