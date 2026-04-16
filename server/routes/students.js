const express = require("express");
const router = express.Router();
const db = require("../db");

// CREATE student
router.post("/", (req, res) => {
    const { studentNumber, firstName, lastName, grade, class: studentClass } = req.body;

    const stmt = db.prepare(`
        INSERT  INTO students (studentNumber, firstName, lastName, grade, class)
        VALUES (?, ?, ?, ?, ?)
        `);
    
    const result = stmt.run(studentNumber, firstName, lastName, grade, studentClass);

    res.json({ id: result.lastInsertRowid });
});

// GET all students
router.get("/", (req, res) => {
    const students = db.prepare("SELECT * FROM students").all();
    res.json(students);

});

// GET single student
router.get("/:id", (req, res) => {
    const student = db.prepare("SELECT * FROM students WHERE id = ?").get(req.params.id);

    if (!student) {
        return res.status(404).json({ error: "Student not fount" });
    }

    res.json(student);
});

module.exports = router;