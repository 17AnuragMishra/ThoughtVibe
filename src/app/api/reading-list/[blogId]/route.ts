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

    if (!username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find current user and check if already added current blog to reading list
    const currentUser = await User.findOne({ username }).select("readingList");
    
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const blogObjectId = new mongoose.Types.ObjectId(blogId);
    
    if (currentUser.readingList?.includes(blogObjectId)) {
      return NextResponse.json({ error: 'Already in reading list' }, { status: 400 });
    }

    // Update current user reading list and save
    if (!currentUser.readingList) {
      currentUser.readingList = [];
    }
    currentUser.readingList.push(blogObjectId);
    await currentUser.save();

    // Find total bookmark and save
    const readingListBlogs = await Blog.findById(blogId).select("totalBookmark");
    
    if (readingListBlogs) {
      readingListBlogs.totalBookmark = (readingListBlogs.totalBookmark || 0) + 1;
      await readingListBlogs.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to reading list:', error);
    return NextResponse.json({ error: 'Failed to add to reading list' }, { status: 500 });
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

    if (!username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find current user and check if current blog not in reading list
    const currentUser = await User.findOne({ username }).select("readingList");
    
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const blogObjectId = new mongoose.Types.ObjectId(blogId);
    
    if (!currentUser.readingList?.includes(blogObjectId)) {
      return NextResponse.json({ error: 'Not in reading list' }, { status: 400 });
    }

    // Remove from current user reading list and save
    if (currentUser.readingList) {
      const index = currentUser.readingList.indexOf(blogObjectId);
      if (index > -1) {
        currentUser.readingList.splice(index, 1);
      }
    }
    await currentUser.save();

    // Find total bookmark and save
    const readingListBlogs = await Blog.findById(blogId).select("totalBookmark");
    
    if (readingListBlogs) {
      readingListBlogs.totalBookmark = Math.max(0, (readingListBlogs.totalBookmark || 0) - 1);
      await readingListBlogs.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from reading list:', error);
    return NextResponse.json({ error: 'Failed to remove from reading list' }, { status: 500 });
  }
} 