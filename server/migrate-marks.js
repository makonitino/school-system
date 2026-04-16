// migrate-marks.js
const Database = require("better-sqlite3");
const db = new Database("school.db");

console.log("Starting marks table migration...");

try {
    // 1. Check if old marks table exists (with assessmentId)
    const oldTable = db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='marks_old'
    `).get();

    if (!oldTable) {
        const marksExists = db.prepare(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='marks'
        `).get();

        if (marksExists) {
            console.log("Renaming old 'marks' table to 'marks_old'...");
            db.prepare(`ALTER TABLE marks RENAME TO marks_old`).run();
        }
    }

    // 2. Now let db.js create the new clean 'marks' table (task-based)
    console.log("Creating new 'marks' table (task-based)...");
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

    // 3. Optional: If you want to keep old data (not recommended, as structure changed)
    // You can manually copy later if needed.

    console.log("Migration completed successfully!");
    console.log("→ New 'marks' table is ready.");
    console.log("→ Old data is in 'marks_old' if it existed.");

} catch (err) {
    console.error("Migration error:", err.message);
} finally {
    db.close();
}