const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

app.use(express.json());

const mongoURI = 'your-mongodb-connection-string';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
