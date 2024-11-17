const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Assuming UserModel is already defined and imported
const FriendsModel = require('./models/friends'); // Ensure this model is correctly defined in your models directory

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chess', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a route to fetch friends
app.get('/api/friends', async (req, res) => {
    try {
        const friends = await FriendsModel.find({});
        res.json(friends);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch friends', error: err });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
