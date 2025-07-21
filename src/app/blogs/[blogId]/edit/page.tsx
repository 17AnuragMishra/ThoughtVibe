'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TopAppBar from '../../../components/TopAppBar';
import { useAuth } from '../../../contexts/AuthContext';

interface Blog {
  _id: string;
  title: string;
  content: string;
  banner?: {
    url: string;
  };
  owner: {
    username: string;
  };
}

export default function EditBlogPage() {
  const params = useParams();
  const blogId = params.blogId as string;
  const router = useRouter();
  const { user } = useAuth();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    banner: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [hasNewImage, setHasNewImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchBlog();
    }
  }, [blogId, user, router]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${blogId}`);
      const data = await response.json();
      
      if (response.ok) {
        setBlog(data.blog);
        setFormData({
          title: data.blog.title,
          content: data.blog.content,
          banner: null
        });
        if (data.blog.banner?.url) {
          const compressedImageUrl = data.blog.banner.url.replace(
            "upload/",
            "upload/w_960,h_420,c_auto/q_auto/f_auto/"
          );
          setCurrentImage(compressedImageUrl);
          setImagePreview(compressedImageUrl);
          setHasNewImage(false);
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

  // Check if user owns this blog
  if (blog && user?.username !== blog.owner.username) {
    router.push('/dashboard');
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, banner: file }));
      setHasNewImage(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, banner: file }));
      setHasNewImage(true);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, banner: null }));
    setImagePreview(null);
    setHasNewImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeCurrentImage = () => {
    setFormData(prev => ({ ...prev, banner: null }));
    setImagePreview(null);
    setCurrentImage(null);
    setHasNewImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let imageData = null;
      if (formData.banner) {
        // Convert new image to base64
        const reader = new FileReader();
        reader.onload = (e) => {
          imageData = e.target?.result as string;
          submitUpdate(imageData);
        };
        reader.readAsDataURL(formData.banner);
      } else if (currentImage && !hasNewImage) {
        // Use existing image
        imageData = blog?.banner?.url || null;
        submitUpdate(imageData);
      } else {
        // No image selected
        setError('Please select an image');
        setSaving(false);
        return;
      }
    } catch (err) {
      setError('Failed to update blog');
      setSaving(false);
    }
  };

  const submitUpdate = async (imageData: string | null) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          banner: imageData,
          username: user?.username
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/blogs/${blogId}`);
      } else {
        setError(data.error || 'Failed to update blog');
      }
    } catch (err) {
      setError('Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  if (loading) {
    return (
      <div>
        <TopAppBar route="/createblog" />
        <div className="main">
          <article className="page create-blog-page">
            <div className="container">
              <h2 className="page-title text-on-surface headline-small">Edit Blog</h2>
              <div className="loading">Loading blog...</div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div>
        <TopAppBar route="/createblog" />
        <div className="main">
          <article className="page create-blog-page">
            <div className="container">
              <h2 className="page-title text-on-surface headline-small">Edit Blog</h2>
              <div className="error">{error || 'Blog not found'}</div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopAppBar route="/createblog" />
      <div className="main">
        <article className="page create-blog-page">
          <div className="container">
            <h2 className="page-title text-on-surface headline-small">Edit Blog</h2>
            <form className="blog-write-form" onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div
                className={`image-field-wrapper${isDragActive ? ' drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!imagePreview ? (
                  // No image - show upload button
                  <>
                    <label htmlFor="banner" className="btn filled-tonal">
                      <input
                        ref={fileInputRef}
                        type="file"
                        name="banner"
                        id="banner"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                      <span className="material-symbols-rounded leading-icon">
                        cloud_upload
                      </span>
                      <p className="label-large">Upload image</p>
                      <div className="state-layer"></div>
                    </label>
                    <p className="text label-large text-on-surface-variant">
                      Use a ratio of 21:9 for best results. <br />
                      Only JPEG, JPG and PNG with max size of 5MB
                    </p>
                  </>
                ) : (
                  // Image exists - show preview with actions
                  <>
                    <div className="image-preview img-cover" style={{ backgroundImage: `url(${imagePreview})` }}></div>
                    <div className="image-actions">
                      {hasNewImage ? (
                        // New image uploaded - show replace and remove buttons
                        <>
                          <label htmlFor="banner" className="btn filled-tonal">
                            <input
                              ref={fileInputRef}
                              type="file"
                              name="banner"
                              id="banner"
                              accept="image/*"
                              onChange={handleImageChange}
                              style={{ display: 'none' }}
                            />
                            <span className="material-symbols-rounded leading-icon">
                              edit
                            </span>
                            <p className="label-large">Replace</p>
                            <div className="state-layer"></div>
                          </label>
                          <button
                            type="button"
                            className="btn filled-tonal"
                            onClick={clearImage}
                          >
                            <span className="material-symbols-rounded leading-icon">
                              undo
                            </span>
                            <p className="label-large">Revert</p>
                            <div className="state-layer"></div>
                          </button>
                        </>
                      ) : (
                        // Current image - show replace and remove buttons
                        <>
                          <label htmlFor="banner" className="btn filled-tonal">
                            <input
                              ref={fileInputRef}
                              type="file"
                              name="banner"
                              id="banner"
                              accept="image/*"
                              onChange={handleImageChange}
                              style={{ display: 'none' }}
                            />
                            <span className="material-symbols-rounded leading-icon">
                              edit
                            </span>
                            <p className="label-large">Replace</p>
                            <div className="state-layer"></div>
                          </label>
                          <button
                            type="button"
                            className="btn filled-tonal"
                            onClick={removeCurrentImage}
                          >
                            <span className="material-symbols-rounded leading-icon">
                              delete
                            </span>
                            <p className="label-large">Remove</p>
                            <div className="state-layer"></div>
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {/* Title */}
              <input
                type="text"
                name="title"
                aria-label="Blog title"
                placeholder="Article Title..."
                required
                className="title-field headline-large"
                value={formData.title}
                onChange={handleInputChange}
              />

              {/* Content */}
              <textarea
                name="content"
                aria-label="Blog Content"
                placeholder="Write your post content here..."
                required
                className="textarea body-large"
                value={formData.content}
                onChange={handleInputChange}
                style={{ minHeight: '300px' }}
              />

              <div className="footer-action">
                <button 
                  type="submit" 
                  className="btn btn-fill" 
                  disabled={saving}
                >
                  <p className="label-large">
                    {saving ? 'Updating...' : 'Update'}
                  </p>
                  <div className="state-layer"></div>
                </button>
              </div>
            </form>
          </div>
        </article>
      </div>
    </div>
  );
} 