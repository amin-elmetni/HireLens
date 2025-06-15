import { useEffect, useState } from 'react';
import { getResumeMetadataByUuid } from '@/api/resumeApi';

export default function useResumeMetadataByUuid(uuid) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(!!uuid);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uuid) {
      setMetadata(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getResumeMetadataByUuid(uuid)
      .then(res => setMetadata(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [uuid]);

  return { metadata, loading, error };
}
