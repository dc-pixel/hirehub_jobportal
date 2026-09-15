'use client';

import { useEffect, useMemo, useState } from 'react';
import { getApplications, getStoredJobs, saveApplications, type Application, type Job } from './lib/data';

type Session = { id:string; name:string; email:string; role:'candidate'|'recruiter'|'admin' };

export default function Home() {
  const [jobs,setJobs]=useState<Job[]>([]); const [query,setQuery]=useState(''); const [location,setLocation]=useState(''); const [category,setCategory]=useState('');
  const [selected,setSelected]=useState<Job|null>(null); const [saved,setSaved]=useState<number[]>([]); const [applied,setApplied]=useState<number[]>([]); const [session,setSession]=useState<Session|null>(null); const [coverLetter,setCoverLetter]=useState(''); const [resumeName,setResumeName]=useState(''); const [message,setMessage]=useState('');
  useEffect(()=>{
    setJobs(getStoredJobs());
    let raw: string | null = null;
    let rawSaved: string | null = null;
    try { raw=localStorage.getItem('hirehub_session'); rawSaved=localStorage.getItem('hirehub_saved'); } catch {}
    if(raw){try{setSession(JSON.parse(raw));}catch{}}
    const apps=getApplications(); let email=''; try{email=JSON.parse(raw||'{}').email||'';}catch{} setApplied(apps.filter(a=>a.candidateEmail===email).map(a=>a.jobId));
    if(rawSaved)try{const parsed=JSON.parse(rawSaved); if(Array.isArray(parsed))setSaved(parsed);}catch{}
  },[]);
  const filtered=useMemo(()=>jobs.filter(j=>`${j.title} ${j.company} ${j.category} ${j.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase())&&j.location.toLowerCase().includes(location.toLowerCase())&&(!category||j.category===category)),[jobs,query,location,category]);
  const toggleSaved=(id:number)=>{const next=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];setSaved(next);try{localStorage.setItem('hirehub_saved',JSON.stringify(next));}catch{setMessage('Saved jobs are unavailable because browser storage is disabled or full.');}};
  const submitApplication=()=>{
    if(!selected)return;
    if(!session||session.role!=='candidate'){setMessage('Please sign in with a Candidate account before applying.');return;}
    if(applied.includes(selected.id)){setMessage('You have already applied for this job.');return;}
    const app:Application={id:crypto.randomUUID(),jobId:selected.id,jobTitle:selected.title,company:selected.company,candidateEmail:session.email,candidateName:session.name,recruiterEmail:selected.recruiterEmail,coverLetter,resumeName,status:'Applied',appliedAt:new Date().toISOString()};
    saveApplications([...getApplications(),app]);setApplied([...applied,selected.id]);setMessage('Application submitted successfully.');setCoverLetter('');setResumeName('');setTimeout(()=>{setSelected(null);setMessage('')},1200);
  };
  const logout=()=>{try{localStorage.removeItem('hirehub_session');}catch{} window.location.reload();};
  return <main>
    <nav className="nav"><div className="container navin"><a href="/" className="logo">Hire<span>Hub</span></a><div className="navlinks"><a href="#jobs">Find Jobs</a><a href="#companies">Companies</a><a href="#about">About</a>{session?<><a className="btn ghost" href="/dashboard">Dashboard</a><button className="btn primary" onClick={logout}>Logout</button></>:<a className="btn primary" href="/auth">Login / Register</a>}</div></div></nav>
    <section className="hero"><div className="container"><div className="eyebrow">{session?`SIGNED IN AS ${session.role.toUpperCase()}`:'SMARTER JOB SEARCH'}</div><h1>Find a job you’ll love.</h1><p>Discover opportunities from growing companies and build the career you want with HireHub.</p><div className="searchbox"><input className="field" placeholder="Job title, skill or company" value={query} onChange={e=>setQuery(e.target.value)}/><input className="field" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)}/><select className="field" value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option><option>Development</option><option>QA</option><option>Design</option><option>Marketing</option><option>Sales</option></select><button className="btn primary" onClick={()=>document.getElementById('jobs')?.scrollIntoView({behavior:'smooth'})}>Search Jobs</button></div></div></section>
    <section className="section" id="jobs"><div className="container"><div className="sectionhead"><div><div className="eyebrow">OPPORTUNITIES</div><h2>Latest opportunities</h2><div className="muted">{filtered.length} jobs matching your search</div></div></div>{filtered.length?<div className="jobs">{filtered.map(j=><article className="card" key={j.id}><div className="jobtop"><span className="badge">{j.type}</span><span className="muted">{j.experience}</span></div><div className="cardtitle"><h3>{j.title}</h3><button className="savebtn" aria-label="Save job" onClick={()=>toggleSaved(j.id)}>{saved.includes(j.id)?'★':'☆'}</button></div><div className="company">{j.company}</div><div className="meta"><span>📍 {j.location}</span><span>💼 {j.category}</span></div><div className="skills">{j.skills.slice(0,4).map(s=><span key={s}>{s}</span>)}</div><div className="cardfoot"><span className="salary">{j.salary}</span><button className="btn primary" onClick={()=>setSelected(j)}>View & Apply</button></div></article>)}</div>:<div className="empty">No jobs found. Try another search.</div>}</div></section>
    <section className="section alt" id="companies"><div className="container"><div className="eyebrow">HIRING PLATFORM</div><h2>Built for modern hiring</h2><p className="muted">Candidates get a focused search experience. Recruiters get role-based tools for publishing jobs and moving applicants through the hiring pipeline.</p><div className="stats"><div className="stat"><strong>{jobs.length}</strong>Live demo jobs</div><div className="stat"><strong>3</strong>User roles</div><div className="stat"><strong>5</strong>Application stages</div></div></div></section>
    <footer className="footer" id="about"><div className="container">© 2026 HireHub · Next.js portfolio project · <a href="/auth">Account Access</a></div></footer>
    {selected&&<div className="modalback" onClick={()=>setSelected(null)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modalhead"><div><div className="eyebrow">JOB DETAILS</div><h2>{selected.title}</h2></div><button className="close" onClick={()=>setSelected(null)}>×</button></div><p className="company">{selected.company}</p><p className="muted">📍 {selected.location} · {selected.type} · {selected.experience} · {selected.salary}</p><p>{selected.description}</p><div className="skills modalSkills">{selected.skills.map(s=><span key={s}>{s}</span>)}</div><div className="form"><label htmlFor="resume">Resume</label><input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={e=>setResumeName(e.target.files?.[0]?.name||'')}/>{resumeName&&<small className="muted">Selected: {resumeName}</small>}<label htmlFor="cover">Cover letter</label><textarea id="cover" value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} placeholder="Why are you a good fit?"/><button className="btn primary" onClick={submitApplication}>{applied.includes(selected.id)?'Already Applied':'Submit Application'}</button>{!session&&<a className="btn ghost" href="/auth">Login / Register</a>}{message&&<div className="notice">{message}</div>}</div></div></div>}
  </main>;
}
