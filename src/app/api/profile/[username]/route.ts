import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { Blog } from '@/models/blogModel';
import { getPagination } from '@/utils/getPagination';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectDB();
    
    const { username } = await params;
    const { searchParams } = new URL(request.url);
    const pageNumber = searchParams.get('page') || '1';

    // Handle case where user not exists
    const userExist = await User.exists({ username });
    if (!userExist) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find user Profile based on username
    const profile = await User.findOne({ username }).select(
      "profilePhoto username name bio blogs blogPublished createdAt email"
    );

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get pagination
    const pagination = getPagination(
      `/api/profile/${username}?`,
      { pageNumber },
      20,
      profile.blogs?.length || 0
    );

    // Get User Blog
    const profileBlogs = await Blog.find({ _id: { $in: profile.blogs || [] } })
      .select("title createdAt readingTime reaction totalBookmark")
      .populate({
        path: "owner",
        select: "name username profilePhoto",
      })
      .sort({ createdAt: "desc" })
      .limit(pagination.limit)
      .skip(pagination.skip);

    return NextResponse.json({
      profile,
      pagination,
      profileBlogs,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
} 