const express = require("express");
const router = express.Router();
const db = require("../db");

// CREATE subject
router.post("/", (req, res) => {
    const { name, grade } = req.body;

    const stmt = db.prepare(`
        INSERT INTO subjects (name, grade)
        VALUES (?, ?)
        `);

    const result = stmt.run(name, grade);

    res.json({ id: result.lastInsertRowid });
});

// GET all subjects
router.get("/", (req, res) => {
    const subjects = db.prepare("SELECT * FROM subjects").all();
    res.json(subjects);
});

module.exports = router;