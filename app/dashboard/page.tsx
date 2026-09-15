'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApplications, getStoredJobs, saveApplications, saveJobs, type Application, type Job, type Role } from '../lib/data';

type Session = { id: string; name: string; email: string; role: Role };

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [view, setView] = useState('overview');
  const [notice, setNotice] = useState('');
  const [newJob, setNewJob] = useState({title:'',company:'',location:'',type:'Full Time',salary:'',experience:'0–2 years',category:'Development',description:'',skills:''});

  useEffect(() => {
    let raw: string | null = null;
    try { raw = localStorage.getItem('hirehub_session'); } catch { router.replace('/auth'); return; }
    if (!raw) { router.replace('/auth'); return; }
    try { setSession(JSON.parse(raw)); setJobs(getStoredJobs()); setApplications(getApplications()); }
    catch { try { localStorage.removeItem('hirehub_session'); } catch {} router.replace('/auth'); }
  }, [router]);

  const logout = () => { try { localStorage.removeItem('hirehub_session'); } catch {} router.replace('/auth'); };
  const updateStatus = (id: string, status: Application['status']) => {
    const next = applications.map(app => app.id === id ? {...app, status} : app);
    setApplications(next); saveApplications(next); setNotice(`Application moved to ${status}.`); setTimeout(()=>setNotice(''),2200);
  };

  const createJob = (e: FormEvent) => {
    e.preventDefault(); if (!session || session.role !== 'recruiter') return;
    if (!newJob.title.trim() || !newJob.company.trim() || !newJob.location.trim() || !newJob.salary.trim()) return;
    const job: Job = { id: Date.now(), ...newJob, skills: newJob.skills.split(',').map(s=>s.trim()).filter(Boolean), description: newJob.description.trim() || 'Join our team and build meaningful products.', posted: 'Just now', recruiterEmail: session.email };
    const next = [job, ...jobs]; setJobs(next); saveJobs(next); setNewJob({title:'',company:'',location:'',type:'Full Time',salary:'',experience:'0–2 years',category:'Development',description:'',skills:''}); setView('jobs'); setNotice('Job published successfully.'); setTimeout(()=>setNotice(''),2200);
  };

  const removeJob = (id:number) => { if (!session || session.role !== 'recruiter') return; const next=jobs.filter(job=>!(job.id===id && job.recruiterEmail===session.email)); setJobs(next); saveJobs(next); };

  if (!session) return <main className="dashboard"><div className="container"><div className="empty">Checking authorization...</div></div></main>;
  const isCandidate = session.role === 'candidate';
  const isRecruiter = session.role === 'recruiter';
  const myApplications = applications.filter(a=>a.candidateEmail===session.email);
  const recruiterApplications = applications.filter(a=>a.recruiterEmail===session.email);
  const myJobs = jobs.filter(j=>j.recruiterEmail===session.email);
  const stats = isCandidate ? [myApplications.length, myApplications.filter(a=>a.status==='Interview').length, myApplications.filter(a=>a.status==='Selected').length] : isRecruiter ? [myJobs.length, recruiterApplications.length, recruiterApplications.filter(a=>a.status==='Shortlisted').length] : [jobs.length, applications.length, new Set(applications.map(a=>a.candidateEmail)).size];

  return <main>
    <nav className="nav"><div className="container navin"><a href="/" className="logo">Hire<span>Hub</span></a><div className="navlinks"><span className="userpill">{session.name} · {session.role}</span><button className="btn ghost" onClick={logout}>Logout</button></div></div></nav>
    <section className="dashboard"><div className="container">
      <div className="dashboardhero"><div><div className="eyebrow">AUTHORIZED WORKSPACE</div><h1>{isCandidate?'Candidate Dashboard':isRecruiter?'Recruiter Dashboard':'Admin Dashboard'}</h1><p className="muted">{session.email} · role: <strong>{session.role}</strong></p></div><span className="rolebadge">{session.role.toUpperCase()}</span></div>
      <div className="dashboardtabs">{['overview',...(isCandidate?['applications','saved']:isRecruiter?['jobs','post','applicants']:['jobs','applications'])].map(item=><button key={item} className={view===item?'dashactive':''} onClick={()=>setView(item)}>{item[0].toUpperCase()+item.slice(1)}</button>)}</div>
      {notice&&<div className="notice">{notice}</div>}

      {view==='overview' && <><div className="stats"><div className="stat"><strong>{stats[0]}</strong>{isCandidate?'Applications':isRecruiter?'My Jobs':'Jobs'}</div><div className="stat"><strong>{stats[1]}</strong>{isCandidate?'Interviews':isRecruiter?'Applicants':'Applications'}</div><div className="stat"><strong>{stats[2]}</strong>{isCandidate?'Selected':isRecruiter?'Shortlisted':'Candidates'}</div></div>
        <div className="section"><h2>What you can do</h2><div className="permissiongrid">{(isCandidate?[['✓ Apply for jobs','Submit applications with a resume and cover letter.'],['✓ Save jobs','Keep opportunities for later from the job search page.'],['✓ Track applications','Monitor every application status.'],['✓ Manage profile','Keep your career information current.']]:isRecruiter?[['✓ Post jobs','Create and publish vacancies.'],['✓ Manage jobs','View and remove your own listings.'],['✓ View applicants','Review candidates who applied to your jobs.'],['✓ Update status','Shortlist, interview, select or reject applicants.']]:[['✓ Moderate jobs','Review the platform job inventory.'],['✓ Review applications','Inspect application activity.'],['✓ Monitor users','See candidate and recruiter activity.'],['✓ Platform control','Administrator-only workspace.']]).map(([a,b])=><div className="permission" key={a}><strong>{a}</strong><span>{b}</span></div>)}</div></div>
      </>}

      {view==='applications' && <div className="section"><h2>My applications</h2>{myApplications.length?<div className="tablewrap"><table><thead><tr><th>Job</th><th>Company</th><th>Status</th><th>Applied</th></tr></thead><tbody>{myApplications.map(a=><tr key={a.id}><td>{a.jobTitle}</td><td>{a.company}</td><td><span className="status">{a.status}</span></td><td>{new Date(a.appliedAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>:<div className="empty">No applications yet. <a href="/">Browse jobs</a>.</div>}</div>}
      {view==='saved' && <div className="section"><h2>Saved jobs</h2><div className="empty">Saved jobs are stored in your browser. Return to the job search and use “Save” on a listing.</div></div>}

      {view==='jobs' && <div className="section"><div className="sectionhead"><div><h2>{isRecruiter?'My job listings':'Platform jobs'}</h2><div className="muted">{isRecruiter?myJobs.length:jobs.length} listings</div></div>{isRecruiter&&<button className="btn primary" onClick={()=>setView('post')}>Post a job</button>}</div><div className="jobs">{(isRecruiter?myJobs:jobs).map(j=><article className="card" key={j.id}><div className="jobtop"><span className="badge">{j.type}</span><span className="muted">{j.experience}</span></div><h3>{j.title}</h3><div className="company">{j.company}</div><div className="meta"><span>📍 {j.location}</span><span>💼 {j.category}</span></div><div className="cardfoot"><span className="salary">{j.salary}</span>{isRecruiter&&<button className="btn danger" onClick={()=>removeJob(j.id)}>Remove</button>}<a className="btn ghost" href="/">View</a></div></article>)}</div></div>}

      {view==='post' && isRecruiter && <div className="section"><h2>Post a new job</h2><form className="jobform" onSubmit={createJob}><input placeholder="Job title" value={newJob.title} onChange={e=>setNewJob({...newJob,title:e.target.value})} required/><input placeholder="Company name" value={newJob.company} onChange={e=>setNewJob({...newJob,company:e.target.value})} required/><input placeholder="Location" value={newJob.location} onChange={e=>setNewJob({...newJob,location:e.target.value})} required/><input placeholder="Salary (e.g. ₹6–10 LPA)" value={newJob.salary} onChange={e=>setNewJob({...newJob,salary:e.target.value})} required/><select value={newJob.type} onChange={e=>setNewJob({...newJob,type:e.target.value})}><option>Full Time</option><option>Part Time</option><option>Hybrid</option><option>Remote</option><option>Contract</option></select><input placeholder="Experience (e.g. 2–4 years)" value={newJob.experience} onChange={e=>setNewJob({...newJob,experience:e.target.value})}/><select value={newJob.category} onChange={e=>setNewJob({...newJob,category:e.target.value})}><option>Development</option><option>QA</option><option>Design</option><option>Marketing</option><option>Sales</option></select><input placeholder="Skills, comma separated" value={newJob.skills} onChange={e=>setNewJob({...newJob,skills:e.target.value})}/><textarea placeholder="Job description" value={newJob.description} onChange={e=>setNewJob({...newJob,description:e.target.value})}/><button className="btn primary" type="submit">Publish Job</button></form></div>}

      {view==='applicants' && isRecruiter && <div className="section"><h2>Applicants</h2>{recruiterApplications.length?<div className="tablewrap"><table><thead><tr><th>Candidate</th><th>Job</th><th>Resume</th><th>Status</th><th>Action</th></tr></thead><tbody>{recruiterApplications.map(a=><tr key={a.id}><td>{a.candidateName}<br/><small>{a.candidateEmail}</small></td><td>{a.jobTitle}</td><td>{a.resumeName||'Not attached'}</td><td><span className="status">{a.status}</span></td><td><select value={a.status} onChange={e=>updateStatus(a.id,e.target.value as Application['status'])}><option>Applied</option><option>Shortlisted</option><option>Interview</option><option>Selected</option><option>Rejected</option></select></td></tr>)}</tbody></table></div>:<div className="empty">No applicants yet.</div>}</div>}

      {view==='applications' && session.role==='admin' && <div className="section"><h2>All applications</h2><div className="tablewrap"><table><thead><tr><th>Candidate</th><th>Job</th><th>Company</th><th>Status</th></tr></thead><tbody>{applications.map(a=><tr key={a.id}><td>{a.candidateName}</td><td>{a.jobTitle}</td><td>{a.company}</td><td>{a.status}</td></tr>)}</tbody></table></div></div>}
    </div></section>
  </main>;
}
