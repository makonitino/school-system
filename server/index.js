const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const studentRouters = require("./routes/students");
app.use("/students", studentRouters);

// Health check route 
app.get("/health", (req, res) => {
    res.json({ status: "Server is running"});
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http:/localhost:${PORT}`);
});