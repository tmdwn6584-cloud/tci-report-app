import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const dbPath = path.join(process.cwd(), "db", "tci_results.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const globalWithDb = global as typeof globalThis & {
  __tci_db?: Database.Database;
};

const db = globalWithDb.__tci_db || new Database(dbPath);

if (!globalWithDb.__tci_db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      name TEXT,
      gender TEXT,
      age TEXT,
      mode TEXT,
      status TEXT,
      startedAt TEXT,
      finishedAt TEXT,
      currentQuestionIndex INTEGER,
      totalAnswered INTEGER,
      answersString TEXT,
      questionTimes TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);
  globalWithDb.__tci_db = db;
}

export default db;
