const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserModel = require("./user.js")
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'bai_muchi'; 
const playerSchema = require('./models/players');

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

app.post("/auth/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await UserModel.findOne({email: email});
        
        if(user && user.password === password) {
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                SECRET_KEY,
                { expiresIn: '24h' }
            );
            
            res.json({
                status: "Success",
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    rating: user.rating
                }
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.post("/auth/register", async (req, res) => {
    try {
        const user = await UserModel.create({...req.body, rating: 1200,});
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            SECRET_KEY,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            status: "Success",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                rating: user.rating
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});

app.get("/verify-token", verifyToken, (req, res) => {
    res.json({ valid: true });
});

app.get('/api/leaderboard', async (req, res) => {
    try {
      const players = await playerSchema.find({})
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