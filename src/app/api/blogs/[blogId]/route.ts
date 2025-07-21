import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Blog } from '@/models/blogModel';
import { User } from '@/models/userModel';
import { v2 as cloudinary } from 'cloudinary';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    await connectDB();
    
    const { blogId } = await params;
    
    // Handle case where provided blog id is not valid
    const isValidObjectId = mongoose.Types.ObjectId.isValid(blogId);

    if (!isValidObjectId) {
      return NextResponse.json({
        error: "Invalid blog ID"
      }, { status: 400 });
    }

    // Handle case where no blog found with provided blog id
    const blogExist = await Blog.exists({
      _id: new mongoose.Types.ObjectId(blogId),
    });

    if (!blogExist) {
      return NextResponse.json({
        error: "Blog not found"
      }, { status: 404 });
    }

    // Retrieve blog detail and populate owner info
    const blog = await Blog.findById(blogId).populate({
      path: "owner",
      select: "name username profilePhoto",
    });

    if (!blog) {
      return NextResponse.json({
        error: "Blog not found"
      }, { status: 404 });
    }

    // Retrieve more blogs from this user
    const ownerBlogs = await Blog.find({ owner: { _id: blog.owner._id } })
      .select("title reaction totalBookmark owner readingTime createdAt")
      .populate({
        path: "owner",
        select: "name username profilePhoto",
      })
      .where("_id")
      .nin([blogId])
      .sort({ createdAt: "desc" })
      .limit(3);

    // Retrieve session user reacted and reading list blog
    // Note: In Next.js, you'll need to get the user from the session/token
    // For now, we'll return the blog data without user-specific data
    let user = null;
    // TODO: Get user from session/token and populate user data

    return NextResponse.json({
      blog,
      user,
      ownerBlogs
    });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    return NextResponse.json({
      error: 'Failed to fetch blog details'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    await connectDB();
    
    const { blogId } = await params;
    const { title, content, banner, username } = await request.json();

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    if (!username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the blog and verify ownership
    const blog = await Blog.findById(blogId).populate('owner', 'username');
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    if ((blog.owner as any).username !== username) {
      return NextResponse.json({ error: 'Unauthorized to edit this blog' }, { status: 403 });
    }

    // Handle banner image upload if provided
    let bannerData: any = blog.banner; // Keep existing banner by default
    
    if (banner && banner.startsWith('data:image')) {
      // New image uploaded - upload to Cloudinary
      try {
        const result = await cloudinary.uploader.upload(banner, {
          folder: 'thoughtvibe',
          transformation: [
            { width: 960, height: 420, crop: 'fill' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        });
        
        bannerData = {
          url: result.secure_url,
          public_id: result.public_id
        };
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    } else if (banner === null) {
      // Image was removed
      bannerData = null;
    }

    // Update the blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        content,
        banner: bannerData
      },
      { new: true }
    ).populate('owner', 'name username profilePhoto');

    if (!updatedBlog) {
      return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      blog: updatedBlog 
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
} 