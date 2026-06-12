import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import * as schema from './schema';

const DB_PATH = path.resolve(process.cwd(), 'data', 'inkweave.db');

// 确保 data 目录存在
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(DB_PATH);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

const userColumns = sqlite
  .prepare('PRAGMA table_info(users)')
  .all() as { name: string }[];

if (userColumns.length > 0 && !userColumns.some((column) => column.name === 'password_hash')) {
  sqlite.exec('ALTER TABLE users ADD COLUMN password_hash TEXT');
}

export const db = drizzle(sqlite, { schema });
