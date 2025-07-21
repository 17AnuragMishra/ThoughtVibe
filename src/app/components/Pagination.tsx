'use client';

import Link from 'next/link';

interface PaginationProps {
  pagination: {
    next: string | null;
    prev: string | null;
    totalPage: number;
    currentPage: number;
    limit: number;
    skip: number;
  };
}

export default function Pagination({ pagination }: PaginationProps) {
  const { next, prev, totalPage, currentPage } = pagination;

  if (!next && !prev) {
    return null;
  }

  return (
    <div className="pagination">
      {prev && (
        <Link href={prev} className="btn btn-text">
          <span className="material-symbols-rounded leading-icon">chevron_left</span>
          <p className="label-large">Previous</p>
          <div className="state-layer"></div>
        </Link>
      )}

      <div className="pagination-info">
        <p className="body-medium text-on-surface">
          Page {currentPage} of {totalPage}
        </p>
      </div>

      {next && (
        <Link href={next} className="btn btn-text">
          <p className="label-large">Next</p>
          <span className="material-symbols-rounded trailing-icon">chevron_right</span>
          <div className="state-layer"></div>
        </Link>
      )}
    </div>
  );
} 