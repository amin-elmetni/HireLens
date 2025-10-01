// import Navbar from '@/components/NavBar/NavBar';
// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faUpload,
//   faFolder,
//   faFileAlt,
//   faPlay,
//   faSpinner,
//   faCheckCircle,
//   faInfo,
// } from '@fortawesome/free-solid-svg-icons';

// const AnalyzeResumesDemo = () => {
//   const [isDemoMode, setIsDemoMode] = useState(true);
//   const [isSimulating, setIsSimulating] = useState(false);

//   const demoFiles = [
//     { id: '1', name: 'john_doe_resume.pdf', size: 245760, status: 'ready' },
//     { id: '2', name: 'jane_smith_cv.docx', size: 389120, status: 'ready' },
//     { id: '3', name: 'software_engineer_resume.pdf', size: 512000, status: 'ready' },
//   ];

//   const [files, setFiles] = useState(demoFiles);

//   const formatFileSize = bytes => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const simulateAnalysis = () => {
//     setIsSimulating(true);

//     // Simulate progress through different stages
//     const stages = ['analyzing', 'analyzing', 'completed'];
//     let stageIndex = 0;

//     const updateStage = () => {
//       if (stageIndex < stages.length) {
//         setFiles(prevFiles => prevFiles.map(file => ({ ...file, status: stages[stageIndex] })));
//         stageIndex++;

//         if (stageIndex < stages.length) {
//           setTimeout(updateStage, 2000);
//         } else {
//           setIsSimulating(false);
//         }
//       }
//     };

//     updateStage();
//   };

//   const resetDemo = () => {
//     setFiles(demoFiles.map(file => ({ ...file, status: 'ready' })));
//     setIsSimulating(false);
//   };

//   return (
//     <div className='min-h-screen bg-gray-50'>
//       <Navbar />

//       <div className='container mx-auto px-4 py-8'>
//         {/* Header with Demo Notice */}
//         <div className='mb-8'>
//           <div className='bg-blue-100 border border-blue-400 rounded-lg p-4 mb-6'>
//             <div className='flex items-center'>
//               <FontAwesomeIcon
//                 icon={faInfo}
//                 className='text-blue-600 mr-2'
//               />
//               <div>
//                 <h3 className='text-blue-800 font-semibold'>Demo Mode</h3>
//                 <p className='text-blue-700 text-sm'>
//                   This is a demonstration of the Analyze Resumes feature. The actual backend is not
//                   connected.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <h1 className='text-3xl font-bold text-gray-900 mb-2'>Analyze Resumes - Demo</h1>
//           <p className='text-gray-600'>Experience the resume analysis workflow with sample data</p>
//         </div>

//         <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
//           {/* Upload Area Demo */}
//           <div className='lg:col-span-2'>
//             <div className='bg-white rounded-lg border border-gray-200 p-6'>
//               <h2 className='text-xl font-semibold text-gray-900 mb-4'>Sample Resume Files</h2>

//               {/* Simulated Drop Zone */}
//               <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50'>
//                 <FontAwesomeIcon
//                   icon={faUpload}
//                   className='text-4xl text-gray-400 mb-4'
//                 />
//                 <p className='text-lg font-medium text-gray-900 mb-2'>Demo Upload Area</p>
//                 <p className='text-gray-500 mb-4'>
//                   In the real version, you can drag & drop files here
//                 </p>
//                 <p className='text-sm text-gray-400'>Supports PDF and DOCX files up to 10MB each</p>
//               </div>

//               {/* Demo File List */}
//               <div className='mt-6'>
//                 <div className='flex items-center justify-between mb-4'>
//                   <h3 className='text-lg font-medium text-gray-900'>
//                     Sample Files ({files.length})
//                   </h3>
//                   <button
//                     onClick={resetDemo}
//                     className='text-blue-600 hover:text-blue-700 text-sm font-medium'
//                   >
//                     Reset Demo
//                   </button>
//                 </div>

//                 <div className='space-y-3'>
//                   {files.map(file => (
//                     <div
//                       key={file.id}
//                       className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
//                     >
//                       <div className='flex items-center flex-1 min-w-0'>
//                         <FontAwesomeIcon
//                           icon={faFileAlt}
//                           className='text-blue-500 mr-3 flex-shrink-0'
//                         />
//                         <div className='flex-1 min-w-0'>
//                           <p className='text-sm font-medium text-gray-900 truncate'>{file.name}</p>
//                           <div className='flex items-center gap-4 mt-1'>
//                             <p className='text-xs text-gray-500'>{formatFileSize(file.size)}</p>
//                             {file.status === 'analyzing' && (
//                               <p className='text-xs text-blue-600'>Processing resume...</p>
//                             )}
//                             {file.status === 'completed' && (
//                               <p className='text-xs text-green-600'>Analysis completed</p>
//                             )}
//                           </div>

//                           {/* Progress Bar for Demo */}
//                           {file.status === 'analyzing' && (
//                             <div className='mt-2'>
//                               <div className='w-full bg-gray-200 rounded-full h-2'>
//                                 <div
//                                   className='bg-blue-600 h-2 rounded-full animate-pulse'
//                                   style={{ width: '60%' }}
//                                 />
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className='flex items-center gap-2 ml-4'>
//                         {file.status === 'ready' && (
//                           <FontAwesomeIcon
//                             icon={faCheckCircle}
//                             className='text-gray-400'
//                           />
//                         )}
//                         {file.status === 'analyzing' && (
//                           <FontAwesomeIcon
//                             icon={faSpinner}
//                             className='text-blue-500 animate-spin'
//                           />
//                         )}
//                         {file.status === 'completed' && (
//                           <FontAwesomeIcon
//                             icon={faCheckCircle}
//                             className='text-green-500'
//                           />
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Analysis Control Panel */}
//           <div className='lg:col-span-1'>
//             <div className='bg-white rounded-lg border border-gray-200 p-6 sticky top-6'>
//               <h2 className='text-xl font-semibold text-gray-900 mb-4'>Demo Controls</h2>

//               {/* Demo Analysis Button */}
//               <button
//                 onClick={simulateAnalysis}
//                 disabled={isSimulating || files.every(f => f.status === 'completed')}
//                 className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
//                   isSimulating || files.every(f => f.status === 'completed')
//                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                     : 'bg-green-500 text-white hover:bg-green-600'
//                 }`}
//               >
//                 <FontAwesomeIcon
//                   icon={isSimulating ? faSpinner : faPlay}
//                   className={isSimulating ? 'animate-spin' : ''}
//                 />
//                 {isSimulating ? 'Analyzing...' : 'Start Demo Analysis'}
//               </button>

//               {/* File Statistics */}
//               <div className='mt-6 space-y-3'>
//                 <div className='flex items-center justify-between text-sm'>
//                   <span className='text-gray-600'>Total Files:</span>
//                   <span className='font-medium text-gray-900'>{files.length}</span>
//                 </div>

//                 <div className='flex items-center justify-between text-sm'>
//                   <span className='text-gray-600'>Ready:</span>
//                   <span className='font-medium text-green-600'>
//                     {files.filter(f => f.status === 'ready').length}
//                   </span>
//                 </div>

//                 <div className='flex items-center justify-between text-sm'>
//                   <span className='text-gray-600'>Analyzing:</span>
//                   <span className='font-medium text-blue-600'>
//                     {files.filter(f => f.status === 'analyzing').length}
//                   </span>
//                 </div>

//                 <div className='flex items-center justify-between text-sm'>
//                   <span className='text-gray-600'>Completed:</span>
//                   <span className='font-medium text-green-600'>
//                     {files.filter(f => f.status === 'completed').length}
//                   </span>
//                 </div>
//               </div>

//               {/* Analysis Steps Info */}
//               <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
//                 <h4 className='text-sm font-medium text-blue-900 mb-2'>Analysis Pipeline:</h4>
//                 <ul className='text-xs text-blue-800 space-y-1'>
//                   <li>• File upload and validation</li>
//                   <li>• Text extraction and processing</li>
//                   <li>• Personal links identification</li>
//                   <li>• Resume scoring analysis</li>
//                   <li>• Category-based scoring</li>
//                   <li>• Post-processing and finalization</li>
//                 </ul>
//               </div>

//               {/* Demo Information */}
//               <div className='mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
//                 <h4 className='text-sm font-medium text-yellow-800 mb-2'>Demo Features:</h4>
//                 <ul className='text-xs text-yellow-700 space-y-1'>
//                   <li>• Simulated file processing</li>
//                   <li>• Progress visualization</li>
//                   <li>• Status tracking</li>
//                   <li>• UI/UX demonstration</li>
//                 </ul>
//               </div>

//               {/* Real Implementation Note */}
//               <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
//                 <h4 className='text-sm font-medium text-green-800 mb-2'>Real Implementation:</h4>
//                 <p className='text-xs text-green-700'>
//                   The actual feature includes drag & drop upload, file validation, backend
//                   processing via FastAPI, and comprehensive error handling.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalyzeResumesDemo;
