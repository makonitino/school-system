// import { route } from "./students";

const express = require("express");
const router = express.Router();
const db = require("../db");


// level Calculation
function getLevel(percentage) {
    if (percentage >= 80) return 7;
    if (percentage >= 70) return 6;
    if (percentage >= 60) return 5;
    if (percentage >= 50) return 4;
    if (percentage >= 40) return 3;
    if (percentage >= 30) return 2;
    return 1;
}

// CREATE mark
router.post("/", (req, res) => {
    const { studentId, subjectId, assessmentId, marksObtained } = req.body;

    // GET total marks from assessment
    const assessment = db.prepare(`
        SELECT totalMarks FROM assessments WHERE id = ?
    `).get(assessmentId);

    if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
    }

    const percentage = (marksObtained / assessment.totalMarks) * 100;
    const level = getLevel(percentage);

    const stmt = db.prepare(`
        INSERT INTO marks (studentId, subjectId, assessmentId, marksObtained, percentage, level)
        VALUES (?, ?, ?, ?, ?, ?)    
    `);

    try {
        const result = stmt.run(
            studentId,
            subjectId,
            assessmentId,
            marksObtained,
            percentage,
            level
        );

        res.json({
            id: result.lastInsertRowid,
            percentage,
            level
        });

    } catch (error) {
        res.status(400).json({
            error: "Marks already exists for this student and assessments"
        });
    }
});

// GET marks for a student
router.get("/student/:id", (req, res) => {
    const marks = db.prepare(`
        SELECT
            marks.*,
            subjects.name as subjectName,
            assessments.type as assessmentType
        FROM marks
        JOIN subjects ON marks.subjectId = subjects.id
        JOIN assessments ON marks.assessmentId = assessments.id
        WHERE studentId = ?    
    `).all(req.params.id);

    res.json(marks);
});

// Update Marks
router.put("/:id", (req, res) => {
    const { marksObtained } = req.body;

    const mark = db.prepare(`
        SELECT assessmentId FROM marks WHERE id = ?    
    `).get(req.params.id);

    if (!mark) {
        return res.status(404).json({ error: "Marks not fount"});
    }

    const assessment = db.prepare(`
        SELECT totalMarks FROM assessments WHERE id = ?    
    `).get(marks.assessmentId);

    const percentage = Math.round((marksObtained / assessment.totalMarks) * 100);
    const level = getLevel(percentage);

    db.prepare(`
        UPDATE marks
        SET marksObtained = ?, percentage = ?, level = ?
        WHERE id = ?    
    `).run(marksObtained, percentage, level, req.params.id);

    res.json({ percentage, level });

});

// delete marks
router.delete("/:id", (req, res) => {
    db.prepare("DELETE FROM marks WHERE id = ?").run(req.params.id);
    res.json({ message: "Mark deleted" });
});

module.exports = router;