'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Log in the user with email and password after registration
        await login(formData.email, formData.password);
        router.push('/');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('registration failed:' + err);
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
              Join the <b>ThoughtVibe</b> community
            </p>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="form">
              <div className="text-field-wrapper">
                <label htmlFor="name" className="body-large label">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  autoComplete="name" 
                  placeholder=" " 
                  required 
                  className="body-large text-field"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="text-field-wrapper">
                <label htmlFor="email" className="body-large label">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
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
                  name="password" 
                  id="password" 
                  minLength={8} 
                  placeholder=" " 
                  required 
                  className="body-large text-field"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="text-field-wrapper">
                <label htmlFor="confirm-password" className="body-large label">Confirm password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  id="confirm-password" 
                  placeholder=" " 
                  required 
                  className="body-large text-field"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-fill" 
                disabled={loading}
              >
                <p className="label-large">
                  {loading ? 'Signing up...' : 'Sign up'}
                </p>
                <div className="state-layer"></div>
              </button>
            </form>
          </div>
          <div className="card-footer">
            <p className="label-large">Already have an account?</p>
            <Link href="/login" className="label-large text-primary">Sign in</Link>
          </div>
        </div>
      </div>        
    </section>
  );
} 