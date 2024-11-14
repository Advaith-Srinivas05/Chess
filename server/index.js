const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const EmployeeModel = require("./Employee.js")
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'bai_muchi'; 

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/demo");

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

app.post("/login", (req, res) => {
    const {email, password} = req.body;
    EmployeeModel.findOne({email: email})
    .then(user => {
        if(user && user.password === password) {
            // Create token
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
                    email: user.email
                }
            });
        } else {
            res.status(401).json("Invalid credentials");
        }
    });
});



app.post("/register", (req, res) => {
    EmployeeModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err))
})

app.get("/verify-token", verifyToken, (req, res) => {
    res.json({ valid: true });
});

app.listen(3001, () => {
    console.log("server is running on port 3000")
})