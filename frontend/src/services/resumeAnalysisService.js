import aiApi from '@/api/aiIndex';

export const resumeAnalysisService = {
  /**
   * Upload files and analyze them
   * @param {FileList|File[]} files - Files to analyze
   * @returns {Promise} Analysis results
   */
  async uploadAndAnalyze(files) {
    const formData = new FormData();

    // Convert FileList to array if needed and append files
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await aiApi.post('/cv-processing/upload-and-analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes timeout
        // Progress tracking could be added here
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        details: error.response?.data?.details || null,
        status: error.response?.status,
      };
    }
  },

  /**
   * Run the full analysis pipeline (without file upload)
   * @returns {Promise} Pipeline results
   */
  async runFullPipeline() {
    try {
      const response = await aiApi.post('/cv-processing/run/full');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        details: error.response?.data?.details || null,
        status: error.response?.status,
      };
    }
  },

  /**
   * Get analysis system status
   * @returns {Promise} System status
   */
  async getAnalysisStatus() {
    try {
      const response = await aiApi.get('/cv-processing/analysis-status');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        status: error.response?.status,
      };
    }
  },

  /**
   * Validate files before upload
   * @param {FileList|File[]} files - Files to validate
   * @returns {Object} Validation results
   */
  validateFiles(files) {
    const fileArray = Array.from(files);
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = [];
    const invalidFiles = [];

    fileArray.forEach(file => {
      const isValidType =
        validTypes.includes(file.type) ||
        file.name.toLowerCase().endsWith('.pdf') ||
        file.name.toLowerCase().endsWith('.docx');
      const isValidSize = file.size <= maxSize;

      if (isValidType && isValidSize) {
        validFiles.push(file);
      } else {
        invalidFiles.push({
          file,
          reasons: [
            !isValidType && 'Invalid file type (only PDF and DOCX allowed)',
            !isValidSize && 'File too large (max 10MB)',
          ].filter(Boolean),
        });
      }
    });

    return {
      validFiles,
      invalidFiles,
      hasValidFiles: validFiles.length > 0,
      hasInvalidFiles: invalidFiles.length > 0,
    };
  },
};

export default resumeAnalysisService;
