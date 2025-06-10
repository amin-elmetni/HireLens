import { useEffect, useState } from 'react';
import { getResumeMetadataFilters } from '@/api/resumeApi';

export const useResumeMetadata = () => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getResumeMetadataFilters();
        setMetadata(data);
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { metadata, loading };
};
