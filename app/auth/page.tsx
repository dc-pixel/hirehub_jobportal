'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'candidate' | 'recruiter';

type Session = {
  name: string;
  email: string;
  role: Role;
};

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<Role>('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const existing = localStorage.getItem('hirehub_session');
    if (existing) router.replace('/dashboard');
  }, [router]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email.includes('@') || password.length < 6) {
      setError('Enter a valid email and a password with at least 6 characters.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const session: Session = {
      name: name.trim() || email.split('@')[0],
      email: email.trim().toLowerCase(),
      role,
    };

    localStorage.setItem('hirehub_session', JSON.stringify(session));
    setMessage(mode === 'login' ? 'Authentication successful. Redirecting...' : 'Account created successfully. Redirecting...');
    setTimeout(() => router.push('/dashboard'), 400);
  };

  return (
    <main className="authpage">
      <div className="authbrand">
        <a href="/" className="logo">Hire<span>Hub</span></a>
        <p>Secure access for candidates and recruiters.</p>
      </div>

      <section className="authcard">
        <div className="authhead">
          <div>
            <div className="eyebrow">ACCOUNT ACCESS</div>
            <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <p className="muted">{mode === 'login' ? 'Sign in to access your personalized HireHub dashboard.' : 'Choose your role and create a HireHub profile.'}</p>
          </div>
        </div>

        <div className="tabs">
          <button className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'register' ? 'tab active' : 'tab'} onClick={() => setMode('register')}>Register</button>
        </div>

        <form className="form" onSubmit={submit}>
          {mode === 'register' && (
            <>
              <label htmlFor="name">Full name</label>
              <input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Dev Chauhan" autoComplete="name" />
            </>
          )}

          <label htmlFor="email">Email address</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required />

          <label>Account type</label>
          <div className="rolegrid">
            <button type="button" className={role === 'candidate' ? 'rolecard selected' : 'rolecard'} onClick={() => setRole('candidate')}>
              <strong>Candidate</strong>
              <span>Find jobs, apply and track applications.</span>
            </button>
            <button type="button" className={role === 'recruiter' ? 'rolecard selected' : 'rolecard'} onClick={() => setRole('recruiter')}>
              <strong>Recruiter</strong>
              <span>Post jobs and manage applicants.</span>
            </button>
          </div>

          {error && <div className="error">{error}</div>}
          {message && <div className="notice">{message}</div>}

          <button className="btn primary authsubmit" type="submit">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="securitynote">
          <strong>Authorization:</strong> HireHub assigns a role to each session and uses that role to control the dashboard and available actions.
        </div>
      </section>
    </main>
  );
}
