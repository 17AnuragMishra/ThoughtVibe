import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Blog } from '@/models/blogModel';
import { User } from '@/models/userModel';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    await connectDB();
    
    const { blogId } = await params;
    const { username } = await request.json();

    // Handle case where user is not authorized
    if (!username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user is already reacted
    const currentUser = await User.findOne({ username }).select(
      "reactedBlogs totalReactions"
    );

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const blogObjectId = new mongoose.Types.ObjectId(blogId);
    
    if (currentUser.reactedBlogs?.includes(blogObjectId)) {
      return NextResponse.json({ error: 'Already reacted' }, { status: 400 });
    }

    // Find the blog and update reaction count
    const reactedBlogs = await Blog.findById(blogId)
      .select("reaction owner")
      .populate({
        path: "owner",
        select: "totalReactions",
      });

    if (!reactedBlogs) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    reactedBlogs.reaction = (reactedBlogs.reaction || 0) + 1;
    await reactedBlogs.save();

    // Update current user's reactions
    if (!currentUser.reactedBlogs) {
      currentUser.reactedBlogs = [];
    }
    currentUser.reactedBlogs.push(blogObjectId);
    currentUser.totalReactions = (currentUser.totalReactions || 0) + 1;
    await currentUser.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding reaction:', error);
    return NextResponse.json({ error: 'Failed to add reaction' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    await connectDB();
    
    const { blogId } = await params;
    const { username } = await request.json();

    // Handle case where user is not authorized
    if (!username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user is not reacted
    const currentUser = await User.findOne({ username }).select(
      "reactedBlogs totalReactions"
    );

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const blogObjectId = new mongoose.Types.ObjectId(blogId);
    
    if (!currentUser.reactedBlogs?.includes(blogObjectId)) {
      return NextResponse.json({ error: 'Not reacted' }, { status: 400 });
    }

    // Find the blog and update reaction count
    const reactedBlogs = await Blog.findById(blogId)
      .select("reaction owner")
      .populate({
        path: "owner",
        select: "totalReactions",
      });

    if (!reactedBlogs) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    reactedBlogs.reaction = Math.max(0, (reactedBlogs.reaction || 0) - 1);
    await reactedBlogs.save();

    // Update current user's reactions
    if (currentUser.reactedBlogs) {
      const index = currentUser.reactedBlogs.indexOf(blogObjectId);
      if (index > -1) {
        currentUser.reactedBlogs.splice(index, 1);
      }
    }
    currentUser.totalReactions = Math.max(0, (currentUser.totalReactions || 0) - 1);
    await currentUser.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing reaction:', error);
    return NextResponse.json({ error: 'Failed to remove reaction' }, { status: 500 });
  }
} 