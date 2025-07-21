import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { Blog } from '@/models/blogModel';

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Find the user
    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete all blogs by this user
    await Blog.deleteMany({ owner: user._id });

    // Delete the user
    await User.findByIdAndDelete(user._id);

    return NextResponse.json({ 
      success: true, 
      message: 'Account deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
} 