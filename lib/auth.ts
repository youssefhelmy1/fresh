import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2/promise';

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// User interface
export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

// JWT payload interface
export interface JwtPayload {
  userId: number;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare a password with a hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate a JWT token
export function generateToken(user: User): string {
  const payload: JwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify a JWT token
export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export default {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken
}; 