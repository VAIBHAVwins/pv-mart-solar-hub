// scripts/migrate-profiles-to-customers-vendors.cjs
// Node.js script to migrate profiles to customers/vendors tables (CommonJS)

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres',
});

async function migrateProfiles() {
  await client.connect();
  try {
    // 1. Read all profiles
    const profilesRes = await client.query('SELECT * FROM profiles');
    const profiles = profilesRes.rows;
    let migrated = 0, skipped = 0;

    for (const profile of profiles) {
      // 2. Find user in auth.users by email
      const userRes = await client.query('SELECT id FROM auth.users WHERE email = $1', [profile.email]);
      if (userRes.rows.length === 0) {
        console.warn(`No auth.users entry for email: ${profile.email}, skipping.`);
        skipped++;
        continue;
      }
      const user_id = userRes.rows[0].id;
      // 3. Insert into customers or vendors
      if (profile.role === 'customer') {
        // Check for existing customer
        const exists = await client.query('SELECT 1 FROM customers WHERE user_id = $1', [user_id]);
        if (exists.rows.length === 0) {
          await client.query(
            'INSERT INTO customers (user_id, name, phone, created_at) VALUES ($1, $2, $3, $4)',
            [user_id, profile.name, profile.phone, profile.created_at]
          );
          console.log(`Migrated customer: ${profile.email}`);
          migrated++;
        } else {
          console.log(`Customer already exists: ${profile.email}`);
          skipped++;
        }
      } else if (profile.role === 'vendor') {
        // Check for existing vendor
        const exists = await client.query('SELECT 1 FROM vendors WHERE user_id = $1', [user_id]);
        if (exists.rows.length === 0) {
          await client.query(
            'INSERT INTO vendors (user_id, name, phone, created_at) VALUES ($1, $2, $3, $4)',
            [user_id, profile.name, profile.phone, profile.created_at]
          );
          console.log(`Migrated vendor: ${profile.email}`);
          migrated++;
        } else {
          console.log(`Vendor already exists: ${profile.email}`);
          skipped++;
        }
      } else {
        console.warn(`Unknown role for profile: ${profile.email}, skipping.`);
        skipped++;
      }
    }
    console.log(`Migration complete. Migrated: ${migrated}, Skipped: ${skipped}`);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.end();
  }
}

migrateProfiles(); 