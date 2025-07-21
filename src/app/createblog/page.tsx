'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopAppBar from '../components/TopAppBar';
import { useAuth } from '../contexts/AuthContext';

export default function CreateBlog() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    banner: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user } = useAuth();
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null; // Or a loading spinner
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, banner: file }));
      
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
    setLoading(true);
    setError(null);

    if (!formData.banner) {
      setError('Please upload a banner image');
      setLoading(false);
      return;
    }

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        
        const response = await fetch('/api/blogs/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            banner: base64Image,
            username: user.username
          }),
        });

        const data = await response.json();

        if (response.ok) {
          router.push('/');
        } else {
          setError(data.error || 'Failed to create blog');
        }
        setLoading(false);
      };
      reader.readAsDataURL(formData.banner);
    } catch (err) {
      setError('Failed to create blog. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <TopAppBar route="/createblog" />
      <div className="main">
        <article className="page create-blog-page">
          <div className="container">
            <h2 className="page-title text-on-surface headline-small">Create Blog</h2>
            <form className="blog-write-form" onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div
                className={`image-field-wrapper${isDragActive ? ' drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!imagePreview ? (
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
                      <p className="label-large">Upload or drag image here</p>
                      <div className="state-layer"></div>
                    </label>
                    <p className="text label-large text-on-surface-variant">
                      Use a ratio of 21:9 for best results. <br />
                      Only JPEG, JPG and PNG with max size of 5MB
                    </p>
                  </>
                ) : (
                  <>
                    <div className="image-preview img-cover" style={{ backgroundImage: `url(${imagePreview})` }}></div>
                    <div className="image-actions">
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
                          delete
                        </span>
                        <p className="label-large">Remove</p>
                        <div className="state-layer"></div>
                      </button>
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
                  disabled={loading}
                >
                  <p className="label-large">
                    {loading ? 'Publishing...' : 'Publish'}
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