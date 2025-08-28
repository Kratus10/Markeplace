const { Client } = require('pg');

async function testPgConnection() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'justine10',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully');
    
    const res = await client.query('SELECT NOW()');
    console.log('Current time:', res.rows[0].now);
    
    await client.end();
  } catch (err) {
    console.error('Connection error:', err);
  }
}

testPgConnection();