const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const studentRoutes = require("./routes/students");
app.use("/students", studentRoutes);

const subjectRoutes = require("./routes/subjects");
app.use("/subjects", subjectRoutes);

const assessmentRoutes = require("./routes/assessments");
app.use("/assessments", assessmentRoutes);

const marksRoutes = require("./routes/marks");
app.use("/marks", marksRoutes);

const reportRoutes = require("./routes/reports");
app.use("/reports", reportRoutes);

// Health check route 
app.get("/health", (req, res) => {
    res.json({ status: "Server is running"});
});

// temporary
// app.get("/debug/tables", (req, res) => {
//     const tables = db.prepare(`
//         SELECT name FROM sqlite_master WHERE type='table'
//     `).all();

//     res.json(tables);
// });

// app.get("/debug/tasks", (req, res) => {
//     const tasks = db.prepare("SELECT * FROM tasks").all();
//     res.json(tasks);
// });

// app.get("/debug/insert-tasks", (req, res) => {
//     try {
//         const result = db.prepare(`
//             INSERT INTO tasks (assessmentId, name, totalMarks, weight)
//             VALUES 
//             (1, 'T1', 15, 40),
//             (1, 'T2', 15, 40),
//             (2, 'A1', 20, 50),
//             (2, 'A2', 20, 50)
//         `).run();

//         res.json({ success: true, result });
//     } catch (err) {
//         res.json({ error: err.message });
//     }
// });

// app.get("/debug/fix-marks-step1", (req, res) => {
//     try {
//         db.prepare(`
//             ALTER TABLE marks RENAME TO marks_old
//         `).run();

//         res.json({ success: true, step: 1 });
//     } catch (err) {
//         res.json({ error: err.message });
//     }
// });


// app.get("/debug/insert-tasks", (req, res) => {
//     try {
//         db.prepare(`
//             INSERT INTO tasks (assessmentId, name, totalMarks, weight)
//             VALUES 
//             (1, 'T1', 15, 40),
//             (1, 'T2', 15, 40),
//             (2, 'A1', 20, 50),
//             (2, 'A2', 20, 50)
//         `).run();

//         res.json({ success: true });
//     } catch (err) {
//         res.json({ error: err.message });
//     }
// });

// app.get("/debug/insert-marks", (req, res) => {
//     try {
//         db.prepare(`
//             INSERT INTO marks (studentId, taskId, marksObtained)
//             VALUES
//             (1, 1, 7.5),
//             (1, 2, 15),
//             (2, 1, 10),
//             (2, 2, 12)
//         `).run();

//         res.json({ success: true });
//     } catch (err) {
//         res.json({ error: err.message });
//     }
// });

// app.get("/debug/drop-marks", (req, res) => {
//     try {
//         db.prepare(`DROP TABLE marks`).run();
//         res.json({ success: true });
//     } catch (err) {
//         res.json({ error: err.message });
//     }
// });

// app.get("/debug/insert-tasks", (req, res) => {
//     try {
//         db.prepare(`
//             INSERT INTO tasks (assessmentId, name, totalMarks, weight)
//             VALUES 
//             (1, 'T1', 15, 40),
//             (1, 'T2', 15, 40),
//             (2, 'A1', 20, 50),
//             (2, 'A2', 20, 50)
//         `).run();

//         res.json({ success: true });
//     } catch (err) {
//         res.json({ error: err.message });
//     }
// });

// app.get("/debug/insert-marks", (req, res) => {
//     try {
//         db.prepare(`
//             INSERT INTO marks (studentId, taskId, marksObtained)
//             VALUES
//             (1, 1, 7.5),
//             (1, 2, 15),
//             (2, 1, 10),
//             (2, 2, 12)
//         `).run();

//         res.json({ success: true });
//     } catch (err) {
//         res.json({ error: err.message });
//     }
// });
// app.get("/debug/clear-marks", (req, res) => {
//     try {
//         db.prepare(`DELETE FROM marks`).run();
//         res.json({ success: true });
//     } catch (err) {
//         res.json({ error: err.message });
//     }
// });

// app.get("/debug/clear-tasks", (req, res) => {
//     try {
//         db.prepare(`DELETE FROM tasks`).run();
//         res.json({ success: true });
//     } catch (err) {
//         res.json({ error: err.message });
//     }
// });

// app.get("/debug/insert-tasks", (req, res) => {
//     try {
//         db.prepare(`
//             INSERT INTO tasks (assessmentId, name, totalMarks, weight)
//             VALUES 
//             (1, 'T1', 15, 40),
//             (1, 'T2', 15, 40),
//             (2, 'A1', 20, 50),
//             (2, 'A2', 20, 50)
//         `).run();

//         res.json({ success: true });
//     } catch (err) {
//         res.json({ error: err.message });
//     }
// });

// app.get("/debug/insert-marks", (req, res) => {
//     try {
//         db.prepare(`
//             SELECT * FROM marks;
//         `).run();

//         res.json({ success: true });
//     } catch (err) {
//         res.json({ error: err.message });
//     }
// });


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http:/localhost:${PORT}`);
});