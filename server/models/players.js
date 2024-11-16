const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    player: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    rating: {
        elo: {
            type: Number,
            default: 1200 // Starting ELO rating
        },
        peakElo: {
            type: Number,
            default: 1200
        }
    },
    statistics: {
        gamesPlayed: {
            type: Number,
            default: 0
        },
        wins: {
            type: Number,
            default: 0
        },
        losses: {
            type: Number,
            default: 0
        },
        draws: {
            type: Number,
            default: 0
        },
        winRate: {
            type: Number,
            default: 0
        }
    },
    achievements: {
        winStreak: {
            type: Number,
            default: 0
        },
        bestWinStreak: {
            type: Number,
            default: 0
        },
        tournamentWins: {
            type: Number,
            default: 0
        }
    },
    gameHistory: [{
        gameId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Game'
        },
        opponent: {
            type: String
        },
        result: {
            type: String,
            enum: ['win', 'loss', 'draw']
        },
        eloChange: {
            type: Number
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    rank: {
        type: Number,
        index: true
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

const players = mongoose.model('players', playerSchema);
module.exports = players;

