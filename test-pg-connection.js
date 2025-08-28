const { Client } = require('pg');

async function testPgConnection() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'marketplace',
    password: 'postgres',
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
    
    // Try with different password
    console.log('Trying with empty password...');
    const client2 = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'marketplace',
      password: '',
      port: 5432,
    });
    
    try {
      await client2.connect();
      console.log('Connected with empty password');
      await client2.end();
    } catch (err2) {
      console.error('Connection with empty password failed:', err2);
    }
  }
}

testPgConnection();