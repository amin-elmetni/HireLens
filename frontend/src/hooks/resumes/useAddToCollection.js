import { useState, useCallback } from 'react';
import { getUserCollections, createCollection } from '@/api/collectionApi';
import { addItemToCollection } from '@/api/collectionItemApi';

export function useAddToCollection(userId, resumeId) {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleCreateNew = async () => {
    const name = prompt('Collection name?');
    if (!name) return;
    setLoading(true);
    try {
      const res = await createCollection({
        name,
        visibility: 'PRIVATE',
        userId, // Adjust if needed
      });
      fetchCollections();
      setSelected(res.data);
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
    onCreateNew: handleCreateNew,
    onAdd: handleAdd,
    loading,
    canAdd: !!selected,
  };
}
