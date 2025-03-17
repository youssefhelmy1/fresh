import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Initialize the database
    await db.initDatabase();
    
    return NextResponse.json({
      message: 'Database initialized successfully'
    });
    
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: 'An error occurred while initializing the database' },
      { status: 500 }
    );
  }
} 