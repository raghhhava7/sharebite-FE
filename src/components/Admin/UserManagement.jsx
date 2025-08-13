import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await adminService.activateUser(userId);
      fetchUsers(); // Refresh the list
      alert('User activated successfully!');
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Failed to activate user. Please try again.');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await adminService.deactivateUser(userId);
        fetchUsers(); // Refresh the list
        alert('User deactivated successfully!');
      } catch (error) {
        console.error('Error deactivating user:', error);
        alert('Failed to deactivate user. Please try again.');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminService.deleteUser(userId);
        fetchUsers(); // Refresh the list
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="user-management">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner">Loading users...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-management">
        <div className="container">
          <div className="error-container">
            <div className="error-message">{error}</div>
            <button onClick={fetchUsers} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-icon">👥</span>
            User Management
          </h1>
          <p className="page-description">
            Manage all platform users and their permissions
          </p>
        </div>

        <div className="users-stats">
          <div className="stat-card">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(u => u.role === 'DONOR').length}</div>
            <div className="stat-label">Donors</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(u => u.role === 'RECEIVER').length}</div>
            <div className="stat-label">Receivers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(u => u.role === 'VOLUNTEER').length}</div>
            <div className="stat-label">Volunteers</div>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>No users found</h3>
            <p>There are no users in the system yet.</p>
          </div>
        ) : (
          <div className="users-table-container">
            <div className="table-responsive">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td className="username-cell">
                        <div className="user-info">
                          <span className="username">{user.username}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role?.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {user.active ? (
                            <button
                              onClick={() => handleDeactivateUser(user.id)}
                              className="btn btn-warning btn-sm"
                              title="Deactivate User"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateUser(user.id)}
                              className="btn btn-success btn-sm"
                              title="Activate User"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="btn btn-danger btn-sm"
                            title="Delete User"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;