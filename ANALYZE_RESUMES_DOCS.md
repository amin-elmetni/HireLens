# Analyze Resumes Feature Documentation

## Overview

The Analyze Resumes page allows users to upload and analyze resume files (PDF and DOCX) through an intuitive drag-and-drop interface. The system processes the resumes through a comprehensive analysis pipeline and provides detailed feedback on the analysis progress.

## Features

### File Upload

- **Drag and Drop**: Users can drag files directly onto the upload area
- **File Selection**: Click to browse and select files
- **Folder Selection**: Upload entire folders containing resume files
- **File Validation**: Automatic validation of file types and sizes
- **Duplicate Detection**: System prevents processing of already-analyzed files

### Supported File Types

- PDF files (.pdf)
- Microsoft Word documents (.docx)
- Maximum file size: 10MB per file

### Analysis Pipeline

The system runs a comprehensive 6-step analysis pipeline:

1. **File Upload and Validation**: Secure file upload and content validation
2. **Text Extraction**: Extract text content from PDF/DOCX files
3. **Personal Links Identification**: Identify and categorize personal links
4. **Resume Scoring**: Comprehensive scoring based on multiple criteria
5. **Category Scoring**: Industry and skill category analysis
6. **Post-processing**: Final data processing and optimization

### User Interface Components

#### Upload Area

- **Toggle Between Modes**: Switch between file upload and folder selection
- **Visual Feedback**: Color-coded drag-and-drop area with hover effects
- **Progress Indicators**: Real-time progress bars during analysis
- **File List**: Visual list of uploaded files with status indicators

#### Analysis Control Panel

- **Start Analysis Button**: Initiate the analysis process
- **File Statistics**: Real-time counts of files by status
- **Process Information**: Detailed breakdown of analysis steps
- **Results Summary**: Display of analysis results and errors

#### Status Indicators

- 🔵 Ready: File uploaded and ready for analysis
- 🔄 Analyzing: File currently being processed
- ✅ Completed: Analysis finished successfully
- ❌ Error: Analysis failed with error details

## Technical Architecture

### Frontend (`AnalyzeResumes.jsx`)

- React functional component with hooks
- State management for files, progress, and results
- Drag-and-drop implementation (with fallback)
- Service integration for API calls
- Responsive design with Tailwind CSS

### Backend API (`cv_processing.py`)

- FastAPI endpoint for file upload and processing
- Temporary file handling with automatic cleanup
- Jupyter notebook execution pipeline
- Comprehensive error handling and logging
- File validation and security measures

### Service Layer (`resumeAnalysisService.js`)

- Centralized API communication
- File validation utilities
- Error handling and response parsing
- Progress tracking capabilities

## API Endpoints

### POST `/upload-and-analyze`

Upload files and run the complete analysis pipeline.

**Request:**

- Content-Type: `multipart/form-data`
- Body: File uploads

**Response:**

```json
{
  "pipeline": "completed",
  "steps": [...],
  "uploaded_files": ["file1.pdf", "file2.docx"],
  "files_processed": 2,
  "message": "Successfully processed 2 files"
}
```

### GET `/analysis-status`

Get the current status of the analysis system.

**Response:**

```json
{
  "status": "ready",
  "available_notebooks": [...],
  "system_info": {...}
}
```

## File Processing Workflow

1. **Upload**: Files are uploaded to a temporary directory
2. **Validation**: File types and sizes are validated
3. **Environment Setup**: Notebook environment variables are configured
4. **Pipeline Execution**: Sequential execution of analysis notebooks
5. **Results Collection**: Gather and format analysis results
6. **Cleanup**: Temporary files are cleaned up (optional in development)

## Error Handling

### Client-Side Errors

- Invalid file types
- File size exceeded
- Network connection issues
- Service unavailability

### Server-Side Errors

- File processing failures
- Notebook execution errors
- Database connection issues
- Resource limitations

## Security Measures

- File type validation (whitelist approach)
- File size limits
- Temporary file sandboxing
- Automatic cleanup of uploaded files
- Content-type verification

## Performance Considerations

- Asynchronous file processing
- Progress tracking and user feedback
- Timeout handling for large files
- Memory management for batch uploads
- Efficient temporary file handling

## Usage Examples

### Single File Upload

1. Navigate to Analyze Resumes page
2. Drag a PDF or DOCX file to the upload area
3. File appears in the file list with "Ready" status
4. Click "Start Analysis" button
5. Monitor progress through the pipeline steps
6. Review results in the control panel

### Folder Upload

1. Switch to "Select Folder" mode
2. Click "Choose Folder" button
3. Select a folder containing resume files
4. All valid files are added to the processing queue
5. Start analysis for batch processing

### Error Recovery

- Invalid files are automatically rejected with clear error messages
- Failed analyses show detailed error information
- Users can retry failed files or remove them from the queue
- System maintains state during navigation

## Future Enhancements

- Real-time progress updates via WebSocket
- File preview capabilities
- Batch analysis scheduling
- Advanced filtering and sorting options
- Export analysis results
- Integration with notification system
- Resume comparison features
