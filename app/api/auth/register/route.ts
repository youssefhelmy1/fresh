import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { hashPassword, generateToken, User } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Name, email, and password are required' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user already exists
    const existingUsers = await db.query<User[]>(
      'SELECT * FROM users WHERE email = ? LIMIT 1', 
      [email]
    );

    if (existingUsers.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Email already in use' 
        }),
        { 
          status: 409, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user into database
    const result = await db.insert('users', {
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date()
    });

    if (!result.insertId) {
      throw new Error('Failed to create user');
    }

    // Get the newly created user
    const users = await db.query<User[]>(
      'SELECT * FROM users WHERE id = ? LIMIT 1', 
      [result.insertId]
    );

    const user = users[0];

    // Generate JWT token
    const token = generateToken(user);

    // Return success response with token
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Registration successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }),
      { 
        status: 201, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'An error occurred during registration' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 