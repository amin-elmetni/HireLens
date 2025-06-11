import { useState, useCallback } from 'react';
import { getUserCollections, createCollection } from '@/api/collectionApi';
import {
  getItemsByCollection,
  addItemToCollection,
  removeItemFromCollection,
} from '@/api/collectionItemApi';
import { getUser } from '@/utils/userUtils';

export function useMultiCollectionPicker(resumeId) {
  const user = getUser();
  const userId = user ? user.id : null;

  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [includedIds, setIncludedIds] = useState(new Set());
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch collections and which ones currently include this resume
  const fetchCollectionsAndIncluded = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (!userId) return;
      const { data: allCollections = [] } = await getUserCollections(userId);
      setCollections(allCollections);

      // For each collection, check if resume is included
      const included = new Set();
      await Promise.all(
        allCollections.map(async col => {
          const { data: items } = await getItemsByCollection(col.id);
          if (items?.some(item => item.resumeId === resumeId)) {
            included.add(col.id);
          }
        })
      );
      setIncludedIds(included);
      setSelectedIds(new Set(included));
    } catch (err) {
      setError('Failed to fetch collections.');
    } finally {
      setLoading(false);
    }
  }, [userId, resumeId]);

  const show = () => {
    fetchCollectionsAndIncluded();
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    setSearch('');
    setError('');
  };

  const onSearch = val => setSearch(val);

  const toggleCollection = colId => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(colId)) next.delete(colId);
      else next.add(colId);
      return next;
    });
  };

  const handleAdd = async () => {
    setLoading(true);
    setError('');
    try {
      const toAdd = [...selectedIds].filter(id => !includedIds.has(id));
      const toRemove = [...includedIds].filter(id => !selectedIds.has(id));
      await Promise.all([
        ...toAdd.map(id => addItemToCollection({ collectionId: id, resumeId })),
        ...toRemove.map(id => removeItemFromCollection(id, resumeId)),
      ]);
      setIncludedIds(new Set(selectedIds));
      setOpen(false);
    } catch (err) {
      setError('Failed to update collections.');
    } finally {
      setLoading(false);
    }
  };

  // -- THIS IS THE NEW/COPIED FUNCTION --
  const onActuallyCreateNew = async (name, description) => {
    setError('');
    setLoading(true);
    try {
      const res = await createCollection({
        name,
        description,
        visibility: 'PRIVATE',
        userId,
      });
      // Refetch collections so the new one appears in the list and can be selected
      await fetchCollectionsAndIncluded();
      // Optionally, auto-select the new collection in the UI
      setSelectedIds(prev => new Set(prev).add(res.data.id));
      return true; // success
    } catch (err) {
      if (err?.response?.status === 409) {
        setError(
          err?.response?.data ||
            `A collection named "${name}" already exists. Please choose a different name.`
        );
      } else if (err?.response?.data) {
        setError(`An error occurred: ${err.response.data}`);
      } else {
        setError(`An error occurred. Please try again. (${err.message})`);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const filteredCollections = search
    ? collections.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : collections;

  return {
    open,
    show,
    hide,
    collections: filteredCollections,
    selectedIds,
    toggleCollection,
    searchQuery: search,
    onSearch,
    handleAdd,
    loading,
    canAdd: selectedIds.size > 0 || includedIds.size > 0,
    error,
    setError,
    onActuallyCreateNew,
  };
}
