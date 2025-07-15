// scripts/cleanup-duplicate-vendors-new-structure.js
// Node.js script to clean up duplicate vendor accounts

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres',
});

async function cleanupDuplicates() {
  await client.connect();
  try {
    // 1. Find emails present in both customers and vendors
    const res = await client.query(`
      SELECT u.email, v.user_id AS vendor_user_id
      FROM vendors v
      JOIN auth.users u ON v.user_id = u.id
      WHERE u.email IN (
        SELECT u2.email
        FROM customers c
        JOIN auth.users u2 ON c.user_id = u2.id
      )
    `);
    if (res.rows.length === 0) {
      console.log('No duplicate vendor accounts found.');
      return;
    }
    let deleted = 0;
    for (const row of res.rows) {
      await client.query('DELETE FROM vendors WHERE user_id = $1', [row.vendor_user_id]);
      console.log(`Deleted vendor for email: ${row.email}`);
      deleted++;
    }
    console.log(`Cleanup complete. Deleted: ${deleted} vendor accounts.`);
  } catch (err) {
    console.error('Cleanup error:', err);
  } finally {
    await client.end();
  }
}

cleanupDuplicates(); 