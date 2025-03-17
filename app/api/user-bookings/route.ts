import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { RowDataPacket } from 'mysql2/promise';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const payload = verifyToken(token);
    
    // Get the user ID from the query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Ensure the user ID matches the token
    if (!userId || parseInt(userId) !== payload.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Fetch the user's bookings
    const bookings = await db.query<RowDataPacket[]>(
      `SELECT * FROM bookings WHERE user_id = ? ORDER BY lesson_date DESC`,
      [userId]
    );
    
    // Return the bookings
    return NextResponse.json({
      bookings
    });
    
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching bookings' },
      { status: 500 }
    );
  }
} 