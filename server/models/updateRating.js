const express = require('express');
const jwt = require('jsonwebtoken');
const Player = require('./players'); // Adjust the path to your Player model
const router = express.Router();

// ELO adjustment function (basic example)
const calculateElo = (currentElo, opponentElo, result) => {
    const K = 32; // K-factor
    const expected = 1 / (1 + Math.pow(10, (opponentElo - currentElo) / 400));
    const score = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
    return Math.round(K * (score - expected));
};

router.post('/update-rating', async (req, res) => {
    try {
        const { gameResult, playerRating, moves } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
        const player = await Player.findOne({ email: decoded.email });

        if (!player) return res.status(404).json({ message: 'Player not found' });

        // Opponent rating (example: retrieved from the bot or other player)
        const opponentRating = 700; // Replace with actual logic if dynamic

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

module.exports = router;
