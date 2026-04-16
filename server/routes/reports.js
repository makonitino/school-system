const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/class-grid", (req, res) => {
    const { class: studentClass, subjectId, term } = req.query;

    const students = db.prepare(`
        SELECT * FROM students WHERE class = ?
    `).all(studentClass);

    const assessments = db.prepare(`
        SELECT * FROM assessments
        WHERE subjectId = ? AND term = ?
    `).all(subjectId, term);

    const assessmentsWithTasks = assessments.map(a => {
        const tasks = db.prepare(`
            SELECT * FROM tasks WHERE assessmentId = ?
        `).all(a.id);

        return { ...a, tasks };
    });

    const studentData = students.map(student => {

        const assessmentResults = assessmentsWithTasks.map(assessment => {

            const taskResults = assessment.tasks.map(task => {

                const mark = db.prepare(`
                    SELECT marksObtained FROM marks
                    WHERE studentId = ? AND taskId = ?
                `).get(student.id, task.id);

                return {
                    taskId: task.id,
                    name: task.name,
                    marksObtained: mark ? mark.marksObtained : "",
                };
            });

            return {
                assessmentId: assessment.id,
                name: assessment.type,
                tasks: taskResults
            };
        });

        return {
            studentId: student.id,
            name: `${student.firstName} ${student.lastName}`,
            assessments: assessmentResults
        };
    });

    res.json({
        assessments: assessmentsWithTasks,
        students: studentData,
        term
    });
});

module.exports = router;