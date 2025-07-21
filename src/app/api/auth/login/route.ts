import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();

    // Find user from database
    const currentUser = await User.findOne({ email });

    if (!currentUser) {
      return NextResponse.json({
        error: "No user found with this email address."
      }, { status: 400 });
    }

    // Check if password is valid
    const isValidPassword = await bcrypt.compare(password, currentUser.password);
    
    if (!isValidPassword) {
      return NextResponse.json({
        error: "Invalid password. Please ensure you've entered the correct password and try again."
      }, { status: 400 });
    }

    // Create JWT
    const token = jwt.sign({
      id: currentUser._id,
      username: currentUser.username,
      name: currentUser.name,
      email: currentUser.email,
      profilePhoto: currentUser.profilePhoto?.url
    }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    // Set cookie
    (await cookies()).set('thoughtvibe_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Return minimal user info
    return NextResponse.json({
      success: true,
      user: {
        name: currentUser.name,
        username: currentUser.username,
        email: currentUser.email,
        profilePhoto: currentUser.profilePhoto?.url
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      error: 'Login failed. Please try again.'
    }, { status: 500 });
  }
} 