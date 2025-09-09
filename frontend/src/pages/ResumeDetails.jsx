import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResumeMainInfo from '@/components/ResumeDetails/ResumeMainInfo';
import ResumeAnalytics from '@/components/ResumeDetails/ResumeAnalytics';
import ResumeInfoBlocks from '@/components/ResumeDetails/ResumeInfoBlocks';
import ResumeLanguagesCerts from '@/components/ResumeDetails/ResumeLanguagesCerts';
import ResumeExperiences from '@/components/ResumeDetails/ResumeExperiences';
import ResumeProjects from '@/components/ResumeDetails/ResumeProjects';
import ResumeEducation from '@/components/ResumeDetails/ResumeEducation';
import ResumeComments from '@/components/ResumeDetails/ResumeComments';
import { postComment, getCommentsByResumeId, deleteComment, updateComment } from '@/api/commentApi';
import { useAuthUser } from '@/hooks/auth/useAuthUser';
import ResumeSuggestionsSidebar from '@/components/ResumeDetails/ResumeSuggestionsSidebar';
import NavBar from '@/components/NavBar/NavBar';
import useResumeMetadataByUuid from '@/hooks/resumes/useResumeMetadataByUuid';
import { getResumeByUuid } from '@/api/resumeApi';

export default function ResumeDetailsPage() {
  const { uuid } = useParams();
  const { metadata: resume, loading, error } = useResumeMetadataByUuid(uuid);
  const [comments, setComments] = useState(resume?.comments || []);
  const [sqlResume, setSqlResume] = useState(null);
  const user = useAuthUser();

  // Fetch comments from backend when sqlResume is loaded
  useEffect(() => {
    async function fetchComments() {
      if (sqlResume?.id) {
        try {
          const { data } = await getCommentsByResumeId(sqlResume.id, user?.id);
          setComments(data);
        } catch (e) {
          setComments([]);
        }
      }
    }
    fetchComments();
  }, [sqlResume, user?.id]);

  useEffect(() => {
    async function fetchSqlResume() {
      try {
        const { data } = await getResumeByUuid(uuid);
        setSqlResume(data);
      } catch (e) {
        setSqlResume(null);
      }
    }
    if (uuid) fetchSqlResume();
  }, [uuid]);

  const handleAddComment = async content => {
    if (!sqlResume?.id || !user?.id) return false;
    const comment = {
      userId: user.id,
      userName: user.name,
      resumeId: sqlResume.id,
      content,
    };
    try {
      const { data: newComment } = await postComment(comment);
      setComments(prev => [newComment, ...prev]);
      return true;
    } catch (e) {
      return false;
    }
  };

  if (loading) return <div className='text-center py-20'>Loading...</div>;
  if (error) return <div className='text-center py-20 text-red-500'>{error.message || error}</div>;
  if (!resume) return null;
  // console.log(sqlResume.id);

  return (
    <div className='bg-white min-h-screen pb-12'>
      <NavBar />
      <div className='max-w-[105rem] mx-auto px-6 lg:px-24  mt-12'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Main column */}
          <div className='lg:col-span-3 flex flex-col gap-8 mr-5'>
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
            <ResumeComments
              comments={comments}
              onAddComment={handleAddComment}
              onDeleteComment={async commentId => {
                try {
                  await deleteComment(commentId, user.id);
                  setComments(prev => prev.filter(c => c.id !== commentId));
                } catch (e) {
                  console.error('Failed to delete comment:', e);
                }
              }}
              onUpdateComment={async (commentId, newContent) => {
                try {
                  // Send newContent as raw string (backend expects string)
                  const { data: updatedComment } = await updateComment(commentId, newContent);
                  setComments(prev => prev.map(c => (c.id === commentId ? updatedComment : c)));
                } catch (e) {
                  console.error('Failed to update comment:', e);
                }
              }}
            />
          </div>
          {/* Sidebar: Download + Similar */}
          <ResumeSuggestionsSidebar resume={resume} />
        </div>
      </div>
    </div>
  );
}
