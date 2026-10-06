const express = require('express');
const router = express.Router();
const pool = require('../db');
const fetchuser = require('../middleware/fetchuser');

// 1. GET ALL STORES (Public)
router.get('/fetchallstores', async (req, res) => {
    try {
        const stores = await pool.query("SELECT * FROM stores ORDER BY created_at DESC");
        res.json(stores.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// 2. ADD A NEW STORE (Protected - Requires Login)
router.post('/addstore', fetchuser, async (req, res) => {
    try {
        const { name, email, address } = req.body;

        // Check if user has permission
        if (req.user.role === 'NORMAL') {
            return res.status(403).json({ error: "Normal users cannot add stores" });
        }

        const newStore = await pool.query(
            "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, address, req.user.id]
        );

        res.json(newStore.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;