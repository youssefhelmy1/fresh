import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ResultSetHeader } from 'mysql2/promise';

export async function POST(request: NextRequest) {
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
    
    // Parse request body
    const body = await request.json();
    const { lesson_date, lesson_type } = body;
    
    // Validate input
    if (!lesson_date || !lesson_type) {
      return NextResponse.json(
        { error: 'Lesson date and type are required' },
        { status: 400 }
      );
    }
    
    // Create the booking
    const result = await db.insert('bookings', {
      user_id: payload.userId,
      lesson_date,
      lesson_type,
      status: 'pending'
    }) as ResultSetHeader;
    
    // Return success response
    return NextResponse.json({
      message: 'Booking created successfully',
      booking: {
        id: result.insertId,
        user_id: payload.userId,
        lesson_date,
        lesson_type,
        status: 'pending'
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the booking' },
      { status: 500 }
    );
  }
} 