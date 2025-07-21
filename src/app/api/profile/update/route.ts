import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { uploadToCloudinary } from '@/lib/cloudinary';
import crypto from 'crypto';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { username, name, bio, profilePhoto } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Find the user
    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    
    if (name) {
      updateData.name = name;
    }
    
    if (bio !== undefined) {
      updateData.bio = bio;
    }

    // Handle profile photo upload if provided
    if (profilePhoto && profilePhoto.startsWith('data:image')) {
      try {
        const public_id = crypto.randomBytes(10).toString('hex');
        const url = await uploadToCloudinary(profilePhoto, public_id);
        updateData.profilePhoto = {
          url,
          public_id
        };
      } catch (uploadError) {
        console.error('Error uploading profile photo:', uploadError);
        return NextResponse.json({ error: 'Failed to upload profile photo' }, { status: 500 });
      }
    }

    // Update the user
    const updatedUser = await User.findOneAndUpdate(
      { username },
      updateData,
      { new: true }
    ).select('name username bio profilePhoto');

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
} 