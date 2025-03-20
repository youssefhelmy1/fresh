import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { comparePassword, generateToken, User } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Email and password are required' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Query the database for the user
    const users = await db.query<User[]>(
      'SELECT * FROM users WHERE email = ? LIMIT 1', 
      [email]
    );

    // Check if user exists
    if (!users.length) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid credentials' 
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid credentials' 
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return success response with token
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'An error occurred during login' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 