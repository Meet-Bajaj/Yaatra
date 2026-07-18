import { Client } from 'pg';

async function createDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'SuperSecurePassword123!',
    database: 'postgres', // Existing database
  });

  await client.connect();

  try {
    await client.query('CREATE DATABASE yaatri');
    console.log('✅ Database created.');
  } catch (err: any) {
    if (err.code === '42P04') {
      console.log('ℹ️ Database already exists.');
    } else {
      throw err;
    }
  } finally {
    await client.end();
  }
}

createDatabase().catch(console.error);
