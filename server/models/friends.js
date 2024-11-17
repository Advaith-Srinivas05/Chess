const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({
    userId: { // User owning the friends list
        type: mongoose.Schema.Types.ObjectId,
        ref: 'players',
        required: true
    },
    friends: [ // List of confirmed friends
        {
            friendId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'players',
                required: true
            },
            gamesPlayedTogether: { type: Number, default: 0 },
            lastPlayed: { type: Date }
        }
    ],
    friendRequests: { // Incoming and outgoing requests
        incoming: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'players'
                },
                requestedAt: { type: Date, default: Date.now }
            }
        ],
        outgoing: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'players'
                },
                requestedAt: { type: Date, default: Date.now }
            }
        ]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Friends = mongoose.model('friends', friendsSchema);
module.exports = Friends;
