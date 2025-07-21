'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopAppBar from '../components/TopAppBar';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import { useAuth } from '../contexts/AuthContext';

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

export default function ReadingListPage() {
  const [readingListBlogs, setReadingListBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchReadingList();
  }, [user, router]);

  const fetchReadingList = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reading-list?page=${page}&username=${user?.username}`);
      const data = await response.json();
      
      if (response.ok) {
        setReadingListBlogs(data.readingListBlogs);
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Failed to fetch reading list');
      }
    } catch (err) {
      setError('Failed to fetch reading list');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div>
        <TopAppBar />
        <div className="main">
          <article className="page">
            <div className="container">
              <h2 className="headline-small page-title text-on-surface">
                Reading List
              </h2>
              <div className="loading">Loading reading list...</div>
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
          <article className="page">
            <div className="container">
              <h2 className="headline-small page-title text-on-surface">
                Reading List
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
        <article className="page">
          <div className="container">
            <h2 className="headline-small page-title text-on-surface">
              Reading List
            </h2>

            {/* All BlogPost Render Here */}
            <div className="blog-list">
              {readingListBlogs.length > 0 ? (
                readingListBlogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))
              ) : (
                <p className="body-large text-on-surface-varient">
                  You haven't added any articles in reading list.
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