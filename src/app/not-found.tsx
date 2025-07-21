import Link from 'next/link';
import TopAppBar from './components/TopAppBar';

export default function NotFound() {
  return (
    <div>
      <TopAppBar />
      <div className="main">
        <article className="page">
          <div className="container">
            <div className="error-page">
              <h1 className="headline-large text-on-surface">404</h1>
              <h2 className="title-large text-on-surface">Page Not Found</h2>
              <p className="body-large text-on-surface-variant">
                The page you're looking for doesn't exist.
              </p>
              <Link href="/" className="btn btn-fill">
                <p className="label-large">Go Home</p>
                <div className="state-layer"></div>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
} 