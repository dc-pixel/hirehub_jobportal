'use client';

import { useMemo, useState } from 'react';

type Job = { id:number; title:string; company:string; location:string; type:string; salary:string; experience:string; category:string };

const jobs: Job[] = [
  {id:1,title:'WordPress Developer',company:'TechNova Labs',location:'Noida, India',type:'Full Time',salary:'₹4–7 LPA',experience:'0–2 years',category:'Development'},
  {id:2,title:'Frontend Developer',company:'PixelCraft',location:'Remote',type:'Full Time',salary:'₹6–10 LPA',experience:'1–3 years',category:'Development'},
  {id:3,title:'QA Engineer',company:'CloudBridge',location:'Gurugram, India',type:'Full Time',salary:'₹5–8 LPA',experience:'0–2 years',category:'QA'},
  {id:4,title:'PHP Developer',company:'CodeWorks',location:'Delhi, India',type:'Hybrid',salary:'₹5–9 LPA',experience:'1–3 years',category:'Development'},
  {id:5,title:'UI/UX Designer',company:'BrightPixel',location:'Remote',type:'Contract',salary:'₹35–55k/month',experience:'1–3 years',category:'Design'},
  {id:6,title:'Digital Marketing Executive',company:'MarketMint',location:'Noida, India',type:'Full Time',salary:'₹3–5 LPA',experience:'0–2 years',category:'Marketing'}
];

export default function Home() {
  const [query,setQuery]=useState(''); const [location,setLocation]=useState(''); const [category,setCategory]=useState('');
  const [applied,setApplied]=useState<number[]>([]); const [selected,setSelected]=useState<Job|null>(null);
  const filtered=useMemo(()=>jobs.filter(j=>`${j.title} ${j.company} ${j.category}`.toLowerCase().includes(query.toLowerCase()) && j.location.toLowerCase().includes(location.toLowerCase()) && (!category || j.category===category)),[query,location,category]);
  const apply=(id:number)=>{setApplied(a=>a.includes(id)?a:[...a,id]); setSelected(null)};
  return <main><nav className="nav"><div className="container navin"><a href="/" className="logo">Hire<span>Hub</span></a><div className="navlinks"><a href="#jobs">Find Jobs</a><a href="#companies">Companies</a><a href="#about">About</a><a className="btn ghost" href="/dashboard">Dashboard</a><a className="btn primary" href="/auth">Login / Register</a></div></div></nav>
  <section className="hero"><div className="container"><h1>Find a job you’ll love.</h1><p>Discover opportunities from growing companies and build the career you want with HireHub.</p><div className="searchbox"><input className="field" placeholder="Job title, skill or company" value={query} onChange={e=>setQuery(e.target.value)}/><input className="field" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)}/><select className="field" value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option><option>Development</option><option>QA</option><option>Design</option><option>Marketing</option></select><button className="btn primary" onClick={()=>document.getElementById('jobs')?.scrollIntoView()}>Search Jobs</button></div></div></section>
  <section className="section" id="jobs"><div className="container"><div className="sectionhead"><div><h2>Latest opportunities</h2><div className="muted">{filtered.length} jobs matching your search</div></div></div>{filtered.length?<div className="jobs">{filtered.map(j=><article className="card" key={j.id}><div className="jobtop"><span className="badge">{j.type}</span><span className="muted">{j.experience}</span></div><h3>{j.title}</h3><div className="company">{j.company}</div><div className="meta"><span>📍 {j.location}</span><span>💼 {j.category}</span></div><div className="cardfoot"><span className="salary">{j.salary}</span><button className="btn primary" onClick={()=>setSelected(j)}>View & Apply</button></div></article>)}</div>:<div className="empty">No jobs found. Try another search.</div>}</div></section>
  <section className="section" id="companies"><div className="container"><h2>Built for modern hiring</h2><p className="muted">HireHub gives candidates a simple way to discover jobs and gives recruiters a focused workflow for hiring.</p><div className="stats"><div className="stat"><strong>1,200+</strong>Open positions</div><div className="stat"><strong>350+</strong>Hiring companies</div><div className="stat"><strong>98%</strong>Profile completion</div></div></div></section>
  <footer className="footer" id="about"><div className="container">© 2026 HireHub · Next.js portfolio project · <a href="/auth">Account Access</a></div></footer>
  {selected&&<div className="modalback" onClick={()=>setSelected(null)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modalhead"><h2>{selected.title}</h2><button className="close" onClick={()=>setSelected(null)}>×</button></div><p className="company">{selected.company}</p><p className="muted">📍 {selected.location} · {selected.type} · {selected.experience}</p><p>Join a growing team and work on real-world products. Sign in or register to submit an application.</p><div className="form"><label>Resume</label><input type="file" accept=".pdf,.doc,.docx"/><label>Cover letter</label><input placeholder="Why are you a good fit?"/><button className="btn primary" onClick={()=>apply(selected.id)}>{applied.includes(selected.id)?'Already Applied':'Submit Application'}</button><a className="btn ghost" href="/auth">Login / Register</a></div></div></div>}
  </main>;
}
