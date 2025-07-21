import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { generateUsername } from '@/utils/generateUsername';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, email, password } = await request.json();
    
    // Create username
    const username = generateUsername(name);

    // Create hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with provided data
    const newUser = await User.create({ name, email, username, password: hashedPassword });

    // Create JWT
    const token = jwt.sign({
      id: newUser._id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      profilePhoto: newUser.profilePhoto?.url
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
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        profilePhoto: newUser.profilePhoto?.url
      },
      message: 'User registered successfully' 
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return NextResponse.json({
          error: "This email is already associated with an account."
        }, { status: 400 });
      }
      if (error.keyPattern?.username) {
        return NextResponse.json({
          error: "This username is already in use."
        }, { status: 400 });
      }
    }
    
    return NextResponse.json({
      error: `Failed to register user. ${error.message}`
    }, { status: 400 });
  }
} 