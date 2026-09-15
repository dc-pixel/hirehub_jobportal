'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, saveUsers, type Role, type User } from '../lib/data';

type Session = Pick<User, 'id' | 'name' | 'email' | 'role'>;

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<Exclude<Role, 'admin'>>('candidate');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (localStorage.getItem('hirehub_session')) router.replace('/dashboard');
    const users = getUsers();
    if (!users.some(user => user.email === 'admin@hirehub.demo')) {
      saveUsers([...users, { id: 'admin-1', name: 'HireHub Admin', email: 'admin@hirehub.demo', password: 'Admin@123', role: 'admin' }]);
    }
  }, [router]);

  const submit = (event: FormEvent) => {
    event.preventDefault(); setError(''); setMessage('');
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || password.length < 6) {
      setError('Enter a valid email and a password with at least 6 characters.'); return;
    }
    const users = getUsers();

    if (mode === 'register') {
      if (!name.trim()) { setError('Please enter your full name.'); return; }
      if (users.some(user => user.email === normalizedEmail)) { setError('An account with this email already exists.'); return; }
      const user: User = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, password, role, company: role === 'recruiter' ? company.trim() : undefined };
      saveUsers([...users, user]);
      localStorage.setItem('hirehub_session', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }));
      setMessage('Account created successfully.');
      setTimeout(() => router.push('/dashboard'), 300); return;
    }

    const user = users.find(item => item.email === normalizedEmail && item.password === password);
    if (!user) { setError('Invalid email or password.'); return; }
    localStorage.setItem('hirehub_session', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }));
    setMessage('Authentication successful.');
    setTimeout(() => router.push('/dashboard'), 300);
  };

  return <main className="authpage">
    <div className="authbrand"><a href="/" className="logo">Hire<span>Hub</span></a><p>One account. The right hiring workflow.</p></div>
    <section className="authcard">
      <div className="authhead"><div><div className="eyebrow">ACCOUNT ACCESS</div><h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1><p className="muted">{mode === 'login' ? 'Sign in to your role-based HireHub workspace.' : 'Create a candidate or recruiter account.'}</p></div></div>
      <div className="tabs"><button type="button" className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => {setMode('login');setError('')}}>Login</button><button type="button" className={mode === 'register' ? 'tab active' : 'tab'} onClick={() => {setMode('register');setError('')}}>Register</button></div>
      <form className="form" onSubmit={submit}>
        {mode === 'register' && <><label htmlFor="name">Full name</label><input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
          <label>Account type</label><div className="rolegrid"><button type="button" className={role === 'candidate' ? 'rolecard selected' : 'rolecard'} onClick={() => setRole('candidate')}><strong>Candidate</strong><span>Find jobs and track applications.</span></button><button type="button" className={role === 'recruiter' ? 'rolecard selected' : 'rolecard'} onClick={() => setRole('recruiter')}><strong>Recruiter</strong><span>Post jobs and manage applicants.</span></button></div>
          {role === 'recruiter' && <><label htmlFor="company">Company name</label><input id="company" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company" required /></>}
        </>}
        <label htmlFor="email">Email address</label><input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
        <label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required />
        {error && <div className="error">{error}</div>}{message && <div className="notice">{message}</div>}
        <button className="btn primary authsubmit" type="submit">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
      </form>
      <div className="securitynote"><strong>Demo admin:</strong> admin@hirehub.demo / Admin@123. Production authentication must use server-side sessions, password hashing and a database; this portfolio demo stores accounts locally in the browser.</div>
    </section>
  </main>;
}
