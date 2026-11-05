import { pool } from './config/database';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running database migration...');
    await pool.query(sql);
    console.log('Database schema created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();