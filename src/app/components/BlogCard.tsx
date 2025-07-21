'use client';

import Link from 'next/link';
import Image from 'next/image';

interface BlogOwner {
  name: string;
  username: string;
  profilePhoto?: {
    url: string;
  };
}

interface BlogCardProps {
  blog: {
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
  };
}

export default function BlogCard({ blog }: BlogCardProps) {
  const { _id: blogId, banner, title, owner, reaction, readingTime, totalBookmark, createdAt } = blog;
  
  // Safely get banner URL with null check
  const bannerURL = banner?.url;
  
  // Compress banner using cloudinary Transformation URL API
  const compressedBannerURL = bannerURL?.replace("upload/", "upload/w_600,h_350,c_auto/q_auto/f_auto/");
  
  // Compress profile photo using cloudinary Transformation URL API
  const compressedProfilePhotoURL = owner.profilePhoto?.url?.replace("upload/", "upload/w_60,h_60,c_auto/q_auto/f_auto/");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="card">
      {compressedBannerURL && (
        <figure className="card-banner img-holder">
          <Image
            src={compressedBannerURL}
            alt={title}
            width={360}
            height={155}
            className="img-cover"
          />
        </figure>
      )}
      
      <div className="card-content">
        <div className="card-meta">
          <div className="avatar">
            {compressedProfilePhotoURL ? (
              <Image 
                src={compressedProfilePhotoURL} 
                alt={owner.name} 
                className="img-cover" 
                width={32} 
                height={32}
              />
            ) : (
              <p className="title-medium">{owner.name.charAt(0)}</p>
            )}
          </div>
          <div>
            <p className="label-large text-on-surface">{owner.name}</p>
            <p className="body-small text-on-surface-variant">
              {formatDate(createdAt)}
            </p>
          </div>
          <p className="label-small text-on-surface-variant trailing-text">
            {readingTime} min read
          </p>
        </div>

        <div className="card-title title-medium text-on-surface">{title}</div>
      </div>
      
      <div className="card-footer">
        <div className="wrapper">
          <span className="icon-small material-symbols-rounded text-on-surface-variant">
            favorite
          </span>
          <p className="body-medium text-on-surface-variant">
            {reaction} Reactions
          </p>
        </div>

        <div className="wrapper">
          <span className="icon-small material-symbols-rounded text-on-surface-variant">
            bookmark
          </span>
          <p className="body-medium text-on-surface-variant">
            {totalBookmark} Bookmark
          </p>
        </div>
      </div>
      
      <Link href={`/blogs/${blogId}`} title={title} className="card-link"></Link>
      <div className="state-layer"></div>
    </div>
  );
} 