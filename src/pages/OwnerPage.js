import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Owner/OwnerPage.css';

const OwnerPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priceRangeId: '',
    roomTypeId: '',
    locationId: '',
    areaId: ''
  });
  const [priceRanges, setPriceRanges] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [areas, setAreas] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token"); // Hoặc sessionStorage
  
  useEffect(() => {
    fetchPosts();
    fetchDropdownData();
  }, [userId]);

  const fetchDropdownData = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Không tìm thấy token trong localStorage!");
        }
    
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    
        const [priceRes, roomRes, locationRes, areaRes] = await Promise.all([
            axios.get("http://localhost:8080/owner/post/price-ranges"),
            axios.get("http://localhost:8080/owner/post/room-types"),
            axios.get("http://localhost:8080/owner/post/locations"),
            axios.get("http://localhost:8080/owner/post/areas"),
        ]);
    
        console.log("Kết quả:", {
          prices: priceRes.data,
          rooms: roomRes.data,
          locations: locationRes.data,
          areas: areaRes.data,
        });
  
        // Gán dữ liệu vào state
        setPriceRanges(priceRes.data);
        setRoomTypes(roomRes.data);
        setLocations(locationRes.data);
        setAreas(areaRes.data);
  
    } catch (error) {
        console.error("Lỗi khi gọi API:", error.response?.data || error.message);
    }
  };
  
  
  const fetchPosts = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:8080/owner/post/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Danh sách bài đăng:", data);
        setPosts(data); // 🟢 Cập nhật state
    } catch (error) {
        console.error("Lỗi khi lấy bài đăng:", error);
    }
};


  const searchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/owner/post/${userId}/search?keyword=${searchKeyword}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchPosts();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Transform form data to match API structure
    const postData = {
      userId: userId,
      title: formData.title,
      content: formData.content,
      priceRange: { id: parseInt(formData.priceRangeId) },
      roomType: { id: parseInt(formData.roomTypeId) },
      location: { id: parseInt(formData.locationId) },
      area: { id: parseInt(formData.areaId) }
    };
    
    try {
      if (isEditing && selectedPost) {
        await axios.put(`http://localhost:8080/owner/post/${userId}/${selectedPost.id}`, postData);
      } else {
        await axios.post(`http://localhost:8080/owner/post/${userId}`, postData);
      }
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) {
      try {
        await axios.delete(`http://localhost:8080/owner/post/${userId}/${postId}`);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      priceRangeId: post.priceRange?.id || '',
      roomTypeId: post.roomType?.id || '',
      locationId: post.location?.id || '',
      areaId: post.area?.id || ''
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priceRangeId: '',
      roomTypeId: '',
      locationId: '',
      areaId: ''
    });
    setSelectedPost(null);
    setIsEditing(false);
  };
  const formattedStatus = (status) => {
    switch (status) {
      case 'pending': return 'Đang Chờ Duyệt';
      case 'approved': return 'Đã Được Duyệt';
      case 'rejected': return 'Bị Từ Chối';
      default: return status;
    }
};

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="owner-page">
      <div className="header">
        <h1>Quản Lý Bài Đăng</h1>
      </div>
      
      <div className="content">
        <div className="left-panel">
          <div className="search-container">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Tìm kiếm bài đăng..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button type="submit">Tìm kiếm</button>
            </form>
          </div>
          
          <div className="post-list">
            <h2>Danh sách bài đăng</h2>
            {posts.length === 0 ? (
              <p>Không có bài đăng nào.</p>
            ) : (
              posts.map(post => (
                <div className="post-item" key={post.id}>
                  <div className="post-header">
                    <h3>{post.title}</h3>
                    <span className={getStatusBadgeClass(post.status)}>
                    {formattedStatus(post.status)}
                    </span>
                  </div>
                  <div className="post-details">
                    <p><strong>Tiêu đề:</strong> {post.content}</p>
                    <p><strong>Loại phòng:</strong> {post.roomType?.typeName}</p>
                    <p><strong>Khu vực:</strong> {post.location?.address}</p>
                    <p><strong>Giá:</strong> {post.priceRange?.rangeName}</p>
                    <p><strong>Diện tích:</strong> {post.area?.size} m²</p>
                    <p><strong>Ngày đăng:</strong> {formatDate(post.created_at)}</p>
                  </div>
                  <div className="post-actions">
                    <button onClick={() => handleEdit(post)}>Sửa</button>
                    <button onClick={() => handleDelete(post.id)}>Xóa</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="right-panel">
          <h2>{isEditing ? 'Cập nhật bài đăng' : 'Thêm bài đăng mới'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tiêu đề</label>
              <input 
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Nội dung</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Khoảng giá</label>
              <select
                name="priceRangeId"
                value={formData.priceRangeId}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn khoảng giá --</option>
                {priceRanges.map(range => (
                  <option key={range.id} value={range.id}>{range.rangeName}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Loại phòng</label>
              <select
                name="roomTypeId"
                value={formData.roomTypeId}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn loại phòng --</option>
                {roomTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.typeName}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Khu vực</label>
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn khu vực --</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{location.address}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Diện tích</label>
              <select
                name="areaId"
                value={formData.areaId}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn diện tích --</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.size} m²</option>
                ))}
              </select>
            </div>
            
            <div className="form-actions">
              <button type="submit">{isEditing ? 'Cập nhật' : 'Thêm mới'}</button>
              {isEditing && (
                <button type="button" onClick={resetForm}>Hủy</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnerPage;