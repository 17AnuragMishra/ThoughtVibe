'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Login failed');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section form-section">
      <div className="container">
        <div className="form-card">
          <div className="card-header">
            <Link href="/" className="logo">
              <Image 
                src="/images/thoughtvibe-logo-white-transparent.svg" 
                width={163} 
                height={43} 
                alt="ThoughtVibe" 
                className="light"
              />
              <Image 
                src="/images/thoughtvibe-logo-black-transparent.svg" 
                width={163} 
                height={43} 
                alt="ThoughtVibe" 
                className="dark"
              />
            </Link>
            <p className="body-large text-on-surface-var">
              Welcome back to <b>ThoughtVibe</b>
            </p>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="form">
              <div className="text-field-wrapper">
                <label htmlFor="email" className="body-large label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder=" "
                  required
                  className="body-large text-field"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="text-field-wrapper">
                <label htmlFor="password" className="body-large label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder=" "
                  required
                  className="body-large text-field"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-fill"
              >
                <p className="label-large">
                  {loading ? 'Signing in...' : 'Sign in'}
                </p>
                <div className="state-layer"></div>
              </button>
            </form>
          </div>
          <div className="card-footer">
            <p className="label-large">Don&apos;t have an account?</p>
            <Link href="/register" className="label-large text-primary">Create one</Link>
          </div>
        </div>
      </div>
    </section>
  );
} 