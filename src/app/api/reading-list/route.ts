import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Blog } from '@/models/blogModel';
import { User } from '@/models/userModel';
import { getPagination } from '@/utils/getPagination';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const pageNumber = searchParams.get('page') || '1';

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    // Retrieve total amount of reading list
    const user = await User.findOne({ username }).select("readingList");
    const readingList = user?.readingList || [];
    
    // Get pagination object
    const pagination = getPagination("/api/reading-list?", { pageNumber }, 20, readingList.length);

    // Retrieve reading list based on pagination
    const readingListBlogs = await Blog.find({ _id: { $in: readingList } })
      .select("banner owner createdAt readingTime title reaction totalBookmark")
      .populate({ path: "owner", select: "name username profilePhoto" })
      .limit(pagination.limit)
      .skip(pagination.skip);

    return NextResponse.json({
      readingListBlogs,
      pagination
    });
  } catch (error) {
    console.error('Error fetching reading list:', error);
    return NextResponse.json({ error: 'Failed to fetch reading list' }, { status: 500 });
  }
} 