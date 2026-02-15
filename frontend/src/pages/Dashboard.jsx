import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import UploadForm from '../components/UploadForm';
import { formatDate, formatDateTime, getStatusBadgeClass, formatStatus } from '../utils/helpers';

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await reportService.getAllReports();
      setReports(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    fetchReports();
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await reportService.updateReportStatus(reportId, newStatus);
      fetchReports();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await reportService.deleteReport(reportId);
      fetchReports();
    } catch (err) {
      setError(err.message || 'Failed to delete report');
    }
  };

  const getStatusActions = (report) => {
    switch (report.status) {
      case 'UPLOADED':
        return (
          <button
            onClick={() => handleStatusChange(report.id, 'PROCESSING')}
            className="btn btn-primary"
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            Start Processing
          </button>
        );
      case 'PROCESSING':
        return (
          <button
            onClick={() => handleStatusChange(report.id, 'COMPLETED')}
            className="btn btn-primary"
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            Mark Complete
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0',
        marginBottom: 32
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#111827' }}>
              My Reports
            </h1>
            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>
              Manage and track your medical reports
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ color: '#6b7280', fontSize: 14 }}>
              {user?.email}
            </span>
            <button
              onClick={() => navigate('/users')}
              className="btn btn-secondary"
              style={{ padding: '8px 16px' }}
            >
              User Management
            </button>
            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{ padding: '8px 16px' }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: '#111827' }}>
              {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
            </h2>
          </div>
          <button
            onClick={() => setShowUploadForm(true)}
            className="btn btn-primary"
          >
            Upload New Report
          </button>
        </div>

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

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto' }}></div>
            <p style={{ color: '#6b7280', marginTop: 16 }}>Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>
              No reports yet. Upload your first report to get started.
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="btn btn-primary"
            >
              Upload Report
            </button>
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Report Date</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <a
                        href={`/reports/${report.id}`}
                        className="link"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/reports/${report.id}`);
                        }}
                      >
                        {report.name}
                      </a>
                    </td>
                    <td>{report.type}</td>
                    <td>{formatDate(report.reportDate)}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(report.status)}`}>
                        {formatStatus(report.status)}
                      </span>
                    </td>
                    <td>{formatDateTime(report.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {getStatusActions(report)}
                        <button
                          onClick={() => navigate(`/reports/${report.id}`)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: 12 }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: 12 }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <UploadForm
          onClose={() => setShowUploadForm(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}

export default Dashboard;
