import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { Blog } from '@/models/blogModel';
import { User } from '@/models/userModel';
import { getReadingTime } from '@/utils/getReadingTime';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { banner, title, content, username } = await request.json();
    
    // Upload blog banner to Cloudinary
    const public_id = crypto.randomBytes(10).toString("hex");
    const bannerURL = await uploadToCloudinary(banner, public_id);

    // Find the User who is creating the blog
    const user = await User.findOne({ username }).select("_id blogs blogPublished");

    if (!user) {
      return NextResponse.json({
        error: "User not found"
      }, { status: 404 });
    }

    // Creating a new blog post
    const newBlog = await Blog.create({
      banner: {
        url: bannerURL,
        public_id,
      },
      title,
      content,
      owner: user._id,
      readingTime: getReadingTime(content),
    });

    // Update user's blog
    user.blogs.push(newBlog._id);
    user.blogPublished++;
    await user.save();
    
    return NextResponse.json({
      success: true,
      blog: newBlog,
      message: 'Blog created successfully'
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({
      error: 'Failed to create blog'
    }, { status: 500 });
  }
} 