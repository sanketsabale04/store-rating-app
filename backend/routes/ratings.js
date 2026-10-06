const express = require('express');
const router = express.Router();
const pool = require('../db');
const fetchuser = require('../middleware/fetchuser');

// 1. ADD A RATING (Protected - Requires Login)
router.post('/add', fetchuser, async (req, res) => {
    try {
        const { store_id, rating, review } = req.body;

        // Check if user already rated this store
        const existingRating = await pool.query(
            "SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2",
            [req.user.id, store_id]
        );
        
        if (existingRating.rows.length > 0) {
            return res.status(400).json({ error: "You have already rated this store" });
        }

        const newRating = await pool.query(
            "INSERT INTO ratings (user_id, store_id, rating, review) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.user.id, store_id, rating, review]
        );

        res.json(newRating.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// 2. GET RATINGS FOR A SPECIFIC STORE (Public)
router.get('/store/:storeId', async (req, res) => {
    try {
        const ratings = await pool.query(
            `SELECT ratings.*, users.name 
             FROM ratings 
             JOIN users ON ratings.user_id = users.id 
             WHERE store_id = $1 
             ORDER BY created_at DESC`,
            [req.params.storeId]
        );
        res.json(ratings.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;