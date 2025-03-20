import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/User/UserPage.css';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [searchCriteria, setSearchCriteria] = useState({
    priceRange: '',
    roomType: '',
    location: '',
    area: ''
  });
  const navigate = useNavigate();
  
  // Form options from API
  const [priceRanges, setPriceRanges] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [areas, setAreas] = useState([]);
  const handleViewDetails = (post) => {
    navigate(`/post/${post.id}`);
  };  

  useEffect(() => {
    fetchUserData();
    fetchApprovedPosts();
    fetchFilterOptions();
    fetch5LatestPost();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/user/${userId}`);
      setUser(response.data);
      // Initialize form with user data
      setUserForm({
        username: response.data.username || '',
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || ''
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetch5LatestPost = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/post/latest");
      console.log(response.data);
      setPosts(response.data); // Lưu vào state mà không cần slice nữa
      setLoading(false); // Đã tải xong dữ liệu
    } catch (error) {
      console.error('Error fetching Latest posts:', error);
      setError('Có lỗi xảy ra khi tải bài đăng'); // Cập nhật thông báo lỗi
      setLoading(false); // Đã tải xong dữ liệu dù có lỗi
    }
  };  

  const fetchApprovedPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/post/status/approved");
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching approved posts:', error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      // Fetch price ranges
      const priceRangesResponse = await axios.get("http://localhost:8080/user/post/price-ranges");
      setPriceRanges(priceRangesResponse.data);
      
      // Fetch room types
      const roomTypesResponse = await axios.get("http://localhost:8080/user/post/room-types");
      setRoomTypes(roomTypesResponse.data);
      
      // Fetch locations
      const locationsResponse = await axios.get("http://localhost:8080/user/post/locations");
      setLocations(locationsResponse.data);
      
      // Fetch areas
      const areasResponse = await axios.get("http://localhost:8080/user/post/areas");
      setAreas(areasResponse.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleSearchCriteriaChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };
  
  const fetchFilteredPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/search", {
        params: {
          priceRange: searchCriteria.priceRange || '',
          roomType: searchCriteria.roomType || '',
          location: searchCriteria.location || '',
          area: searchCriteria.area || '',
          status: 'APPROVED',
        },
      });
      setPosts(response.data); 
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
    }
  };
  
  const handleLogout = () => {
    alert("Đăng xuất thành công!");
    navigate("/login");
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updatedUserData = {
        ...user,
        username: userForm.username,
        fullName: userForm.fullName,
        email: userForm.email,
        phone: userForm.phone,
        address: userForm.address
      };
      
      const response = await axios.put(`http://localhost:8080/user/${userId}`, updatedUserData);
      setUser(response.data);
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };

  const handleAccount = () => {
    window.location.href = "/account-user";
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      // Build query params
      const params = new URLSearchParams();
      if (searchCriteria.priceRange) params.append('priceRange', searchCriteria.priceRange);
      if (searchCriteria.roomType) params.append('roomType', searchCriteria.roomType);
      if (searchCriteria.location) params.append('location', searchCriteria.location);
      if (searchCriteria.area) params.append('area', searchCriteria.area);
      
      const response = await axios.get(`http://localhost:8080/user/search?${params.toString()}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="user-page">
      <div className="user-header">
      <a href="/user" className="logo">
          <img src="/src/public/img/logo.jpg" alt="Logo"></img>
          <h1>Nhà Hà Nội</h1>
      </a>
        <div className="user-actions">
          <button className="notification-btn">🔔 Thông báo</button>
          <button className="account-btn" onClick={handleAccount}>👤 Tài khoản</button>
          <button className="logout-button" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </div>
      
      <div className="user-content">
        <div className="left-content">
        <div className="search-section">
          <h2>Tìm kiếm phòng trọ</h2>
          <form className="search-form" onSubmit={handleSearch}>
            <h3>Bộ Lọc</h3>
            <div className="search-filters">
              <div className="filter-group">
                <label>Khoảng giá</label>
                <select
                  name="priceRange"
                  value={searchCriteria.priceRange}
                  onChange={handleSearchCriteriaChange}
                >
                  <option value="">Tất cả</option>
                  {priceRanges.map(range => (
                    <option key={range.id} value={range.rangeName}>{range.rangeName}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Loại phòng</label>
                <select
                  name="roomType"
                  value={searchCriteria.roomType}
                  onChange={handleSearchCriteriaChange}
                >
                  <option value="">Tất cả</option>
                  {roomTypes.map(type => (
                    <option key={type.id} value={type.typeName}>{type.typeName}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Khu vực</label>
                <select
                  name="location"
                  value={searchCriteria.location}
                  onChange={handleSearchCriteriaChange}
                >
                  <option value="">Tất cả</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.address}>{location.address}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Diện tích</label>
                <select
                  name="area"
                  value={searchCriteria.area}
                  onChange={handleSearchCriteriaChange}
                >
                  <option value="">Tất cả</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.size}>{area.size} m²</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button type="submit" className="search-button" onClick={fetchFilteredPosts}>Tìm kiếm</button>
          </form>
        </div>
        
        <div className="posts-section">
          <h2>Thông tin nhà đang cho thuê</h2>
          {posts.length === 0 ? (
            <p className="no-posts">Không có phòng trọ nào phù hợp.</p>
          ) : (
            <div className="posts-grid">
                {posts.map(post => (
                    <div className="post-card" key={post.id}>
                    <div className="post-image">
                        <img src={post.imageUrl || '/placeholder-room.jpg'} alt={post.title} />
                    </div>
                    <div className="post-info">
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-price"><strong>Giá: </strong>{post.priceRange?.rangeName || "Chưa cập nhật"}</p>
                        <div className="post-details">
                        <p><strong>Địa chỉ: </strong><i className="icon location-icon"></i>{post.location?.address || "Không xác định"}</p>
                        <p><strong>Diện tích: </strong><i className="icon area-icon"></i>{post.area?.size ? `${post.area.size} m²` : "Chưa rõ"}</p>
                        <p><strong>Loại phòng: </strong><i className="icon type-icon"></i>{post.roomType?.typeName || "Không xác định"}</p>
                        </div>
                        <p className="post-date"><strong>Đăng ngày: </strong>{formatDate(post.created_at)}</p>
                        <button className="view-details-button" onClick={() => handleViewDetails(post)}>Xem chi tiết</button>
                    </div>
                    </div>
                ))}
            </div>
          )}
        </div>
        </div>
        
        <div className="right-content">
          <div className="new-posts-section">
            <h3>Bài đăng mới</h3>
            <ul>
              {posts.slice(0, 5).map((post) => (
                <li key={post.id}>
                  <div className="post-thumbnail">
                    <img
                      src={post.imageUrl || "default-image.jpg"}
                      alt="Post thumbnail"
                    />
                  </div>
                  <h4 onClick={() => handleViewDetails(post)}>{post.title}</h4>
                  <p className="post-content">{post.content}</p>
                  <p>
                    <strong>Ngày đăng:</strong>{" "}
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="user-footer">

      </div>
    </div>
  );
};

export default UserPage;