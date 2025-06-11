import { useState, useCallback } from 'react';
import { getUserCollections, createCollection } from '@/api/collectionApi';
import { addItemToCollection } from '@/api/collectionItemApi';

export function useAddToCollection(userId, resumeId) {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCollections = useCallback(async () => {
    if (!userId) return;
    const res = await getUserCollections(userId);
    setCollections(res.data || []);
  }, [userId]);

  const show = () => {
    fetchCollections();
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    setSearch('');
    setSelected(null);
  };

  const onSearch = val => setSearch(val);

  const onSelect = col => setSelected(col);

  const handleAdd = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await addItemToCollection({
        collectionId: selected.id,
        resumeId,
      });
      hide();
    } finally {
      setLoading(false);
    }
  };

  // Handler for new collection creation used by drawer
  const onActuallyCreateNew = async name => {
    setError('');
    setLoading(true);
    try {
      const res = await createCollection({
        name,
        visibility: 'PRIVATE',
        userId,
      });
      await fetchCollections();
      setSelected(res.data);
    } catch (err) {
      if (err?.response?.status === 409) {
        setError('A collection with this name already exists.');
      } else {
        setError('An error occurred. Please try again.');
      }
      // Don't close create mode if error!
      return;
    } finally {
      setLoading(false);
    }
  };

  const filtered = search
    ? collections.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : collections;

  return {
    open,
    show,
    hide,
    collections: filtered,
    selected,
    onSelect,
    onSearch,
    searchQuery: search,
    onActuallyCreateNew,
    onAdd: handleAdd,
    loading,
    canAdd: !!selected,
    error,
    setError,
  };
}
