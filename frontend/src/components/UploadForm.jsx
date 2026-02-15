import { useState, useRef } from 'react';
import { reportService } from '../services/reportService';

function UploadForm({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('type', type);
    formData.append('reportDate', reportDate);

    setIsLoading(true);
    try {
      await reportService.createReport(formData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to upload report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-fill name if empty
      if (!name) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
        setName(fileName);
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ maxWidth: 500, width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>Upload Report</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 16,
              cursor: 'pointer',
              color: '#6b7280'
            }}
            disabled={isLoading}
          >
            Close
          </button>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="file" className="form-label">
              Report File *
            </label>
            <input
              ref={fileInputRef}
              id="file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
              disabled={isLoading}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 4,
                fontSize: 14
              }}
            />
            {file && (
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Report Name *
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Blood Test Report"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="type" className="form-label">
              Report Type *
            </label>
            <select
              id="type"
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="">Select type</option>
              <option value="LAB_REPORT">Lab Report</option>
              <option value="IMAGING">Imaging (X-Ray, MRI, CT)</option>
              <option value="PATHOLOGY">Pathology Report</option>
              <option value="PRESCRIPTION">Prescription</option>
              <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reportDate" className="form-label">
              Report Date *
            </label>
            <input
              id="reportDate"
              type="date"
              className="form-input"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
              disabled={isLoading}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <div className="spinner"></div>
                  Uploading...
                </span>
              ) : (
                'Upload Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadForm;
