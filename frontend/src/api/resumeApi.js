import api from './index';

export const getFilteredResumes = params => api.get('/api/resume-metadata', { params });

export const getResumeMetadataFilters = () => api.get('/api/resume-metadata/filters');

export const downloadResumeById = uuid =>
  api.get(`/api/resumes/download/${uuid}`, { responseType: 'blob' });

export const viewResumeById = uuid =>
  api.get(`/api/resumes/view/${uuid}`, { responseType: 'blob' });
