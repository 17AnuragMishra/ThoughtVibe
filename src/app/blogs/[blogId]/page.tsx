'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import TopAppBar from '../../components/TopAppBar';
import BlogCard from '../../components/BlogCard';
import { useAuth } from '../../contexts/AuthContext';

interface BlogOwner {
  name: string;
  username: string;
  profilePhoto?: {
    url: string;
  };
}

interface Blog {
  _id: string;
  banner?: {
    url: string;
  };
  title: string;
  content: string;
  owner: BlogOwner;
  reaction: number;
  readingTime: number;
  totalBookmark: number;
  createdAt: string;
}

interface OwnerBlog {
  _id: string;
  banner?: {
    url: string;
  };
  title: string;
  owner: BlogOwner;
  reaction: number;
  readingTime: number;
  totalBookmark: number;
  createdAt: string;
}

interface UserData {
  readingList?: string[];
  reactedBlogs?: string[];
}

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = params.blogId as string;
  const router = useRouter();
  const { user } = useAuth();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [ownerBlogs, setOwnerBlogs] = useState<OwnerBlog[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reactionCount, setReactionCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isReacted, setIsReacted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (blogId) {
      fetchBlogDetail();
    }
  }, [blogId]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${blogId}`);
      const data = await response.json();
      
      if (response.ok) {
        setBlog(data.blog);
        setOwnerBlogs(data.ownerBlogs);
        setUserData(data.user);
        setReactionCount(data.blog.reaction);
        setBookmarkCount(data.blog.totalBookmark);
        
        // Check if user has reacted or bookmarked
        if (data.user) {
          setIsReacted(data.user.reactedBlogs?.includes(blogId) || false);
          setIsBookmarked(data.user.readingList?.includes(blogId) || false);
        }
      } else {
        setError(data.error || 'Failed to fetch blog');
      }
    } catch (err) {
      setError('Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async () => {
    if (!user) {
      // Redirect to login or show login prompt
      return;
    }

    try {
      const method = isReacted ? 'DELETE' : 'POST';
      const response = await fetch(`/api/blogs/${blogId}/reaction`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username }),
      });

      if (response.ok) {
        setIsReacted(!isReacted);
        setReactionCount(prev => isReacted ? prev - 1 : prev + 1);
      }
    } catch (err) {
      console.error('Error toggling reaction:', err);
    }
  };

  const handleReadingList = async () => {
    if (!user) {
      // Redirect to login or show login prompt
      return;
    }

    try {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const response = await fetch(`/api/reading-list/${blogId}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username }),
      });

      if (response.ok) {
        setIsBookmarked(!isBookmarked);
        setBookmarkCount(prev => isBookmarked ? prev - 1 : prev + 1);
      }
    } catch (err) {
      console.error('Error toggling reading list:', err);
    }
  };

  const handleDeleteBlog = async () => {
    if (!user) {
      return;
    }

    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${blogId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username }),
      });

      if (response.ok) {
        // Redirect to dashboard after successful deletion
        router.push('/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError('Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <div>
        <TopAppBar />
        <div className="main">
          <div className="page blog-detail-page">
            <div className="container">
              <div className="loading">Loading blog...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div>
        <TopAppBar />
        <div className="main">
          <div className="page blog-detail-page">
            <div className="container">
              <div className="error">{error || 'Blog not found'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const compressedBannerURL = blog.banner?.url?.replace(
    "upload/",
    "upload/w_960,h_420,c_auto/q_auto/f_auto/"
  );

  const compressedProfilePhotoURL = blog.owner.profilePhoto?.url?.replace(
    "upload/",
    "upload/w_60,h_60,c_auto/q_auto/f_auto/"
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: 'short',
      day: "numeric",
      year: "numeric"
    });
  };

  const isOwnBlog = user?.username === blog.owner.username;

  return (
    <div>
      <TopAppBar />
      <main className="main">
        <div className="page blog-detail-page">
          <div className="container">
            <article className="blog-detail">
              {/* Blog Image */}
              {compressedBannerURL && (
                <figure className="blog-banner img-holder">
                  <Image
                    src={compressedBannerURL}
                    alt={blog.title}
                    width={960}
                    height={420}
                    className="img-cover"
                  />
                </figure>
              )}

              {/* Blog Author */}
              <div className="blog-author">
                {compressedProfilePhotoURL ? (
                  <figure className="avatar">
                    <Image 
                      src={compressedProfilePhotoURL} 
                      alt={blog.owner.name} 
                      className="img-cover" 
                      width={40} 
                      height={40}
                    />
                  </figure>
                ) : (
                  <p className="avatar title-medium">{blog.owner.name.charAt(0)}</p>
                )}
                
                <div className="leading-text">
                  <Link
                    href={`/profile/${blog.owner.username}`}
                    className="title-medium text-link"
                  >
                    {blog.owner.name}
                  </Link>
                  <p className="body-small text-on-surface-variant">
                    Posted on {formatDate(blog.createdAt)}
                  </p>
                </div>

                {isOwnBlog && (
                  <div className="blog-owner-actions">
                    <Link
                      href={`/blogs/${blog._id}/edit`}
                      className="btn filled-tonal"
                    >
                      <span
                        className="material-symbols-rounded leading-icon"
                        aria-hidden="true"
                      >
                        edit
                      </span>
                      <p className="label-large">Edit</p>
                      <div className="state-layer"></div>
                    </Link>

                    <button
                      className="btn filled-tonal error"
                      onClick={handleDeleteBlog}
                    >
                      <span
                        className="material-symbols-rounded leading-icon"
                        aria-hidden="true"
                      >
                        delete
                      </span>
                      <p className="label-large">Delete</p>
                      <div className="state-layer"></div>
                    </button>
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <div className="blog-content">
                <h1 className="title headline-large text-on-surface">{blog.title}</h1>
                <div className="content-markdown text-on-surface-variant">
                  {/* TODO: Add markdown rendering */}
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
              </div>

              {/* Blog Actions */}
              <div className="blog-actions">
                <div className="action-item">
                  <button
                    className={`icon-btn filled-tonal${isReacted ? ' active' : ''}`}
                    onClick={handleReaction}
                  >
                    <span className="material-symbols-rounded icon" aria-hidden="true">
                      favorite
                    </span>
                    <div className="state-layer"></div>
                  </button>

                  <p className="label-large text-on-surface-variant">
                    <span>{reactionCount}</span> Reactions
                  </p>
                </div>

                <div className="action-item">
                  <button
                    className={`icon-btn filled-tonal${isBookmarked ? ' active' : ''}`}
                    onClick={handleReadingList}
                  >
                    <span className="material-symbols-rounded icon" aria-hidden="true">
                      bookmark
                    </span>
                    <div className="state-layer"></div>
                  </button>
                  <p className="label-large text-on-surface-variant">
                    <span>{bookmarkCount}</span> Bookmarks
                  </p>
                </div>
              </div>
            </article>

            {/* More blogs from same author */}
            {ownerBlogs.length > 0 && (
              <section className="more-blog">
                <h2 className="title title-large text-on-surface">Read next</h2>
                <div className="blog-list">
                  {ownerBlogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 