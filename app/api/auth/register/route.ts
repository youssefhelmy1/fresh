import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword, generateToken, User } from '@/lib/auth';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export async function POST(request: NextRequest) {
  try {
    // Initialize database if needed
    await db.initDatabase();
    
    // Parse request body
    const body = await request.json();
    const { name, email, password } = body;
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUsers = await db.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const result = await db.insert('users', {
      name,
      email,
      password: hashedPassword
    }) as ResultSetHeader;
    
    // Get the created user
    const users = await db.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
    
    const user = users[0] as User;
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return success response
    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 