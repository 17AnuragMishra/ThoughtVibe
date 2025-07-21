'use client';

import { useEffect, useState } from 'react';
import TopAppBar from './components/TopAppBar';
import BlogCard from './components/BlogCard';
import Pagination from './components/Pagination';

interface Blog {
  _id: string;
  banner?: {
    url: string;
  };
  title: string;
  owner: {
    name: string;
    username: string;
    profilePhoto?: {
      url: string;
    };
  };
  reaction: number;
  readingTime: number;
  totalBookmark: number;
  createdAt: string;
}

interface PaginationData {
  next: string | null;
  prev: string | null;
  totalPage: number;
  currentPage: number;
  limit: number;
  skip: number;
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs?page=${page}`);
      const data = await response.json();
      
      if (response.ok) {
        setBlogs(data.blogs);
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Failed to fetch blogs');
      }
    } catch (err) {
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <TopAppBar />
        <div className="main">
          <article className="page home-page">
            <div className="container">
              <h2 className="headline-small page-title text-on-surface">
                Latest blogs
              </h2>
              <div className="loading">Loading...</div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <TopAppBar />
        <div className="main">
          <article className="page home-page">
            <div className="container">
              <h2 className="headline-small page-title text-on-surface">
                Latest blogs
              </h2>
              <div className="error">{error}</div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopAppBar />
      <div className="main">
        <article className="page home-page">
          <div className="container">
            <h2 className="headline-small page-title text-on-surface">
              Latest blogs
            </h2>

            {/* All BlogPost Render Here */}
            <div className="blog-list">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))
              ) : (
                <p className="body-large text-on-surface-variant">
                  No blogs found.
                </p>
              )}
            </div>

            {/* Pagination Show Here */}
            {pagination && (pagination.next || pagination.prev) && (
              <Pagination pagination={pagination} />
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
