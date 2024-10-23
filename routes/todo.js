const express = require('express');
const jwt = require('jsonwebtoken');
const Todo = require('../models/todo');

const router = express.Router();

// Middleware to authenticate user via token
function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token.split(' ')[1], 'secretkey', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token invalid' });
        req.userId = decoded.userId;
        next();
    });
}

// Get todos
router.get('/', authenticate, async (req, res) => {
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
});

// Create new todo
router.post('/', authenticate, async (req, res) => {
