export type Role = 'candidate' | 'recruiter' | 'admin';

export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  category: string;
  description: string;
  skills: string[];
  posted: string;
  recruiterEmail: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  company?: string;
};

export type Application = {
  id: string;
  jobId: number;
  jobTitle: string;
  company: string;
  candidateEmail: string;
  candidateName: string;
  recruiterEmail: string;
  coverLetter: string;
  resumeName: string;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  appliedAt: string;
};

export const initialJobs: Job[] = [
  { id: 1, title: 'WordPress Developer', company: 'TechNova Labs', location: 'Noida, India', type: 'Full Time', salary: '₹4–7 LPA', experience: '0–2 years', category: 'Development', description: 'Build, customize and maintain fast, accessible WordPress websites and WooCommerce experiences.', skills: ['WordPress', 'PHP', 'MySQL', 'JavaScript'], posted: '2 days ago', recruiterEmail: 'jobs@technova.example' },
  { id: 2, title: 'Frontend Developer', company: 'PixelCraft', location: 'Remote', type: 'Full Time', salary: '₹6–10 LPA', experience: '1–3 years', category: 'Development', description: 'Create polished, responsive interfaces and reusable components for modern web products.', skills: ['React', 'Next.js', 'TypeScript', 'CSS'], posted: '1 day ago', recruiterEmail: 'jobs@pixelcraft.example' },
  { id: 3, title: 'QA Engineer', company: 'CloudBridge', location: 'Gurugram, India', type: 'Full Time', salary: '₹5–8 LPA', experience: '0–2 years', category: 'QA', description: 'Design test cases, automate regression coverage and collaborate with engineering teams.', skills: ['Manual Testing', 'Selenium', 'API Testing', 'SQL'], posted: '3 days ago', recruiterEmail: 'jobs@cloudbridge.example' },
  { id: 4, title: 'PHP Developer', company: 'CodeWorks', location: 'Delhi, India', type: 'Hybrid', salary: '₹5–9 LPA', experience: '1–3 years', category: 'Development', description: 'Develop secure PHP applications, REST APIs and database-driven features.', skills: ['PHP', 'Laravel', 'MySQL', 'REST API'], posted: '4 days ago', recruiterEmail: 'jobs@codeworks.example' },
  { id: 5, title: 'UI/UX Designer', company: 'BrightPixel', location: 'Remote', type: 'Contract', salary: '₹35–55k/month', experience: '1–3 years', category: 'Design', description: 'Design user flows, wireframes and high-fidelity interfaces for SaaS products.', skills: ['Figma', 'UX Research', 'Prototyping', 'UI Design'], posted: '5 days ago', recruiterEmail: 'jobs@brightpixel.example' },
  { id: 6, title: 'Digital Marketing Executive', company: 'MarketMint', location: 'Noida, India', type: 'Full Time', salary: '₹3–5 LPA', experience: '0–2 years', category: 'Marketing', description: 'Plan campaigns, optimize content and report on acquisition and engagement metrics.', skills: ['SEO', 'Google Ads', 'Analytics', 'Content'], posted: '6 days ago', recruiterEmail: 'jobs@marketmint.example' },
];

export const getStoredJobs = (): Job[] => {
  if (typeof window === 'undefined') return initialJobs;
  try {
    const raw = localStorage.getItem('hirehub_jobs');
    if (!raw) return initialJobs;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialJobs;
  } catch { return initialJobs; }
};

export const saveJobs = (jobs: Job[]) => localStorage.setItem('hirehub_jobs', JSON.stringify(jobs));

export const getApplications = (): Application[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('hirehub_applications');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
};

export const saveApplications = (applications: Application[]) => localStorage.setItem('hirehub_applications', JSON.stringify(applications));

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('hirehub_users');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
};

export const saveUsers = (users: User[]) => localStorage.setItem('hirehub_users', JSON.stringify(users));
