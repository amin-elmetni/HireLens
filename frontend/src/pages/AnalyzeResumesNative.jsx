import Navbar from '@/components/NavBar/NavBar';
import React, { useState, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faFolder,
  faFileAlt,
  faTrash,
  faPlay,
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import aiApi from '@/api/aiIndex';

const AnalyzeResumesNative = () => {
  const [files, setFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState({});
  const [analysisResults, setAnalysisResults] = useState({});
  const [isUploadMode, setIsUploadMode] = useState(true); // true for files, false for folder
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // File validation
  const isValidFile = file => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
  };

  // Handle files (from drop or file input)
  const handleFiles = useCallback(fileList => {
    const files = Array.from(fileList);

    // Filter valid files
    const validFiles = files.filter(isValidFile).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      status: 'ready', // ready, analyzing, completed, error
      progress: 0,
    }));

    // Add to existing files
    setFiles(prevFiles => [...prevFiles, ...validFiles]);

    // Show error for invalid files
    const invalidFiles = files.filter(file => !isValidFile(file));
    if (invalidFiles.length > 0) {
      const errorMessage = invalidFiles
        .map(file => `${file.name}: Invalid file type or size too large (max 10MB)`)
        .join('\n');
      alert(`Some files were rejected:\n${errorMessage}`);
    }
  }, []);

  // Drag and drop handlers
  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!isAnalyzing) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // File input handler
  const handleFileInput = event => {
    handleFiles(event.target.files);
  };

  // Folder upload handler
  const handleFolderUpload = useCallback(
    event => {
      handleFiles(event.target.files);
    },
    [handleFiles]
  );

  // Remove file
  const removeFile = fileId => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };

  // Clear all files
  const clearAllFiles = () => {
    setFiles([]);
    setAnalysisProgress({});
    setAnalysisResults({});
  };

  // Format file size
  const formatFileSize = bytes => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Simulate progress updates (since we don't have real-time progress from the API)
  const simulateProgress = (fileId, totalSteps = 6) => {
    let step = 0;
    const progressSteps = [
      { step: 1, message: 'Uploading file...', progress: 16 },
      { step: 2, message: 'Extracting text...', progress: 33 },
      { step: 3, message: 'Adding personal links...', progress: 50 },
      { step: 4, message: 'Scoring resume...', progress: 66 },
      { step: 5, message: 'Category scoring...', progress: 83 },
      { step: 6, message: 'Post-processing...', progress: 100 },
    ];

    const updateProgress = () => {
      if (step < progressSteps.length) {
        const currentStep = progressSteps[step];
        setAnalysisProgress(prev => ({
          ...prev,
          [fileId]: {
            progress: currentStep.progress,
            message: currentStep.message,
            step: currentStep.step,
          },
        }));
        step++;
        setTimeout(updateProgress, 2000 + Math.random() * 1000); // 2-3 seconds per step
      }
    };

    updateProgress();
  };

  // Analyze resumes
  const analyzeResumes = async () => {
    if (files.length === 0) return;

    setIsAnalyzing(true);

    // Update all files to analyzing status
    setFiles(prevFiles => prevFiles.map(file => ({ ...file, status: 'analyzing' })));

    try {
      // Create FormData for file upload
      const formData = new FormData();
      files.forEach(fileItem => {
        formData.append('files', fileItem.file);
      });

      // Start progress simulation for all files
      files.forEach(fileItem => {
        simulateProgress(fileItem.id);
      });

      // Call the new upload and analyze API endpoint
      const response = await aiApi.post('/upload-and-analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes timeout for large files/batch processing
      });

      // Handle successful response
      if (response.data.pipeline === 'completed') {
        // Mark all files as completed
        setFiles(prevFiles =>
          prevFiles.map(file => ({
            ...file,
            status: 'completed',
            progress: 100,
          }))
        );

        // Store results
        const results = {};
        files.forEach(fileItem => {
          results[fileItem.id] = {
            success: true,
            steps: response.data.steps,
            message: `Analysis completed successfully for ${response.data.files_processed} files`,
            filesProcessed: response.data.files_processed,
          };
        });
        setAnalysisResults(results);

        // Show success notification
        alert(`✅ Successfully analyzed ${response.data.files_processed} resume files!`);
      } else {
        throw new Error(response.data.error || 'Pipeline failed');
      }
    } catch (error) {
      console.error('Analysis failed:', error);

      // Mark all files as error
      setFiles(prevFiles =>
        prevFiles.map(file => ({
          ...file,
          status: 'error',
        }))
      );

      // Store error results
      const errorResults = {};
      files.forEach(fileItem => {
        errorResults[fileItem.id] = {
          success: false,
          error: error.response?.data?.error || error.message,
          message: 'Analysis failed',
          details: error.response?.data?.details,
        };
      });
      setAnalysisResults(errorResults);

      // Show error notification
      const errorMessage = error.response?.data?.error || error.message;
      alert(`❌ Analysis failed: ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Analyze Resumes</h1>
          <p className='text-gray-600'>
            Upload individual files or select a folder to analyze multiple resumes at once
          </p>
        </div>

        {/* Upload Mode Toggle */}
        <div className='mb-6'>
          <div className='flex bg-white rounded-lg border border-gray-200 p-1'>
            <button
              onClick={() => setIsUploadMode(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
                isUploadMode ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
              }`}
            >
              <FontAwesomeIcon icon={faFileAlt} />
              Upload Files
            </button>
            <button
              onClick={() => setIsUploadMode(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
                !isUploadMode ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
              }`}
            >
              <FontAwesomeIcon icon={faFolder} />
              Select Folder
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Upload Area */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                {isUploadMode ? 'Upload Resume Files' : 'Select Folder'}
              </h2>

              {isUploadMode ? (
                // File Drop Zone
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragOver
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                  } ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    accept='.pdf,.docx'
                    onChange={handleFileInput}
                    className='hidden'
                    disabled={isAnalyzing}
                  />
                  <FontAwesomeIcon
                    icon={faUpload}
                    className='text-4xl text-gray-400 mb-4'
                  />
                  <p className='text-lg font-medium text-gray-900 mb-2'>
                    {isDragOver ? 'Drop the files here...' : 'Drag & drop resume files here'}
                  </p>
                  <p className='text-gray-500 mb-4'>or click to select files</p>
                  <p className='text-sm text-gray-400'>
                    Supports PDF and DOCX files up to 10MB each
                  </p>
                </div>
              ) : (
                // Folder Selection
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
                  <FontAwesomeIcon
                    icon={faFolder}
                    className='text-4xl text-gray-400 mb-4'
                  />
                  <p className='text-lg font-medium text-gray-900 mb-2'>
                    Select a folder containing resumes
                  </p>
                  <p className='text-gray-500 mb-4'>
                    All PDF and DOCX files in the folder will be processed
                  </p>
                  <input
                    type='file'
                    webkitdirectory=''
                    directory=''
                    multiple
                    onChange={handleFolderUpload}
                    className='hidden'
                    id='folder-input'
                    disabled={isAnalyzing}
                  />
                  <label
                    htmlFor='folder-input'
                    className={`inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:bg-primary-dark transition-colors ${
                      isAnalyzing ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    Choose Folder
                  </label>
                </div>
              )}

              {/* File List */}
              {files.length > 0 && (
                <div className='mt-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-medium text-gray-900'>
                      Files to Analyze ({files.length})
                    </h3>
                    {!isAnalyzing && (
                      <button
                        onClick={clearAllFiles}
                        className='text-red-600 hover:text-red-700 text-sm font-medium'
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className='mr-1'
                        />
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className='space-y-3 max-h-60 overflow-y-auto'>
                    {files.map(fileItem => (
                      <div
                        key={fileItem.id}
                        className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                      >
                        <div className='flex items-center flex-1 min-w-0'>
                          <FontAwesomeIcon
                            icon={faFileAlt}
                            className='text-primary mr-3 flex-shrink-0'
                          />
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium text-gray-900 truncate'>
                              {fileItem.name}
                            </p>
                            <div className='flex items-center gap-4 mt-1'>
                              <p className='text-xs text-gray-500'>
                                {formatFileSize(fileItem.size)}
                              </p>
                              {analysisProgress[fileItem.id] && (
                                <p className='text-xs text-primary'>
                                  {analysisProgress[fileItem.id].message}
                                </p>
                              )}
                            </div>

                            {/* Progress Bar */}
                            {fileItem.status === 'analyzing' && analysisProgress[fileItem.id] && (
                              <div className='mt-2'>
                                <div className='w-full bg-gray-200 rounded-full h-2'>
                                  <div
                                    className='bg-primary h-2 rounded-full transition-all duration-500'
                                    style={{ width: `${analysisProgress[fileItem.id].progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className='flex items-center gap-2 ml-4'>
                          {/* Status Icon */}
                          {fileItem.status === 'ready' && (
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className='text-gray-400'
                            />
                          )}
                          {fileItem.status === 'analyzing' && (
                            <FontAwesomeIcon
                              icon={faSpinner}
                              className='text-primary animate-spin'
                            />
                          )}
                          {fileItem.status === 'completed' && (
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className='text-green-500'
                            />
                          )}
                          {fileItem.status === 'error' && (
                            <FontAwesomeIcon
                              icon={faExclamationCircle}
                              className='text-red-500'
                            />
                          )}

                          {/* Remove Button */}
                          {!isAnalyzing && (
                            <button
                              onClick={() => removeFile(fileItem.id)}
                              className='text-red-500 hover:text-red-700 p-1'
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Analysis Control Panel */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg border border-gray-200 p-6 sticky top-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>Analysis Control</h2>

              {/* Analysis Button */}
              <button
                onClick={analyzeResumes}
                disabled={files.length === 0 || isAnalyzing}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                  files.length === 0 || isAnalyzing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <FontAwesomeIcon
                  icon={isAnalyzing ? faSpinner : faPlay}
                  className={isAnalyzing ? 'animate-spin' : ''}
                />
                {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
              </button>

              {/* Analysis Info */}
              <div className='mt-6 space-y-3'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>Total Files:</span>
                  <span className='font-medium text-gray-900'>{files.length}</span>
                </div>

                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>Ready:</span>
                  <span className='font-medium text-green-600'>
                    {files.filter(f => f.status === 'ready').length}
                  </span>
                </div>

                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>Analyzing:</span>
                  <span className='font-medium text-primary'>
                    {files.filter(f => f.status === 'analyzing').length}
                  </span>
                </div>

                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>Completed:</span>
                  <span className='font-medium text-green-600'>
                    {files.filter(f => f.status === 'completed').length}
                  </span>
                </div>

                {files.filter(f => f.status === 'error').length > 0 && (
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-600'>Failed:</span>
                    <span className='font-medium text-red-600'>
                      {files.filter(f => f.status === 'error').length}
                    </span>
                  </div>
                )}
              </div>

              {/* Analysis Steps Info */}
              <div className='mt-6 p-4 bg-primary/10 rounded-lg'>
                <h4 className='text-sm font-medium text-primary-dark mb-2'>Analysis Process:</h4>
                <ul className='text-xs text-primary-dark space-y-1'>
                  <li>• File upload and validation</li>
                  <li>• Text extraction and processing</li>
                  <li>• Personal links identification</li>
                  <li>• Resume scoring analysis</li>
                  <li>• Category-based scoring</li>
                  <li>• Post-processing and finalization</li>
                </ul>
              </div>

              {/* Results Summary */}
              {Object.keys(analysisResults).length > 0 && (
                <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>Last Analysis Results:</h4>
                  <div className='text-xs text-gray-600 space-y-1'>
                    {Object.values(analysisResults).map((result, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded ${
                          result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {result.message}
                        {result.error && (
                          <div className='mt-1 text-xs opacity-75'>Error: {result.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeResumesNative;
