const Database = require("better-sqlite3");

const db = new Database("school.db");

// STUDENTS
db.prepare(`
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentNumber TEXT,
    firstName TEXT,
    lastName TEXT,
    grade TEXT,
    class TEXT
)
`).run();

// SUBJECTS
db.prepare(`
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    grade TEXT
)
`).run();

// ASSESSMENTS
db.prepare(`
CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subjectId INTEGER,
    term TEXT,
    type TEXT,
    weight REAL,
    FOREIGN KEY (subjectId) REFERENCES subjects(id)
)
`).run();

// TASKS
db.prepare(`
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assessmentId INTEGER,
    name TEXT,
    totalMarks REAL,
    weight REAL,
    FOREIGN KEY (assessmentId) REFERENCES assessments(id)
)
`).run();

// MARKS (IMPORTANT: TASK-BASED ONLY)
db.prepare(`
CREATE TABLE IF NOT EXISTS marks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId INTEGER,
    taskId INTEGER,
    marksObtained REAL,
    UNIQUE(studentId, taskId),
    FOREIGN KEY (studentId) REFERENCES students(id),
    FOREIGN KEY (taskId) REFERENCES tasks(id)
)
`).run();

module.exports = db;