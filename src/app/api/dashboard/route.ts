import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { Blog } from '@/models/blogModel';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ username }).select(
      "username name profilePhoto blogs blogPublished totalReactions createdAt"
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's blogs
    const userBlogs = await Blog.find({ _id: { $in: user.blogs || [] } })
      .select("title createdAt readingTime reaction totalBookmark")
      .populate({
        path: "owner",
        select: "name username profilePhoto",
      })
      .sort({ createdAt: "desc" })
      .limit(10);

    // Calculate analytics
    const totalViews = userBlogs.reduce((sum, blog) => sum + (blog.totalBookmark || 0), 0);
    const totalReactions = user.totalReactions || 0;
    const totalReadingTime = userBlogs.reduce((sum, blog) => sum + (blog.readingTime || 0), 0);

    return NextResponse.json({
      user,
      userBlogs,
      analytics: {
        totalViews,
        totalReactions,
        totalReadingTime,
        blogCount: user.blogPublished || 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
  }
} 