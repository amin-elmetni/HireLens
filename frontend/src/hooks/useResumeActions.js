import { downloadResumeById, viewResumeById } from '@/api/resumeApi';

export const useResumeActions = () => {
  const viewResume = async uuid => {
    try {
      const response = await viewResumeById(uuid);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error('View error:', err);
      alert('You may not have access to view this resume.');
    }
  };

  const downloadResume = async uuid => {
    try {
      const response = await downloadResumeById(uuid);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      const disposition = response.headers['content-disposition'];
      const match = disposition?.match(/filename="(.+)"/);
      const filename = match ? match[1] : 'resume.pdf';

      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return { viewResume, downloadResume };
};
