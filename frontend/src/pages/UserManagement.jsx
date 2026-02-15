import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { formatDateTime } from '../utils/helpers';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'USER',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      await userService.createUser(formData);
      setShowCreateForm(false);
      setFormData({ email: '', password: '', role: 'USER' });
      fetchUsers();
    } catch (err) {
      setFormError(err.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId, userEmail) => {
    if (userEmail === user?.email) {
      alert('You cannot delete your own account');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user ${userEmail}?`)) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const getRoleBadgeClass = (role) => {
    return role === 'ADMIN' ? 'badge-admin' : 'badge-user';
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
              User Management
            </h1>
            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>
              Create and manage user accounts
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary"
              style={{ padding: '8px 16px' }}
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
              style={{ padding: '8px 16px' }}
            >
              + Create User
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
            <p style={{ color: '#6b7280', marginTop: 16 }}>Loading users...</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem.id}>
                    <td>{userItem.id}</td>
                    <td>{userItem.email}</td>
                    <td>
                      <span className={`status-badge ${getRoleBadgeClass(userItem.role)}`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td>{formatDateTime(userItem.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(userItem.id, userItem.email)}
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: 12 }}
                        disabled={userItem.email === user?.email}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Create User Modal */}
      {showCreateForm && (
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
          <div className="card" style={{ maxWidth: 400, width: '90%' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 600 }}>Create New User</h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setFormError('');
                  setFormData({ email: '', password: '', role: 'USER' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 16,
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
                disabled={isSubmitting}
              >
                Close
              </button>
            </div>

            {formError && (
              <div className="alert alert-error" role="alert" style={{ marginBottom: 16 }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="user@example.com"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  Role *
                </label>
                <select
                  id="role"
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  disabled={isSubmitting}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormError('');
                    setFormData({ email: '', password: '', role: 'USER' });
                  }}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ flex: 1 }}
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
