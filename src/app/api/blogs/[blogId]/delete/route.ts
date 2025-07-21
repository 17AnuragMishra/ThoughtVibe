import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Blog } from '@/models/blogModel';
import { User } from '@/models/userModel';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    await connectDB();
    
    const { blogId } = await params;
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deletedBlog = await Blog.findOne({ _id: blogId }).select("reaction totalVisit");

    if (!deletedBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const currentUser = await User.findOne({ username }).select("blogPublished totalVisits totalReactions blogs");

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user information
    currentUser.blogPublished = Math.max(0, (currentUser.blogPublished || 0) - 1);
    currentUser.totalVisits = Math.max(0, (currentUser.totalVisits || 0) - (deletedBlog.totalVisit || 0));
    currentUser.totalReactions = Math.max(0, (currentUser.totalReactions || 0) - (deletedBlog.reaction || 0));
    
    const blogObjectId = new mongoose.Types.ObjectId(blogId);
    const blogIndex = currentUser.blogs?.indexOf(blogObjectId);
    if (blogIndex !== undefined && blogIndex > -1) {
      currentUser.blogs?.splice(blogIndex, 1);
    }
    
    await currentUser.save();

    // Delete blog from database
    await Blog.deleteOne({ _id: blogId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
} 