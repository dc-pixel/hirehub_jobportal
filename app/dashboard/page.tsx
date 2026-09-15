'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'candidate' | 'recruiter';
type Session = { name: string; email: string; role: Role };

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('hirehub_session');
    if (!raw) {
      router.replace('/auth');
      return;
    }
    try {
      setSession(JSON.parse(raw));
    } catch {
      localStorage.removeItem('hirehub_session');
      router.replace('/auth');
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('hirehub_session');
    router.replace('/auth');
  };

  if (!session) return <main className="dashboard"><div className="container"><div className="empty">Checking authentication...</div></div></main>;

  const isRecruiter = session.role === 'recruiter';

  return (
    <main>
      <nav className="nav">
        <div className="container navin">
          <a href="/" className="logo">Hire<span>Hub</span></a>
          <div className="navlinks">
            <span className="userpill">{session.name} · {session.role}</span>
            <button className="btn ghost" onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>

      <section className="dashboard">
        <div className="container">
          <div className="dashboardhero">
            <div>
              <div className="eyebrow">AUTHORIZED DASHBOARD</div>
              <h1>{isRecruiter ? 'Recruiter Dashboard' : 'Candidate Dashboard'}</h1>
              <p className="muted">Signed in as <strong>{session.email}</strong>. Your {session.role} permissions are active.</p>
            </div>
            <span className="rolebadge">{isRecruiter ? 'RECRUITER' : 'CANDIDATE'}</span>
          </div>

          {isRecruiter ? (
            <>
              <div className="stats">
                <div className="stat"><strong>12</strong>Active Jobs</div>
                <div className="stat"><strong>48</strong>Applicants</div>
                <div className="stat"><strong>8</strong>Shortlisted</div>
              </div>
              <div className="section"><h2>Recruiter permissions</h2><div className="permissiongrid">
                <div className="permission"><strong>✓ Post jobs</strong><span>Create and publish new vacancies.</span></div>
                <div className="permission"><strong>✓ Manage jobs</strong><span>Edit or close your own job listings.</span></div>
                <div className="permission"><strong>✓ View applicants</strong><span>Review candidate applications.</span></div>
                <div className="permission"><strong>✓ Update status</strong><span>Move candidates through your hiring workflow.</span></div>
                <div className="permission denied"><strong>× Candidate-only actions</strong><span>Candidate application history is not available to recruiters.</span></div>
              </div></div>
            </>
          ) : (
            <>
              <div className="stats">
                <div className="stat"><strong>3</strong>Applications</div>
                <div className="stat"><strong>24</strong>Saved Jobs</div>
                <div className="stat"><strong>1</strong>Interview</div>
              </div>
              <div className="section"><h2>Candidate permissions</h2><div className="permissiongrid">
                <div className="permission"><strong>✓ Apply for jobs</strong><span>Submit applications with your resume.</span></div>
                <div className="permission"><strong>✓ Save jobs</strong><span>Keep interesting opportunities for later.</span></div>
                <div className="permission"><strong>✓ Track applications</strong><span>View application and interview status.</span></div>
                <div className="permission"><strong>✓ Manage profile</strong><span>Update your candidate information.</span></div>
                <div className="permission denied"><strong>× Recruiter-only actions</strong><span>Job posting and applicant management are restricted.</span></div>
              </div></div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
