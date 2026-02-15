import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportService } from '../services/reportService';
import { formatDate, formatDateTime, getStatusBadgeClass, formatStatus } from '../utils/helpers';

function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    fetchReport();
  }, [id]);

  useEffect(() => {
    if (report) {
      setSummary(report.summary || '');
    }
  }, [report]);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const response = await reportService.getReportById(id);
      setReport(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsUpdating(true);
      await reportService.updateReportStatus(id, newStatus, summary);
      fetchReport();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await reportService.deleteReport(id);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete report');
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container" style={{ padding: '48px 20px' }}>
        <div className="alert alert-error">
          {error || 'Report not found'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              Back
            </button>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#111827' }}>
              Report Details
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ padding: '32px 20px' }}>
        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: 24 }}>
            {error}
            <button
              onClick={() => setError(null)}
              style={{ background: 'none', border: 'none', color: 'inherit', float: 'right', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Left Column - Report Details */}
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 24
              }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
                    {report.name}
                  </h2>
                  <p style={{ color: '#6b7280' }}>{report.type}</p>
                </div>
                <span className={`status-badge ${getStatusBadgeClass(report.status)}`}>
                  {formatStatus(report.status)}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <p style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>
                    Report Date
                  </p>
                  <p style={{ fontWeight: 500 }}>{formatDate(report.reportDate)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>
                    Created
                  </p>
                  <p style={{ fontWeight: 500 }}>{formatDateTime(report.createdAt)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>
                    File Path
                  </p>
                  <p style={{ fontWeight: 500, fontSize: 14, wordBreak: 'break-all' }}>
                    {report.filePath}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>
                    Last Updated
                  </p>
                  <p style={{ fontWeight: 500 }}>{formatDateTime(report.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="card">
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                Summary
              </h3>
              {report.status === 'COMPLETED' ? (
                report.summary ? (
                  <p style={{ color: '#374151', lineHeight: 1.6 }}>
                    {report.summary}
                  </p>
                ) : (
                  <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                    No summary available.
                  </p>
                )
              ) : (
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                  Summary will be available once processing is complete.
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Actions */}
          <div>
            <div className="card">
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                Actions
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {report.status === 'UPLOADED' && (
                  <button
                    onClick={() => handleStatusUpdate('PROCESSING')}
                    className="btn btn-primary"
                    disabled={isUpdating}
                    style={{ width: '100%' }}
                  >
                    {isUpdating ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <div className="spinner"></div>
                        Updating...
                      </span>
                    ) : (
                      'Start Processing'
                    )}
                  </button>
                )}

                {report.status === 'PROCESSING' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate('COMPLETED')}
                      className="btn btn-primary"
                      disabled={isUpdating}
                      style={{ width: '100%' }}
                    >
                      {isUpdating ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <div className="spinner"></div>
                          Updating...
                        </span>
                      ) : (
                        'Mark Complete'
                      )}
                    </button>
                    <textarea
                      className="form-textarea"
                      placeholder="Add summary..."
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      disabled={isUpdating}
                      rows={4}
                    />
                  </>
                )}

                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                  style={{ width: '100%' }}
                >
                  Delete Report
                </button>
              </div>
            </div>

            {/* Status Workflow */}
            <div className="card" style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                Status Workflow
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: 4,
                  backgroundColor: report.status === 'UPLOADED' ? '#dbeafe' : 'transparent'
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: report.status === 'UPLOADED' ? '#2563eb' : '#d1d5db',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    1
                  </div>
                  <span style={{
                    fontWeight: report.status === 'UPLOADED' ? 500 : 400,
                    color: report.status === 'UPLOADED' ? '#1e40af' : '#6b7280'
                  }}>
                    Uploaded
                  </span>
                </div>
                <div style={{ height: 16, borderLeft: '2px dashed #d1d5db', marginLeft: 12 }}></div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: 4,
                  backgroundColor: report.status === 'PROCESSING' ? '#fef3c7' : 'transparent'
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: report.status === 'PROCESSING' ? '#f59e0b' : '#d1d5db',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    2
                  </div>
                  <span style={{
                    fontWeight: report.status === 'PROCESSING' ? 500 : 400,
                    color: report.status === 'PROCESSING' ? '#92400e' : '#6b7280'
                  }}>
                    Processing
                  </span>
                </div>
                <div style={{ height: 16, borderLeft: '2px dashed #d1d5db', marginLeft: 12 }}></div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: 4,
                  backgroundColor: report.status === 'COMPLETED' ? '#d1fae5' : 'transparent'
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: report.status === 'COMPLETED' ? '#059669' : '#d1d5db',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    3
                  </div>
                  <span style={{
                    fontWeight: report.status === 'COMPLETED' ? 500 : 400,
                    color: report.status === 'COMPLETED' ? '#065f46' : '#6b7280'
                  }}>
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReportDetails;
