import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }
    const user = await User.findOne({ username });
    return NextResponse.json({ available: !user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check username' }, { status: 500 });
  }
} 