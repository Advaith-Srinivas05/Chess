// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const playerSchema = require('./models/players');

const app = express();
const PORT = 5000;
const MONGODB_URI = 'mongodb://localhost:27017/chess';

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Leaderboard endpoint: http://localhost:${PORT}/api/leaderboard`);
});

// Only initialize test data if the database is empty
// app.post('/api/initialize-test-data', async (req, res) => {
    //   try {
        //     // Check if there are any existing players
//     const existingPlayers = await User.countDocuments();
    
//     if (existingPlayers === 0) {
//       const testData = [
//         {
//           player: "Magnus",
//           rating: { elo: 2800 },
//           statistics: { gamesPlayed: 100, wins: 75 }
//         },
//         {
//           player: "Hikaru",
//           rating: { elo: 2750 },
//           statistics: { gamesPlayed: 90, wins: 65 }
//         },
//         {
//           player: "Alireza",
//           rating: { elo: 2700 },
//           statistics: { gamesPlayed: 80, wins: 55 }
//         }
//       ];

//       const result = await User.insertMany(testData);
//       res.json({ 
//         message: 'Test data initialized successfully', 
//         count: result.length 
//       });
//     } else {
//       res.json({ 
//         message: 'Database already contains data', 
//         count: existingPlayers 
//       });
//     }
//   } catch (err) {
//     console.error('Error initializing test data:', err);
//     res.status(500).json({ 
//       message: 'Error initializing test data', 
//       error: err.message 
//     });
//   }
// });

// Optional: Add endpoint to reset test data if needed
// app.post('/api/reset-test-data', async (req, res) => {
//   try {
//     await User.deleteMany({});
    
//     const testData = [
//       {
//         player: "Magnus",
//         rating: { elo: 2800 },
//         statistics: { gamesPlayed: 100, wins: 75 }
//       },
//       {
//         player: "Hikaru",
//         rating: { elo: 2750 },
//         statistics: { gamesPlayed: 90, wins: 65 }
//       },
//       {
//         player: "Alireza",
//         rating: { elo: 2700 },
//         statistics: { gamesPlayed: 80, wins: 55 }
//       }
//     ];

//     const result = await User.insertMany(testData);
//     res.json({ 
//       message: 'Test data reset successfully', 
//       count: result.length 
//     });
//   } catch (err) {
//     console.error('Error resetting test data:', err);
//     res.status(500).json({ 
//       message: 'Error resetting test data', 
//       error: err.message 
//     });
//   }
// });
