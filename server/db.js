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
    )`).run();

module.exports = db;;