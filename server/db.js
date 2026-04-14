const Database = require("better-sqlite3");

const db = new Database("school.db");

// Create tables
db.prepare(`
    CREATE TABLE IF NOT EXISTS students(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentNumber TEXT,
        firstName TEXT,
        lastName TEXT,
        grade TEXT,
        class TEXT
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    grade TEXT
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS assessments (
        id  INTEGER PRIMARY KEY AUTOINCREMENT,
        subjectId INTEGER,
        term TEXT,
        type TEXT,
        totalMarks INTEGER,
        FOREIGN KEY (subjectId) REFERENCES subjects(ID)
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS marks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER,
        subjectId INTEGER,
        assessmentId INTEGER,
        marksObtained INTEGER,
        percentage REAL,
        level INTEGER,
        UNIQUE(studentId, assessmentId)
        FOREIGN KEY (studentId) REFERENCES students(id),
        FOREIGN KEY (subjectId) REFERENCES subjects(id),
        FOREIGN KEY (assessmentId) REFERENCES assessments(id)
    )
`).run();

module.exports = db;;