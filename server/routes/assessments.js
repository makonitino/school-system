const express = require("express");
const router = express.Router();
const db = require("../db");

// CREATE assessment
router.post("/", (req, res) => {
    const { subjectId, term, type, totalMarks } = req.body;

    const stmt = db.prepare(`
        INSERT INTO assessments (subjectId, term, type, totalMarks)
        VALUES (?, ?, ?, ?)
    `);

    const result =stmt.run(subjectId, term, type, totalMarks);

    res.json({ id: result.lastInsertRowid });
});

// GET all assessments
router.get("/", (req, res) => {
    const assessments = db.prepare(`
        SELECT assessments.*, subjects.name as subjactName
        FROM assessments
        JOIN subjects ON assessments.subjectId = subjects.id
    `).all();

    res.json(assessments);
});

module.exports = router;