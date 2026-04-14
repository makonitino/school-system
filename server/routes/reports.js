const express = require("express");
const router = express.Router();
const db = require("../db");

// GET class marks grid
router.get("/class-grid", (req, res) => {
    const { class: studentClass, subjectId, term } = req.query;

    // 1. Get students in class
    const students = db.prepare(`
        SELECT * FROM students WHERE class = ?    
    `).all(studentClass);

    // 2. Get assessments for subjects + term
    const assessments = db.prepare(`
        SELECT * FROM assessments
        WHERE subjectId = ? AND term = ?    
    `).all(subjectId, term);

    // 3. Build grid
    const result =  students.map(student => {
        let total = 0;
        let count = 0;

        const marks = assessments.map(assessment => {
            const mark = db.prepare(`
                SELECT marksObtained, percentage FROM marks
                WHERE studentId = ? AND assessmentId = ?    
            `).get(student.id, assessment.id);

            if (mark) {
                total += mark.percentage;
                count++;
            }

            return {
                assessmentId: assessment.id,
                name: assessment.type,
                mark: mark ? mark.marksObtained : null
            };
        });

        const average = count > 0 ? Math.round(total/count) : null;

        return {
            studentId: student.id,
            name: `${student.firstName} ${student.lastName}`,
            marks,
            average
        };
    });

    res.json({
        assessments,
        students: result,
        term
    });
});

module.exports = router;