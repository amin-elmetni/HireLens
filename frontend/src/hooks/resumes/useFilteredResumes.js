import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFilteredResumes } from '@/api/resumeApi';

export const useFilteredResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries([...searchParams]);
        const { data } = await getFilteredResumes(params);
        setResumes(data);
      } catch (err) {
        console.error('Error loading filtered resumes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [searchParams]);

  return { resumes, loading };
};
