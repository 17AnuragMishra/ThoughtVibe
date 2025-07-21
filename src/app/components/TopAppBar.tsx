'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface TopAppBarProps {
  route?: string;
}

export default function TopAppBar({ route }: TopAppBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  console.log("current user: ",user);

  let compressedProfilePhotoURL = '/images/profilePhoto-default.jpg';
  if (user?.profilePhoto) {
    if (typeof user.profilePhoto === 'string') {
      compressedProfilePhotoURL = user.profilePhoto.replace('upload/', 'upload/w_40,h_40,c_thumb,g_face,r_max/');
    } else if (
      typeof user.profilePhoto === 'object' &&
      user.profilePhoto !== null &&
      'url' in user.profilePhoto &&
      typeof (user.profilePhoto as { url: string }).url === 'string'
    ) {
      compressedProfilePhotoURL = (user.profilePhoto as { url: string }).url.replace('upload/', 'upload/w_40,h_40,c_thumb,g_face,r_max/');
    }
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
    logout();
    setIsMenuOpen(false);
    router.push('/');
    }
  };

  return (
    <header className="top-app-bar" data-top-app-bar>
      {/* Back button for create blog page */}
      {route === "/createblog" && (
        <button 
          className="icon-btn filled-tonal" 
          aria-label="Go to previous page" 
          data-back-btn
          onClick={() => window.history.back()}
        >
          <span className="material-symbols-rounded" aria-hidden="true">
            chevron_left
          </span>
          <div className="state-layer"></div>
        </button>
      )}

      <Link href="/" className="logo">
        <Image 
          src="/images/thoughtvibe-logo-white-transparent.svg" 
          width={98} 
          height={24} 
          alt="ThoughtVibe" 
          className="light"
        />
        <Image 
          src="/images/thoughtvibe-logo-black-transparent.svg" 
          width={98} 
          height={24} 
          alt="ThoughtVibe" 
          className="dark"
        />
      </Link>

      <div className="trailing-action-wrapper">
        {user ? (
          <>
            {route !== "/createblog" && (
              <Link href="/createblog" className="btn btn-fill">
                <span className="material-symbols-rounded leading-icon">edit</span>
                <p className="label-large">Write</p>
                <div className="state-layer"></div>
              </Link>
            )}

            <div className="menu-wrapper" data-menu-wrapper>
              <button className="icon-btn" data-menu-toggler onClick={toggleMenu}>
                <div className="avatar">
                  {compressedProfilePhotoURL ? (
                    <Image 
                      src={compressedProfilePhotoURL} 
                      alt={user.name} 
                      className="img-cover" 
                      width={40}
                      height={40}
                    />
                  ) : (
                    <p className="title-medium">
                      {(user?.name ?? '').charAt(0)}
                    </p>
                  )}
                </div>
                <div className="state-layer"></div>
              </button>

              <div className={`menu ${isMenuOpen ? 'active' : ''}`} data-menu>
                <div className="list-item small">
                  <div className="avatar">
                    {compressedProfilePhotoURL ? (
                      <Image 
                        src={compressedProfilePhotoURL} 
                        alt={user.name} 
                        className="img-cover" 
                        width={40}
                        height={40}
                      />
                    ) : (
                      <p className="title-medium">
                        {(user?.name ?? '').charAt(0)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="label-small text-primary truncate-online">
                      {user.username}
                    </p>
                    <p className="body-large text-on-surface">
                      {user.name}
                    </p>
                  </div>
                  <div className="state-layer"></div>
                  <Link href={`/profile/${user.username}`} title={user.name} className="list-item-link"></Link>
                </div>
                <div className="divider"></div>

                <Link href="/dashboard" className="menu-item">
                  <span className="icon material-symbols-rounded" aria-hidden="true">
                    dashboard
                  </span>
                  <p className="label-large">Dashboard</p>
                  <div className="state-layer"></div>
                </Link>

                <Link href="/readinglist" className="menu-item">
                  <span className="icon material-symbols-rounded" aria-hidden="true">
                    bookmark
                  </span>
                  <p className="label-large">Reading list</p>
                  <div className="state-layer"></div>
                </Link>

                <Link href="/settings" className="menu-item">
                  <span className="icon material-symbols-rounded" aria-hidden="true">
                    settings
                  </span>
                  <p className="label-large">Settings</p>
                  <div className="state-layer"></div>
                </Link>
                <div className="divider"></div>

                <button 
                  type="button" 
                  className="menu-item"
                  onClick={handleLogout}
                >
                  <span className="icon material-symbols-rounded" aria-hidden="true">
                    logout
                  </span>
                  <p className="label-large">Sign out</p>
                  <div className="state-layer"></div>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-text">
              <p className="label-large">Login</p>
              <div className="state-layer"></div>
            </Link>

            <Link href="/register" className="btn btn-fill">
              <p className="label-large">Create account</p>
              <div className="state-layer"></div>
            </Link>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className="progress-bar" data-progress-bar>
        <div className="progress-active-indicator"></div>
        <div className="progress-track"></div>
      </div>
    </header>
  );
} 