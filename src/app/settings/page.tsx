'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TopAppBar from '../components/TopAppBar';
import { useAuth } from '../contexts/AuthContext';

interface UserData {
  profilePhoto?: {
    url: string;
  };
  username: string;
  email: string;
  bio?: string;
  name: string;
}

export default function SettingsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchUserData();
  }, [user, router]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${user?.username}`);
      const data = await response.json();
      
      if (response.ok) {
        setUserData(data.profile);
        if (data.profile.profilePhoto?.url) {
          setImagePreview(data.profile.profilePhoto.url.replace(
            "upload/",
            "upload/w_200,h_200,c_auto/q_auto/f_auto/"
          ));
        }
      } else {
        setError(data.error || 'Failed to fetch user data');
      }
    } catch (err) {
      setError('err:' + err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setNewImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBasicInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const basicInfo = {
      name: formData.get('name') as string,
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      bio: formData.get('bio') as string,
    };

    try {
      let imageData = null;
      if (newImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imageData = e.target?.result as string;
          submitBasicInfo(basicInfo, imageData);
        };
        reader.readAsDataURL(newImage);
      } else {
        submitBasicInfo(basicInfo, null);
      }
    } catch (err) {
      setError('err:' + err);
      setLoading(false);
    }
  };

  const submitBasicInfo = async (basicInfo: { name: string; bio: string }, imageData: string | null) => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user?.username,
          name: basicInfo.name,
          bio: basicInfo.bio,
          profilePhoto: imageData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully');
        // Update auth context with new user data
        if (data.user) {
          const updatedUser = {
            userAuthenticated: true,
            name: data.user.name,
            username: data.user.username,
            profilePhoto: data.user.profilePhoto?.url,
          };
          // Update localStorage and context
          localStorage.setItem('thoughtvibe_user', JSON.stringify(updatedUser));
          // Force a page reload to update the context
          window.location.reload();
        }
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('err:' + err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const passwordData = {
      oldPassword: formData.get('old_password') as string,
      newPassword: formData.get('password') as string,
      confirmPassword: formData.get('confirm_password') as string,
      username: user?.username
    };

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password updated successfully');
        e.currentTarget.reset();
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('err:' + err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/settings/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user?.username }),
      });

      if (response.ok) {
        logout();
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete account');
      }
    } catch (err) {
      setError('err:' + err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }

  if (loading && !userData) {
    return (
      <div>
        <TopAppBar />
        <div className="main">
          <article className="page settings-page">
            <div className="container">
              <h2 className="headline-small page-title text-on-surface">Settings</h2>
              <div className="loading">Loading settings...</div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div>
        <TopAppBar />
        <div className="main">
          <article className="page settings-page">
            <div className="container">
              <h2 className="headline-small page-title text-on-surface">Settings</h2>
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
      <main className="main">
        <article className="page settings-page">
          <div className="container">
            <h2 className="headline-small page-title text-on-surface">Settings</h2>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <div className="settings-wrapper">
              {/* Basic Info Form */}
              <div className="settings-card">
                <form className="settings-form" onSubmit={handleBasicInfoSubmit}>
                  <div className="title-wrapper">
                    <h3 className="headline-small text-on-surface">Basic info</h3>
                    <button
                      type="submit"
                      className="btn filled-tonal"
                      disabled={loading}
                    >
                      <p className="label-large">Save changes</p>
                      <div className="state-layer"></div>
                    </button>
                  </div>

                  <p className="body-large text-on-surface-variant">Profile photo</p>

                  <div className="image-field-wrapper avatar-image-field">
                    <label
                      htmlFor="profilePhoto"
                      className="label label-large text-on-surface-variant"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        name="profilePhoto"
                        id="profilePhoto"
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                      <span className="material-symbols-rounded leading-icon">
                        cloud_upload
                      </span>
                      Upload photo
                    </label>
                    
                    {imagePreview && (
                      <div className="image-preview show">
                        <Image
                          src={imagePreview}
                          alt={userData?.name || 'Profile'}
                          className="img-cover"
                          width={200}
                          height={200}
                        />
                      </div>
                    )}

                    {imagePreview && (
                      <button
                        type="button"
                        className="icon-btn filled-tonal"
                        onClick={clearImage}
                      >
                        <span className="material-symbols-rounded">delete</span>
                        <div className="state-layer"></div>
                      </button>
                    )}
                  </div>

                  <div className="wrapper">
                    <div className="text-field-wrapper">
                      <label htmlFor="name" className="label body-large">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="name"
                        placeholder=""
                        defaultValue={userData?.name}
                        required
                        className="body-large text-field"
                      />
                    </div>

                    <div className="text-field-wrapper">
                      <label htmlFor="username" className="label body-large">Username</label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        autoComplete="username"
                        placeholder=""
                        defaultValue={userData?.username}
                        required
                        className="body-large text-field"
                      />
                    </div>
                  </div>

                  <div className="text-field-wrapper">
                    <label htmlFor="email" className="label body-large">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      placeholder=""
                      defaultValue={userData?.email}
                      required
                      className="body-large text-field"
                      disabled
                    />
                  </div>

                  <div className="text-field-wrapper">
                    <label htmlFor="bio" className="label body-large">Short bio</label>
                    <input
                      type="text"
                      name="bio"
                      id="bio"
                      autoComplete="bio"
                      placeholder=""
                      defaultValue={userData?.bio}
                      maxLength={120}
                      className="body-large text-field"
                    />
                  </div>
                </form>
              </div>

              {/* Password Form */}
              <div className="settings-card">
                <form className="settings-form" onSubmit={handlePasswordSubmit}>
                  <div className="title-wrapper">
                    <h3 className="headline-small text-on-surface">Change Password</h3>
                    <button
                      type="submit"
                      className="btn filled-tonal"
                      disabled={loading}
                    >
                      <p className="label-large">Save changes</p>
                      <div className="state-layer"></div>
                    </button>
                  </div>

                  <div className="text-field-wrapper">
                    <label htmlFor="old-password" className="label body-large">Old Password</label>
                    <input
                      type="password"
                      name="old_password"
                      id="old-password"
                      autoComplete="current-password"
                      placeholder=""
                      required
                      className="body-large text-field"
                    />
                  </div>

                  <div className="text-field-wrapper">
                    <label htmlFor="new-password" className="label body-large">New Password</label>
                    <input
                      type="password"
                      name="password"
                      id="new-password"
                      autoComplete="new-password"
                      placeholder=""
                      minLength={8}
                      required
                      className="body-large text-field"
                    />
                  </div>

                  <div className="text-field-wrapper">
                    <label htmlFor="confirm-password" className="label body-large">Confirm password</label>
                    <input
                      type="password"
                      name="confirm_password"
                      id="confirm-password"
                      autoComplete="confirm-password"
                      placeholder=""
                      required
                      className="body-large text-field"
                    />
                  </div>
                </form>
              </div>

              {/* Account Delete */}
              <div className="settings-card">
                <h3 className="headline-small text-error">Delete account</h3>
                <p className="body-large text-on-surface-variant card-text">
                  Deleting your account in ThoughtVibe will result in the permanent
                  deletion of your personal data. This action cannot be undone.
                </p>
                <button 
                  className="btn btn-fill error" 
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  <p className="label-large">Delete your account</p>
                  <div className="state-layer"></div>
                </button>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
} 