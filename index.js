const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(cors()); // Allows your GitHub Pages site to talk to this API
app.use(express.json()); // Parses JSON sent from your frontend

// 2. Database Connection (Optimized for Render)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for hosted PostgreSQL
    }
});

// 3. Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the 'users' table
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (result.rows.length > 0) {
            // Success: User found
            res.status(200).json({ 
                success: true, 
                message: "Login successful",
                user: { username: result.rows[0].username }
            });
        } else {
            // Failure: Credentials don't match
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// 4. Test Route (To check if the API is alive)
app.get('/', (req, res) => {
    res.send('Highlands Logistics Hub API is running...');
});

// 5. Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
