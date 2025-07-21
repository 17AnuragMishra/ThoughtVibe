'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TopAppBar from '../components/TopAppBar';
import { useAuth } from '../contexts/AuthContext';
import MessageLoading from '../components/messageLoading';

interface Blog {
  _id: string;
  title: string;
  reaction: number;
  readingTime: number;
  totalBookmark: number;
  createdAt: string;
}

interface DashboardData {
  blogs: Blog[];
  blogPublished: number;
  totalReactions: number;
  totalVisits: number;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && user.username) {
      fetchDashboardData();
    }
  }, [user, router, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard?username=${user?.username}`);
      const data = await response.json();
      
      if (response.ok) {
        // Transform the data to match the expected structure
        setDashboardData({
          blogs: data.userBlogs || [],
          blogPublished: data.analytics?.blogCount || 0,
          totalReactions: data.analytics?.totalReactions || 0,
          totalVisits: data.analytics?.totalViews || 0
        });
      } else {
        setError(data.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${blogId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user?.username }),
      });

      if (response.ok) {
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete blog');
      }
    } catch (err) {
      setError('Failed to delete blog');
    }
  };

  if (authLoading || !user || !user.username) {
    return (
      <div>
        <TopAppBar />
        <div className="main">
          <article className="page dashboard-page">
            <div className="container">
              <h2 className="headline-small page-title text-on-surface">Dashboard</h2>
              <div className="flex justify-center items-center h-full">
                <MessageLoading />
              </div>
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
          <article className="page dashboard-page">
            <div className="container">
              <h2 className="headline-small page-title text-on-surface">Dashboard</h2>
              <div className="error">{error}</div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div>
        <TopAppBar />
        <div className="main">
          <article className="page dashboard-page">
            <div className="container">
              <h2 className="headline-small page-title text-on-surface">Dashboard</h2>
              <div className="error">No dashboard data available</div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: 'short',
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div>
      <TopAppBar />
      <main className="main">
        <article className="page dashboard-page">
          <div className="container">
            <h2 className="headline-small page-title text-on-surface">Dashboard</h2>
            <div className="divider" />
            {/* Analytics Section */}
            <section className="analytics-list">
              <div className="analytics-card">
                <div className="analytics-icon-box">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    visibility
                  </span>
                </div>
                <div>
                  <h3 className="display-medium text-on-surface card-title">
                    {dashboardData.totalVisits.toLocaleString("en-US")}
                  </h3>
                  <p className="title-medium text-on-surface-variant">Total Visits</p>
                </div>
              </div>
              <div className="analytics-card">
                <div className="analytics-icon-box">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    favorite
                  </span>
                </div>
                <div>
                  <h3 className="display-medium text-on-surface card-title">
                    {dashboardData.totalReactions.toLocaleString("en-US")}
                  </h3>
                  <p className="title-medium text-on-surface-variant">
                    Total Reactions
                  </p>
                </div>
              </div>
              <div className="analytics-card">
                <div className="analytics-icon-box">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    article
                  </span>
                </div>
                <div>
                  <h3 className="display-medium text-on-surface card-title">
                    {dashboardData.blogPublished.toLocaleString("en-US")}
                  </h3>
                  <p className="title-medium text-on-surface-variant">
                    Article Published
                  </p>
                </div>
              </div>
            </section>
            <div className="divider" />
            {/* Published Blog */}
            <section>
              <h2 className="title-large title text-on-surface">Posts</h2>
              <div className="post-list">
                {dashboardData.blogs.length > 0 ? (
                  dashboardData.blogs.map((blog) => (
                    <div key={blog._id} className="list-item flex flex-col justify-between gap-2 sm:flex-row">
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/blogs/${blog._id}`}
                          className="title-medium text-link"
                        >
                          {blog.title}
                        </Link>
                        <p className="body-small text-on-surface-variant">
                          {formatDate(blog.createdAt)}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="material-symbols-rounded" aria-hidden="true">favorite</span>
                            <span className="body-small text-on-surface-variant">{blog.reaction}</span>
                          </div>
                          <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="material-symbols-rounded" aria-hidden="true">bookmark</span>
                            <span className="body-small text-on-surface-variant">{blog.totalBookmark}</span>
                          </div>
                          <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="material-symbols-rounded" aria-hidden="true">schedule</span>
                            <span className="body-small text-on-surface-variant">{blog.readingTime} min read</span>
                          </div>
                        </div>
                        <div className="action-list" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Link
                            href={`/blogs/${blog._id}/edit`}
                            className="icon-btn filled-tonal"
                          >
                            <span className="material-symbols-rounded" aria-hidden="true">edit</span>
                            <div className="state-layer"></div>
                          </Link>
                          <button
                            className="icon-btn filled-tonal"
                            onClick={() => handleDeleteBlog(blog._id)}
                          >
                            <span className="material-symbols-rounded" aria-hidden="true">delete</span>
                            <div className="state-layer"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="list-item">
                    <p className="text-on-surface-variant body-large">
                      You haven't written anything yet.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
} 