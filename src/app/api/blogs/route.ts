import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Blog, User } from '@/models';
import { getPagination } from '@/utils/getPagination';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const pageNumber = searchParams.get('page') || '1';
    
    // Retrieve total amount of created blogs
    const totalBlogs = await Blog.countDocuments();

    // Get pagination object
    const pagination = getPagination("/api/blogs?", { pageNumber }, 20, totalBlogs);

    // Retrieving blogs from the database, selecting specific fields and populating 'owner' field
    const latestBlog = await Blog.find()
      .select("banner title createdAt readingTime reaction totalBookmark")
      .populate({
        path: "owner",
        select: "name username profilePhoto",
      })
      .sort({
        createdAt: -1,
      })
      .limit(pagination.limit)
      .skip(pagination.skip);

    return NextResponse.json({
      blogs: latestBlog,
      pagination
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
} 