'use strict';
const mysql = require('mysql2/promise');
const { Pool } = require('pg');
const required = ['MYSQL_LEGACY_HOST', 'MYSQL_LEGACY_USER', 'MYSQL_LEGACY_PASSWORD', 'MYSQL_LEGACY_DATABASE', 'DATABASE_URL'];
for (const key of required) if (!process.env[key]) throw new Error('Missing required environment variable: ' + key);
const tables = [
  { source: 'carouselitem', target: 'CarouselItem', columns: ['id', 'imageUrl', 'title', 'createdAt'] },
  { source: 'course', target: 'Course', columns: ['id', 'title', 'description', 'youtubeUrl', 'type', 'category', 'professor', 'duration', 'createdAt', 'updatedAt'] },
  { source: 'formsubmission', target: 'FormSubmission', columns: ['id', 'type', 'data', 'status', 'createdAt', 'updatedAt'] },
  { source: 'model', target: 'Model', columns: ['id', 'name', 'age', 'height', 'sex', 'category', 'measurements', 'createdAt', 'updatedAt'] },
  { source: 'news', target: 'News', columns: ['id', 'title', 'content', 'imageUrl', 'category', 'date', 'createdAt', 'updatedAt'] },
  { source: 'systemsetting', target: 'SystemSetting', columns: ['id', 'key', 'value'] },
  { source: 'user', target: 'User', columns: ['id', 'email', 'password', 'name', 'role', 'googleId', 'picture', 'phone', 'location', 'createdAt', 'updatedAt'] },
  { source: 'image', target: 'Image', columns: ['id', 'url', 'modelId', 'createdAt'] },
  { source: 'cartitem', target: 'CartItem', columns: ['id', 'userId', 'modelId', 'createdAt'] },
];
const quoted = (value) => '"' + value.replace(/"/g, '""') + '"';
const sourceQuoted = (value) => String.fromCharCode(96) + value + String.fromCharCode(96);
async function main() {
  const source = await mysql.createConnection({ host: process.env.MYSQL_LEGACY_HOST, port: Number(process.env.MYSQL_LEGACY_PORT || 3306), user: process.env.MYSQL_LEGACY_USER, password: process.env.MYSQL_LEGACY_PASSWORD, database: process.env.MYSQL_LEGACY_DATABASE, charset: 'utf8mb4' });
  const target = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const client = await target.connect();
    try {
      await client.query('BEGIN');
      for (const table of tables) {
        const selected = table.columns.map(sourceQuoted).join(', ');
        const [rows] = await source.query('SELECT ' + selected + ' FROM ' + sourceQuoted(table.source));
        if (rows.length > 0) {
          const columns = table.columns.map(quoted).join(', ');
          const placeholders = table.columns.map((_, index) => '$' + (index + 1)).join(', ');
          const sql = 'INSERT INTO ' + quoted(table.target) + ' (' + columns + ') VALUES (' + placeholders + ') ON CONFLICT DO NOTHING';
          for (const row of rows) await client.query(sql, table.columns.map((column) => row[column]));
        }
        const result = await client.query('SELECT COUNT(*)::int AS count FROM ' + quoted(table.target));
        if (Number(result.rows[0].count) < rows.length) throw new Error('Verification failed for ' + table.source);
        console.log('Imported ' + table.source + ': ' + rows.length + ' row(s)');
      }
      await client.query('COMMIT');
      console.log('Legacy MySQL data imported into PostgreSQL successfully.');
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  } finally { await source.end(); await target.end(); }
}
main().catch((error) => { console.error('Legacy import failed:', error.message); process.exitCode = 1; });