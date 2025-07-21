'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import TopAppBar from '../../components/TopAppBar';
import BlogCard from '../../components/BlogCard';
import Pagination from '../../components/Pagination';
import { useAuth } from '../../contexts/AuthContext';
import { useRef } from 'react';

interface Profile {
  profilePhoto?: {
    url: string;
  };
  name: string;
  username: string;
  bio?: string;
  blogPublished: number;
  createdAt: string;
  email?: string;
}

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

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileBlogs, setProfileBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio || '');
      setEmail(profile.email || '');
      setImagePreview(
        profile.profilePhoto?.url?.replace(
          'upload/',
          'upload/w_200,h_200,c_auto/q_auto/f_auto/'
        ) || '/images/profilePhoto-default.jpg'
      );
    }
  }, [profile]);

  // Drag-and-drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageChange(file);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleImageChange = (file: File) => {
    setNewImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  const clearImage = () => {
    setNewImage(null);
    setImagePreview('/images/profilePhoto-default.jpg');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Save profile changes
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    let imageData = null;
    if (newImage) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        imageData = e.target?.result as string;
        await submitProfile(imageData);
      };
      reader.readAsDataURL(newImage);
    } else {
      await submitProfile(null);
    }
  };
  const submitProfile = async (imageData: string | null) => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user?.username,
          name,
          bio,
          profilePhoto: imageData,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Profile updated successfully');
        setEditMode(false);
        setProfile((prev) => prev ? { ...prev, name, bio, profilePhoto: data.user.profilePhoto } : prev);
        setNewImage(null);
        window.location.reload(); 
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${username}?page=${page}`);
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.profile);
        setProfileBlogs(data.profileBlogs);
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <TopAppBar />
        <div className="main">
          <article className="page profile-page">
            <div className="container">
              <div className="loading">Loading profile...</div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div>
        <TopAppBar />
        <div className="main">
          <article className="page profile-page">
            <div className="container">
              <div className="error">{error || 'Profile not found'}</div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  const compressedProfilePhotoURL = profile.profilePhoto?.url?.replace(
    "upload/",
    "upload/w_200,h_200,c_auto/q_auto/f_auto/"
  ) || "/images/profilePhoto-default.jpg";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: '2-digit',
      month: "long",
      year: "numeric"
    });
  };

  const isOwnProfile = user?.username === profile.username;

  return (
    <div>
      <TopAppBar />
      <div className="main">
        <article className="page profile-page">
          <div className="container">
            <div className="profile-card">
              <div
                className="profile-image img-holder drag-drop-area"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{ border: editMode ? '2px dashed #888' : undefined }}
              >
                <Image
                  className="img-cover"
                  src={imagePreview || compressedProfilePhotoURL}
                  alt={profile.username}
                  width={200}
                  height={200}
                />
                {editMode && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpg, image/jpeg"
                      style={{ display: 'none' }}
                      onChange={e => {
                        if (e.target.files?.[0]) handleImageChange(e.target.files[0]);
                      }}
                    />
                    <button
                      type="button"
                      className="btn filled-tonal"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className="material-symbols-rounded">cloud_upload</span>
                      Upload/Replace
                    </button>
                    {imagePreview && (
                      <button
                        type="button"
                        className="icon-btn filled-tonal"
                        onClick={clearImage}
                      >
                        <span className="material-symbols-rounded">delete</span>
                      </button>
                    )}
                  </>
                )}
              </div>
              <div className="profile-content">
                {editMode ? (
                  <>
                    <div className="text-field-wrapper">
                      <label htmlFor="name" className="label body-large">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="body-large text-field"
                        required
                      />
                    </div>
                    <div className="text-field-wrapper">
                      <label htmlFor="email" className="label body-large">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        disabled
                        className="body-large text-field"
                      />
                    </div>
                    <div className="text-field-wrapper">
                      <label htmlFor="bio" className="label body-large">Short bio</label>
                      <input
                        type="text"
                        id="bio"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        maxLength={120}
                        className="body-large text-field"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn filled-tonal"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="title headline-medium text-on-surface">
                      {profile.name}
                    </h3>
                    <p className="bio body-large text-onsurface-variant">
                      {profile.bio || "404 bio not found"}
                    </p>
                    <div className="profile-meta-list">
                      <div className="profile-meta-item text-onsurface-variant">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          calendar_month
                        </span>
                        <p className="body-large text-onsurface-variant">
                          Member since {formatDate(profile.createdAt)}
                        </p>
                      </div>
                      <div className="profile-meta-item text-onsurface-variant">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          article
                        </span>
                        <p className="body-large text-onsurface-variant">
                          {profile.blogPublished} blog published
                        </p>
                      </div>
                    </div>
                    {isOwnProfile && (
                      <button
                        className="btn filled-tonal"
                        onClick={() => setEditMode(true)}
                      >
                        <span className="material-symbols-rounded" aria-hidden="true">
                          edit_square
                        </span>
                        <p className="label-large">Edit profile</p>
                        <div className="state-layer"></div>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="divider"></div>
            <div className="blog-list">
              {profileBlogs.length > 0 ? (
                profileBlogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))
              ) : (
                <p className="body-large text-on-surface-variant">
                  No blogs published yet.
                </p>
              )}
            </div>
            {pagination && (pagination.next || pagination.prev) && (
              <Pagination pagination={pagination} />
            )}
          </div>
        </article>
      </div>
    </div>
  );
} 