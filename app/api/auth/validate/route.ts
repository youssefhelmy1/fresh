import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Authentication token is required' 
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Extract the token
    const token = authHeader.substring(7);
    
    try {
      // Verify the token
      const payload = verifyToken(token);
      
      // Validate payload
      if (!payload || !payload.userId || !payload.name || !payload.email) {
        throw new Error('Invalid token payload');
      }
      
      // Return the user information from the token
      return new Response(
        JSON.stringify({ 
          success: true, 
          user: {
            id: payload.userId,
            name: payload.name,
            email: payload.email
          }
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid or expired token' 
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Token validation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'An error occurred during token validation' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 