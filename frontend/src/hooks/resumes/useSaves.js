// src/hooks/useSaves.js
import { useEffect, useState } from 'react';
import { saveResume, unsaveResume, hasSavedResume } from '@/api/saveApi';
import { getResumeByUuid } from '@/api/likeApi';
import { getUser } from '@/utils/userUtils';

export const useSaves = uuid => {
  const user = getUser();
  const [resumeId, setResumeId] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!uuid || !user) return;

    const fetchSaveData = async () => {
      try {
        const { data: resume } = await getResumeByUuid(uuid);
        if (!resume?.id) return;
        setResumeId(resume.id);

        const { data } = await hasSavedResume(user.id, resume.id);
        setSaved(data);
      } catch (error) {
        console.error('Error fetching save data:', error);
      }
    };

    fetchSaveData();
  }, [uuid]);

  const toggleSave = async () => {
    if (!resumeId || !user) return;

    try {
      if (saved) {
        await unsaveResume(user.id, resumeId);
      } else {
        await saveResume({ userId: user.id, resumeId });
      }
      setSaved(prev => !prev);
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  return { saved, toggleSave };
};
