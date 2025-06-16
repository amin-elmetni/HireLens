import { useState, useEffect, useCallback } from 'react';
import { getUserCollections } from '@/api/collectionApi';

export default function useUserCollections(userId) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshCollections = useCallback(() => {
    if (!userId) return;
    setLoading(true);
    getUserCollections(userId)
      .then(res => setCollections(res.data))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    refreshCollections();
  }, [refreshCollections]);

  return { collections, loading, refreshCollections };
}
