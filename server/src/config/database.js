import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import fs from 'fs';
// Database file location
const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'bloodconnect.db');
const db = new DatabaseSync(dbPath);
// Enable foreign keys and WAL mode for performance and safety
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');
/**
 * Initialize DB schema tables
 */
export function initDatabaseSchema() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('donor', 'patient', 'hospital', 'blood_bank', 'admin')),
      avatar_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS donor_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      blood_group TEXT NOT NULL,
      date_of_birth TEXT,
      gender TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      address TEXT,
      latitude REAL,
      longitude REAL,
      last_donation_date TEXT,
      available INTEGER DEFAULT 1,
      verified INTEGER DEFAULT 0,
      donation_count INTEGER DEFAULT 0,
      eligibility_notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS hospitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      verified INTEGER DEFAULT 1,
      inventory_summary TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS blood_banks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      stock_summary TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS blood_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_number TEXT UNIQUE NOT NULL,
      requester_id INTEGER NOT NULL,
      patient_name TEXT NOT NULL,
      blood_group TEXT NOT NULL,
      units_required INTEGER NOT NULL,
      hospital_name TEXT NOT NULL,
      hospital_id INTEGER,
      hospital_address TEXT,
      city TEXT NOT NULL,
      address TEXT,
      latitude REAL,
      longitude REAL,
      required_date TEXT NOT NULL,
      required_time TEXT,
      priority TEXT NOT NULL DEFAULT 'Normal',
      reason TEXT,
      contact_number TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Request Created',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS donor_matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id INTEGER NOT NULL,
      donor_id INTEGER NOT NULL,
      compatibility_score INTEGER NOT NULL,
      distance REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Suggested',
      contacted_at TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (request_id) REFERENCES blood_requests(id) ON DELETE CASCADE,
      FOREIGN KEY (donor_id) REFERENCES donor_profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donor_id INTEGER NOT NULL,
      request_id INTEGER,
      hospital_id INTEGER,
      hospital_name TEXT,
      donation_date TEXT NOT NULL,
      units INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'Completed',
      certificate_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (donor_id) REFERENCES donor_profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (request_id) REFERENCES blood_requests(id) ON DELETE SET NULL,
      FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'system',
      link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}
/**
 * DB wrapper helper functions
 */
export const dbHelper = {
    get: (sql, params = []) => {
        const stmt = db.prepare(sql);
        return stmt.get(...params);
    },
    all: (sql, params = []) => {
        const stmt = db.prepare(sql);
        return stmt.all(...params);
    },
    run: (sql, params = []) => {
        const stmt = db.prepare(sql);
        return stmt.run(...params);
    },
    exec: (sql) => {
        db.exec(sql);
    }
};
export default db;
