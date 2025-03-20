import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export interface UserData {
  id: number;
  email: string;
  name: string;
  role?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: UserData): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'user'
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserData | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserData;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function getUserById(userId: number) {
  try {
    const users = await query(
      'SELECT id, email, name, role FROM users WHERE id = ?',
      [userId]
    ) as any[];
    
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

export default {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  getUserById
}; 