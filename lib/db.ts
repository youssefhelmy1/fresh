import mysql from 'mysql2/promise';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'guitar_lessons',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Initialize the database - create tables if they don't exist
export async function initDatabase() {
  try {
    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        lesson_type VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        time_slot VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create payments table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) DEFAULT 'pending',
        payment_method VARCHAR(50),
        transaction_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
      )
    `);

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Test the connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Query helper function
const query = <T extends RowDataPacket[]>(sql: string, params?: any[]): Promise<T> => {
  return Promise.resolve([] as unknown as T);
};

// Execute helper function
const execute = (sql: string, params?: any[]): Promise<ResultSetHeader> => {
  return Promise.resolve({
    affectedRows: 0,
    insertId: 0,
    warningStatus: 0,
    fieldCount: 0,
    info: '',
    serverStatus: 0,
    changedRows: 0
  } as ResultSetHeader);
};

// Insert helper function
const insert = (table: string, data: Record<string, any>): Promise<ResultSetHeader> => {
  return Promise.resolve({
    affectedRows: 0,
    insertId: 0,
    warningStatus: 0,
    fieldCount: 0,
    info: '',
    serverStatus: 0,
    changedRows: 0
  } as ResultSetHeader);
};

// Update helper function
const update = (table: string, data: Record<string, any>, whereClause: string, whereParams: any[]): Promise<ResultSetHeader> => {
  return Promise.resolve({
    affectedRows: 0,
    insertId: 0,
    warningStatus: 0,
    fieldCount: 0,
    info: '',
    serverStatus: 0,
    changedRows: 0
  } as ResultSetHeader);
};

// Transaction helper
const transaction = <T>(callback: any): Promise<T> => {
  return Promise.resolve({} as T);
};

// Module exports
const db = {
  query,
  execute,
  insert,
  update,
  transaction,
  testConnection,
  initDatabase,
  pool
};

export { pool };
export default db; 