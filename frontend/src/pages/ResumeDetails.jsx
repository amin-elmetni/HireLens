import React from 'react';
import ResumeMainInfo from '@/components/ResumeDetails/ResumeMainInfo';
import ResumeAnalytics from '@/components/ResumeDetails/ResumeAnalytics';
import ResumeInfoBlocks from '@/components/ResumeDetails/ResumeInfoBlocks';
import ResumeLanguagesCerts from '@/components/ResumeDetails/ResumeLanguagesCerts';
import ResumeExperiences from '@/components/ResumeDetails/ResumeExperiences';
import ResumeProjects from '@/components/ResumeDetails/ResumeProjects';
import ResumeEducation from '@/components/ResumeDetails/ResumeEducation';
import ResumeComments from '@/components/ResumeDetails/ResumeComments';
import ResumeSuggestionsSidebar from '@/components/ResumeDetails/ResumeSuggestionsSidebar';
import NavBar from '@/components/NavBar/NavBar';

// Dummy data for demonstration
const resume = {
  name: 'Kunika Bhargav',
  email: 'bhargav496@gmail.com',
  phone: '+917983924436',
  personal_links: {
    github: 'https://github.com/KunikaBhargav',
    linkedin: 'https://linkedin.com/in/kunika01bhargav',
  },
  skills: [
    { name: 'scikit-learn', score: 0.96 },
    { name: 'r', score: 0.89 },
    { name: 'sql', score: 0.88 },
    { name: 'postgresql', score: 0.72 },
    { name: 'pandas', score: 0.49 },
    { name: 'matplotlib', score: 0.31 },
    { name: 'seaborn', score: 0.55 },
    { name: 'swot analysis', score: 0.79 },
    { name: 'naive bayes', score: 0.34 },
    { name: 'machine learning', score: 0.8 },
    { name: 'recommendation system', score: 0.72 },
    { name: 'data cleaning', score: 0.78 },
    { name: 'nlp', score: 0.35 },
    { name: 'google colab', score: 0.49 },
    { name: 'logistic regression', score: 0.93 },
    { name: 'random forest', score: 0.94 },
    { name: 'tableau', score: 0.78 },
    { name: 'story telling', score: 0.54 },
    { name: 'almabetter', score: 0.87 },
  ],
  languages: ['English', 'Hindi', 'German', 'French'],
  experiences: [
    {
      job_title: 'Senior Frontend Developer',
      company: 'TechCorp Solutions',
      duration: '06/2020 - Present',
      description:
        'Architected and implemented responsive web applications using React and Next.js, improving user engagement by 40%.',
    },

    {
      job_title: 'UX/UI Designer',
      company: 'CreativeMind Studio',
      duration: '01/2019 - 05/2022',
      description:
        'Designed intuitive user interfaces for mobile and web applications, conducting user research and A/B testing to optimize conversion rates.',
    },

    {
      job_title: 'DevOps Engineer',
      company: 'CloudScale Technologies',
      duration: '03/2021 - Present',
      description:
        'Implemented CI/CD pipelines and infrastructure as code, reducing deployment times by 75% and improving system reliability.',
    },

    {
      job_title: 'Product Manager',
      company: 'Innovate Inc.',
      duration: '08/2018 - 12/2021',
      description:
        'Led cross-functional teams to deliver SaaS products, managing the entire product lifecycle from ideation to launch.',
    },

    {
      job_title: 'Machine Learning Engineer',
      company: 'AI Research Labs',
      duration: '09/2020 - 02/2023',
      description:
        'Developed computer vision models for medical image analysis, achieving 95% accuracy in early disease detection.',
    },

    {
      job_title: 'Cybersecurity Analyst',
      company: 'SecureNet Systems',
      duration: '05/2019 - Present',
      description:
        'Implemented security protocols and conducted penetration testing, reducing system vulnerabilities by 90%.',
    },

    {
      job_title: 'Full Stack Developer',
      company: 'WebCraft Studios',
      duration: '11/2021 - Present',
      description:
        'Built RESTful APIs and dynamic frontends using Node.js and React, delivering 15+ client projects on schedule.',
    },
  ],
  projects: [
    {
      project_title: 'Zomato Restaurant Clustering and Sentiment Analysis',
      project_summary: 'Performed EDA, data visualization, ...',
    },
    {
      project_title: 'Company Bankruptcy Prediction',
      project_summary: 'Performed EDA, data visualization, ...',
    },
  ],
  education: [
    {
      degree: 'M. Tech in VLSI Design',
      institution: 'Ideal Institute of Technology, Ghaziabad',
      year: '2014 - 2017',
    },
    {
      degree: 'B.E in Electronics Engineering',
      institution: 'GHRIETW, Nagpur',
      year: '2009 - 2013',
    },
  ],
  certifications: [
    'Python & SQL Gold Batches - HackerRank (2022)',
    'HackerRank Coding Challenges and get 4 clusters',
  ],
  years_of_experience: 5,
  categories: [
    { name: 'Cloud Practitioner', score: 0.92 },
    { name: 'ML Engineer', score: 0.68 },
    { name: 'Python Developer', score: 0.84 },
    { name: 'SQL Expert', score: 0.77 },
  ],
  final_score: 0.69,
  last_updated: '2025-06-11T16:24:42Z',
  uuid: '22fb02f8-0560-4d4b-b269-246cd23e0c37',
  age: 27,
  address: {
    city: 'Berlin',
    country: 'Germany',
  },
  summary:
    'Results-driven Data Engineer with 5 years of experience in cybersecurity. Holds a M. Tech in VLSI Design with expertise in Python, R, SQL. Developed innovative solutions for various organizations. Passionate about creating efficient, scalable solutions and continuously learning new technologies.',
};

// Dummy comments and similar resumes for demonstration
const comments = [
  {
    id: 1,
    user: { name: 'El Metni Mohamed Amin', avatar: '', rating: 3.5 },
    date: '01/05/2024',
    comment:
      'Great resume! The NLP models section is impressive. Would like to know more about the business impact achieved.',
  },
  {
    id: 2,
    user: { name: 'Salmi Rihab', avatar: '', rating: 4 },
    date: '17/04/2024',
    comment:
      'Solid experience and clear summary. Skills section could emphasize more recent projects.',
  },
];

const similarResumes = [
  {
    id: 1,
    name: 'Anuva Goyal',
    city: 'Berlin',
    topCategory: 'ML Engineer',
    avatar: '',
    comments: 2,
    experience: 4,
    rating: 4.2,
  },
  {
    id: 2,
    name: 'Christopher Morgan',
    city: 'Munich',
    topCategory: 'ML Engineer',
    avatar: '',
    comments: 3,
    experience: 6,
    rating: 4.8,
  },
];

export default function ResumeDetails() {
  return (
    <div className='bg-white min-h-screen pb-12'>
      <NavBar />
      <div className='max-w-7xl mx-auto px-6 lg:px-24 pt-10 mt-4'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Main column */}
          <div className='lg:col-span-3 flex flex-col gap-6 mr-5'>
            <ResumeMainInfo resume={resume} />
            <div className='h-[1px] bg-gray-200'></div>
            <div>
              <div className='font-bold text-lg mb-2 text-primary'>About</div>
              <div className='text-gray-700 text-base'>{resume.summary}</div>
            </div>
            <ResumeInfoBlocks resume={resume} />
            <ResumeAnalytics resume={resume} />
            <ResumeExperiences experiences={resume.experiences} />
            <ResumeProjects projects={resume.projects} />
            <ResumeEducation education={resume.education} />
            <ResumeLanguagesCerts resume={resume} />
            <div className='mt-2'></div>
            <ResumeComments comments={comments} />
          </div>
          {/* Sidebar: Download + Similar */}
          <ResumeSuggestionsSidebar
            resume={resume}
            similarResumes={similarResumes}
          />
        </div>
      </div>
    </div>
  );
}
