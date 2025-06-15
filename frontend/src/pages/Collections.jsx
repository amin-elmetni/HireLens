import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CollectionTabs from '@/components/Collections/CollectionTabs';
import CollectionList from '@/components/Collections/CollectionList';
import CreateCollectionModal from '@/components/Collections/CreateCollectionModal';
import ConfirmationToast from '@/components/ui/ConfirmationToast';
import { getUser } from '@/utils/userUtils';
import { getUserCollections } from '@/api/collectionApi';
import Navbar from '@/components/NavBar/NavBar';
import SearchInput from '@/components/ui/SearchInput';
import SortDropdown from '@/components/ui/SortDropdown';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CollectionResumesList from '@/components/Collections/CollectionResumesList';

const Collections = () => {
  const [activeTab, setActiveTab] = useState('collections');
  const [collections, setCollections] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', id: 0 });

  const showToast = message => setToast(prev => ({ show: true, message, id: prev.id + 1 }));

  const handleToastClose = () => setToast(prev => ({ ...prev, show: false, message: '' }));

  const user = getUser();
  const { collectionId } = useParams();
  const navigate = useNavigate();

  const refreshCollections = useCallback(() => {
    if (user) {
      getUserCollections(user.id).then(res => setCollections(res.data));
    }
  }, [user]);

  useEffect(() => {
    refreshCollections();
  }, [refreshCollections]);

  const filteredCollections = collections
    .filter(col => col.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === 'recent'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : a.name.localeCompare(b.name)
    );

  const selectedCollection = collectionId
    ? collections.find(col => String(col.id) === String(collectionId))
    : null;

  return (
    <>
      <Navbar />
      <div
        id='main-content'
        className='max-w-4xl mx-auto mt-8 px-4'
      >
        <div className='flex items-center justify-between mb-4'>
          <CollectionTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          {activeTab === 'collections' && (
            <PrimaryButton onClick={() => setShowCreateModal(true)}>
              <FontAwesomeIcon
                icon='fa-solid fa-plus'
                className='mr-2'
                size='sm'
              />
              Create Collection
            </PrimaryButton>
          )}
        </div>
        {activeTab === 'collections' && (
          <>
            <div className='flex items-center justify-between gap-4 mb-2'>
              <h2 className='text-2xl font-semibold'>
                {selectedCollection
                  ? // ? `Resumes in "${selectedCollection.name}"`
                    ``
                  : `Your Collections (${collections.length})`}
              </h2>
              {!selectedCollection && (
                <SortDropdown
                  options={[
                    { label: 'Recent', value: 'recent' },
                    { label: 'Alphabetical', value: 'alphabetical' },
                  ]}
                  value={sort}
                  onChange={setSort}
                  showLabels={false}
                />
              )}
            </div>
            {!selectedCollection && (
              <SearchInput
                placeholder='Search Collections...'
                value={search}
                onChange={e => setSearch(e.target.value)}
                className='my-6'
              />
            )}
            {!selectedCollection ? (
              <CollectionList
                collections={filteredCollections}
                onAction={refreshCollections}
                onShowToast={showToast}
              />
            ) : (
              <CollectionResumesList
                collection={selectedCollection}
                onBack={() => navigate('/collections')}
              />
            )}
          </>
        )}
        {showCreateModal && (
          <CreateCollectionModal
            onClose={() => setShowCreateModal(false)}
            onCreated={() => {
              setShowCreateModal(false);
              refreshCollections();
              showToast('Collection created!');
            }}
          />
        )}
      </div>
      <ConfirmationToast
        key={toast.id}
        message={toast.message}
        show={toast.show}
        onClose={handleToastClose}
      />
    </>
  );
};

export default Collections;
