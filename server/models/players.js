const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    player: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        elo: {
            type: Number,
            default: 700 // Starting ELO rating
        },
        peakElo: {
            type: Number,
            default: 700
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

// Add index for email field
playerSchema.index({ email: 1 });

const Player = mongoose.model('players', playerSchema);
module.exports = Player;