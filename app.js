const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 3000;

app.use(express.json());

// Konfigurasi database dari environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secret123',
  database: process.env.DB_NAME || 'testdb',
  port: process.env.DB_PORT || 5432,
};

const client = new Client(dbConfig);

// Koneksi ke database saat server start
client.connect(err => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Connected to database ✅');
    // Buat tabel users kalau belum ada
    client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE
      )
    `);
  }
});

// GET /users - ambil semua users
app.get('/users', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users - tambah user baru
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root endpoint (buat test)
app.get('/', (req, res) => {
  res.send('Server nyala banggg 🚀 with Database!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
