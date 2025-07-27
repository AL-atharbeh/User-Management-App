const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Middleware
app.use(cors());
app.use(express.json());

// MySQL database connection
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // ⚠️ UPDATE THIS: Set your MySQL root password here if you have one
  database: 'user_management',
  port: 3306, // Try 3307 if 3306 doesn't work (XAMPP sometimes uses 3307)
  waitForConnections: true,
  connectionLimit: 5, // Reduced from 10 to avoid overwhelming MySQL
  queueLimit: 0,
  acquireTimeout: 15000, // Reduced from 60s to 15s
  timeout: 10000, // Reduced from 60s to 10s
  reconnect: true,
  multipleStatements: false,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

let db;

// Helper function to handle database errors and retry connections
const handleDbError = async (operation, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Database operation failed (attempt ${i + 1}/${retries + 1}):`, error.message);
      
      if (i === retries) {
        throw error; // Re-throw on final attempt
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Initialize MySQL connection and database
const initializeDatabase = async () => {
  try {
    console.log('🔄 Connecting to MySQL...');
    console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`👤 User: ${dbConfig.user}`);
    
    // Connect to MySQL without specifying database first
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS user_management');
    console.log('✅ Database "user_management" ready');
    
    await connection.end();

    // Create connection pool to the specific database
    db = mysql.createPool(dbConfig);
    console.log('✅ Connected to MySQL database');
    
    // Test the connection pool
    const [rows] = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection pool tested successfully');

    // Create users table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ready');

    // Create admin account if it doesn't exist (non-blocking)
    createAdminAccount().catch(error => {
      console.error('❌ Admin account creation failed (non-critical):', error.message);
    });
    
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    console.error('❌ Error code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('');
      console.log('🚨 MYSQL CONNECTION FAILED!');
      console.log('📋 Troubleshooting steps:');
      console.log('   1. Start XAMPP Control Panel and click "Start" next to MySQL');
      console.log('   2. Or try changing port to 3307 in server.js');
      console.log('   3. Make sure MySQL service is running');
      console.log('   4. Check if you have a MySQL password set');
      console.log('');
    }
    
    process.exit(1);
  }
};

// Function to create admin account
const createAdminAccount = async () => {
  try {
    console.log('🔐 Starting admin account creation...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('🔐 Password hashed for admin account');
    
    // Check if admin account already exists
    console.log('🔍 Checking for existing admin account...');
    const [existingAdmin] = await handleDbError(async () => {
      return await db.execute(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        ['admin@admin.com', 'admin']
      );
    });
    console.log('🔍 Admin check query completed');

    if (existingAdmin.length === 0) {
      console.log('👤 Creating new admin account...');
      await handleDbError(async () => {
        return await db.execute(
          'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
          ['admin', 'admin@admin.com', hashedPassword, 'Administrator', 'admin']
        );
      });
      console.log('✅ Admin account created successfully');
      console.log('✅ Admin credentials: admin@admin.com / admin123');
    } else {
      console.log('ℹ️ Admin account already exists');
    }
    console.log('🔐 Admin account creation completed');
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    console.error('❌ Error stack:', error.stack);
  }
};

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Register user
app.post('/api/register', async (req, res) => {
  console.log('📥 === REGISTER REQUEST START ===');
  console.log('📥 Incoming request body:', req.body);
  
  const { username, email, password, full_name, role } = req.body;
  
  console.log('📝 Extracted fields:');
  console.log('   - username:', username);
  console.log('   - email:', email);
  console.log('   - password:', password ? '[PROVIDED]' : '[MISSING]');
  console.log('   - full_name:', full_name);
  console.log('   - role:', role);

  // Validate required fields
  if (!username || !email || !password) {
    console.log('❌ Validation failed: Missing required fields');
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  console.log('✅ Basic validation passed');

  try {
    console.log('🔍 Checking for existing users...');
    
    // Check if user already exists (with retry logic)
    const [existingUsers] = await handleDbError(async () => {
      return await db.execute(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email]
      );
    });
    
    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      console.log('❌ User already exists:', { id: existingUser.id, username: existingUser.username, email: existingUser.email });
      
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    console.log('✅ No existing user found, proceeding with registration');

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully');

    console.log('💾 Inserting user into database...');
    console.log('💾 Data to insert:', [username, email, '[HASHED_PASSWORD]', full_name || '', role || 'user']);

    // Insert user into database (with retry logic)
    const [result] = await handleDbError(async () => {
      return await db.execute(
        'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, full_name || '', role || 'user']
      );
    });

    console.log('✅ User inserted successfully!');
    console.log('✅ New user ID:', result.insertId);
    
    const responseData = {
      message: 'User created successfully',
      user: { 
        id: result.insertId, 
        username, 
        email, 
        full_name: full_name || '', 
        role: role || 'user' 
      }
    };
    
    console.log('✅ Sending success response:', responseData);
    console.log('📤 === REGISTER REQUEST END ===');
    
    res.status(201).json(responseData);

  } catch (error) {
    console.error('❌ Unexpected error in register function:', error);
    console.error('❌ Error stack:', error.stack);
    console.log('📤 === REGISTER REQUEST END (ERROR) ===');
    
    // Handle MySQL specific errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    
    res.status(500).json({ error: 'Server error - ' + error.message });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const [users] = await handleDbError(async () => {
      return await db.execute(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, username]
      );
    });

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token with role information
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role || 'user' 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const [users] = await handleDbError(async () => {
      return await db.execute(
        'SELECT id, username, email, full_name, role, created_at FROM users'
      );
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const [users] = await db.execute(
      'SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { username, email, full_name } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE users SET username = ?, email = ?, full_name = ? WHERE id = ?',
      [username, email, full_name || '', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  // Prevent deletion of admin account (ID 1)
  if (id === '1') {
    return res.status(403).json({ error: 'Cannot delete admin account' });
  }

  try {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Initialize database and start server
const startServer = async () => {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  if (db) {
    await db.end();
    console.log('✅ Database connection closed.');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  if (db) {
    await db.end();
    console.log('✅ Database connection closed.');
  }
  process.exit(0);
});

// Start the server
startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

module.exports = app; 