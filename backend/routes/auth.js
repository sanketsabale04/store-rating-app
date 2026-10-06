const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../db');

// 1. SIGN UP ROUTE
router.post('/signup', [
    body('name', 'Name must be 20-60 characters').isLength({ min: 20, max: 60 }),
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password must be 8-16 chars, 1 uppercase, 1 special char')
        .isLength({ min: 8, max: 16 })
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/),
    body('address', 'Address cannot exceed 400 characters').isLength({ max: 400 }),
    body('role', 'Invalid role').isIn(['ADMIN', 'NORMAL', 'STORE_OWNER'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, address, role } = req.body;

    try {
        const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExist.rows.length > 0) return res.status(400).json({ error: "Email already registered" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role",
            [name, email, hashedPassword, address, role]
        );

        res.status(201).json({ message: "User created successfully!", user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        res.json({ message: "Login successful", token, role: user.role, id: user.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;