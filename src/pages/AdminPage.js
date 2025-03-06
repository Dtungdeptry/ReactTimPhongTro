import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminPage.css';

const API_BASE_URL = 'http://localhost:8080';

const AdminPage = () => {
  // States for different data types
  const [allPosts, setAllPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [rejectedPosts, setRejectedPosts] = useState([]);
  const [owners, setOwners] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [ownerPosts, setOwnerPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [activePostsTab, setActivePostsTab] = useState('all');

  // Token management (assuming JWT is stored in localStorage)
  const getAuthHeader = () => {
    const token = localStorage.getItem('jwtToken');
    return { Authorization: `Bearer ${token}` };
  };
  const statusMapping = {
    pending: "Đang Chờ",
    approved: "Đã Duyệt",
    rejected: "Bị Từ Chối"
  };

  // Fetch all posts
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/post`, {
        headers: getAuthHeader()
      });
      setAllPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch posts');
      setLoading(false);
    }
  };

  // Fetch pending posts
  const fetchPendingPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/post/status/pending`, {
        headers: getAuthHeader()
      });
      setPendingPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch pending posts');
      setLoading(false);
    }
  };

  // Fetch approved posts
  const fetchApprovedPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/post/status/approved`, {
        headers: getAuthHeader()
      });
      setApprovedPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch approved posts');
      setLoading(false);
    }
  };

  // Fetch rejected posts
  const fetchRejectedPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/post/status/rejected`, {
        headers: getAuthHeader()
      });
      setRejectedPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch rejected posts');
      setLoading(false);
    }
  };

  // Fetch owners
  const fetchOwners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/owners`, {
        headers: getAuthHeader()
      });
      setOwners(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch owners');
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: getAuthHeader()
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  // Search owners
  const searchOwners = async () => {
    if (!searchKeyword.trim()) {
      fetchOwners();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/owners/search?keyword=${searchKeyword}`, {
        headers: getAuthHeader()
      });
      setOwners(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to search owners');
      setLoading(false);
    }
  };

  // Search users
  const searchUsers = async () => {
    if (!searchKeyword.trim()) {
      fetchUsers();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/users/search?keyword=${searchKeyword}`, {
        headers: getAuthHeader()
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to search users');
      setLoading(false);
    }
  };

  // Delete approved post
  const deleteApprovedPost = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài đăng này?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/admin/post/status/approved/${id}`, {
        headers: getAuthHeader()
      });
      fetchApprovedPosts();
      setLoading(false);
    } catch (err) {
      setError('Failed to delete post');
      setLoading(false);
    }
  };

  // Delete owner
  const deleteOwner = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tài khoản này?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/admin/owners/${id}`, {
        headers: getAuthHeader()
      });
      fetchOwners();
      setLoading(false);
    } catch (err) {
      setError('Failed to delete owner');
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tài khoản này?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
        headers: getAuthHeader()
      });
      fetchUsers();
      setLoading(false);
    } catch (err) {
      setError('Failed to delete user');
      setLoading(false);
    }
  };

  // View owner posts
  const viewOwnerPosts = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/posts/${userId}`, {
        headers: getAuthHeader()
      });
      setOwnerPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch owner posts');
      setLoading(false);
    }
  };

  // Delete owner's post
  const deleteOwnerPost = async (userId, postId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài đăng này?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/admin/posts/${userId}/${postId}`, {
        headers: getAuthHeader()
      });
      viewOwnerPosts(userId);
      setLoading(false);
    } catch (err) {
      setError('Failed to delete post');
      setLoading(false);
    }
  };

  // Promote user to owner
  const promoteUserToOwner = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn nâng cấp người dùng này?')) return;
    
    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/admin/users/${userId}`, 
        { role: 3 }, // 3 is owner role
        { headers: getAuthHeader() }
      );
      fetchUsers();
      setLoading(false);
    } catch (err) {
      setError('Failed to update user role');
      setLoading(false);
    }
  };

  // Get user details
  const getUserDetails = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: getAuthHeader()
      });
      setSelectedUser(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user details');
      setLoading(false);
    }
  };

  // Get owner details
  const getOwnerDetails = async (ownerId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/owners/${ownerId}`, {
        headers: getAuthHeader()
      });
      setSelectedOwner(response.data);
      // Also fetch their posts
      viewOwnerPosts(ownerId);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch owner details');
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchAllPosts();
    fetchPendingPosts();
    fetchApprovedPosts();
    fetchRejectedPosts();
    fetchOwners();
    fetchUsers();
  }, []);

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="tab-content">
            <div className="posts-tab-header">
              <button 
                className={`tab-btn ${activePostsTab === 'all' ? 'active' : ''}`}
                onClick={() => setActivePostsTab('all')}
              >
                Tất Cả
              </button>
              <button 
                className={`tab-btn ${activePostsTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActivePostsTab('pending')}
              >
                Đang Chờ Duyệt
              </button>
              <button 
                className={`tab-btn ${activePostsTab === 'approved' ? 'active' : ''}`}
                onClick={() => setActivePostsTab('approved')}
              >
                Đã Được Duyệt
              </button>
              <button 
                className={`tab-btn ${activePostsTab === 'rejected' ? 'active' : ''}`}
                onClick={() => setActivePostsTab('rejected')}
              >
                Đã Bị Từ Chối
              </button>
            </div>

            {activePostsTab === 'all' && (
              <div>
                <h2>Tất Cả Bài Đăng</h2>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tiêu Đề</th>
                      <th>Người Đăng</th>
                      <th>Trạng Thái</th>
                      <th>Ngày Đăng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPosts.map(post => (
                      <tr key={post.id}>
                        <td>{post.id}</td>
                        <td>{post.title}</td>
                        <td>
  {users.find(user => Number(post.userId) === Number(user.id))?.fullName || "Không xác định"}
</td>

                        <td>{statusMapping[post.status] || post.status}</td>
                        <td>{new Date(post.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activePostsTab === 'pending' && (
              <div>
                <h2>Bài Đăng Đang Chờ Duyệt</h2>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tiêu Đề</th>
                      <th>Người Đăng</th>
                      <th>Ngày Đăng</th>
                      <th>Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPosts.map(post => (
                      <tr key={post.id}>
                        <td>{post.id}</td>
                        <td>{post.title}</td>
                        <td>
  {users.find(user => Number(user.id) === Number(post.userId))?.username || "Không xác định"}
</td>

                        <td>{new Date(post.created_at).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-primary">Xem Chi Tiết</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activePostsTab === 'approved' && (
              <div>
                <h2>Bài Đăng Đã Được Duyệt</h2>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tiêu Đề</th>
                      <th>Người Đăng</th>
                      <th>Ngày Đăng</th>
                      <th>Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedPosts.map(post => (
                      <tr key={post.id}>
                        <td>{post.id}</td>
                        <td>{post.title}</td>
                        <td>
  {users.find(user => Number(user.id) === Number(post.userId))?.username || "Không xác định"}
</td>

                        <td>{new Date(post.createDate).toLocaleDateString()}</td>
                        <td>
                          <button 
                            className="btn btn-danger"
                            onClick={() => deleteApprovedPost(post.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activePostsTab === 'rejected' && (
              <div>
                <h2>Bài Đăng Đã Bị Từ Chối</h2>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tiêu Đề</th>
                      <th>Người Đăng</th>
                      <th>Ngày Đăng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rejectedPosts.map(post => (
                      <tr key={post.id}>
                        <td>{post.id}</td>
                        <td>{post.title}</td>
                        <td>
  {users.find(user => Number(user.id) === Number(post.userId))?.username || "Không xác định"}
</td>

                        <td>{new Date(post.createDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'owners':
        return (
          <div className="tab-content">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Tìm kiếm tài khoản đăng bài..."
                value={searchKeyword} 
                onChange={e => setSearchKeyword(e.target.value)} 
              />
              <button onClick={searchOwners}>Tìm Kiếm</button>
            </div>

            <div className="owners-container">
              <div className="owners-list">
                <h2>Danh Sách Tài Khoản Đăng Bài</h2>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Họ Tên</th>
                      <th>Email</th>
                      <th>Điện Thoại</th>
                      <th>Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {owners.map(owner => (
                      <tr key={owner.id}>
                        <td>{owner.id}</td>
                        <td>{owner.fullName}</td>
                        <td>{owner.email}</td>
                        <td>{owner.phone}</td>
                        <td>
                          <button 
                            className="btn btn-info"
                            onClick={() => getOwnerDetails(owner.id)}
                          >
                            Xem Chi Tiết
                          </button>
                          <button 
                            className="btn btn-danger"
                            onClick={() => deleteOwner(owner.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedOwner && (
                <div className="owner-details">
                  <h2>Chi Tiết Tài Khoản</h2>
                  <div className="user-info">
                    <p><strong>ID:</strong> {selectedOwner.id}</p>
                    <p><strong>Họ Tên:</strong> {selectedOwner.fullName}</p>
                    <p><strong>Email:</strong> {selectedOwner.email}</p>
                    <p><strong>Điện Thoại:</strong> {selectedOwner.phone}</p>
                  </div>

                  <h3>Bài Đăng Của Tài Khoản</h3>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tiêu Đề</th>
                        <th>Trạng Thái</th>
                        <th>Ngày Đăng</th>
                        <th>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ownerPosts.map(post => (
                        <tr key={post.id}>
                          <td>{post.id}</td>
                          <td>{post.title}</td>
                          <td>{statusMapping[post.status] || post.status}</td>
                          <td>{new Date(post.createDate).toLocaleDateString()}</td>
                          <td>
                            <button 
                              className="btn btn-danger"
                              onClick={() => deleteOwnerPost(selectedOwner.id, post.id)}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="tab-content">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Tìm kiếm người dùng..."
                value={searchKeyword} 
                onChange={e => setSearchKeyword(e.target.value)} 
              />
              <button onClick={searchUsers}>Tìm Kiếm</button>
            </div>

            <div className="users-container">
              <div className="users-list">
                <h2>Danh Sách Người Dùng</h2>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Họ Tên</th>
                      <th>Email</th>
                      <th>Điện Thoại</th>
                      <th>Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <button 
                            className="btn btn-info"
                            onClick={() => getUserDetails(user.id)}
                          >
                            Xem Chi Tiết
                          </button>
                          <button 
                            className="btn btn-primary"
                            onClick={() => promoteUserToOwner(user.id)}
                          >
                            Nâng Cấp
                          </button>
                          <button 
                            className="btn btn-danger"
                            onClick={() => deleteUser(user.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedUser && (
                <div className="user-details">
                  <h2>Chi Tiết Người Dùng</h2>
                  <div className="user-info">
                    <p><strong>ID:</strong> {selectedUser.id}</p>
                    <p><strong>Họ Tên:</strong> {selectedUser.fullName}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Điện Thoại:</strong> {selectedUser.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <div className="main-tabs">
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`} 
          onClick={() => setActiveTab('posts')}
        >
          Bài Đăng
        </button>
        <button 
          className={`tab-btn ${activeTab === 'owners' ? 'active' : ''}`} 
          onClick={() => setActiveTab('owners')}
        >
          Tài Khoản Đăng Bài
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} 
          onClick={() => setActiveTab('users')}
        >
          Tài Khoản Người Dùng
        </button>
      </div>

      {renderTabContent()}
    </div>
  );
};

export default AdminPage;