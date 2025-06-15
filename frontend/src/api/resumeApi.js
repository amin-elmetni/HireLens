import api from './index';

const RESUME_BASE = '/api/resumes';
const RESUME_METADATA_BASE = '/api/resume-metadata';

export const getResumeById = id => api.get(`${RESUME_BASE}/${id}`);

export const getResumeByUuid = uuid => api.get(`${RESUME_BASE}/uuid/${uuid}`);

export const getFilteredResumes = params => api.get(RESUME_METADATA_BASE, { params });

export const getResumeMetadataFilters = () => api.get(`${RESUME_METADATA_BASE}/filters`);

export const downloadResumeById = uuid =>
  api.get(`${RESUME_BASE}/download/${uuid}`, { responseType: 'blob' });

export const viewResumeById = uuid =>
  api.get(`${RESUME_BASE}/view/${uuid}`, { responseType: 'blob' });
