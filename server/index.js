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

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http:/localhost:${PORT}`);
});