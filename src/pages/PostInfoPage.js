import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/Post/PostInfoPage.css';

const PostInfoPage = () => {
    const { id } = useParams();  
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/post/${id}`);
                setPost(response.data);
            } catch (err) {
                setError('Không thể tải bài viết.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>Không tìm thấy bài viết.</p>;

    return (
        <div className="post-info-page-content">
            <h2>{post.title}</h2>
            <h3>Thông tin mô tả:</h3>
            <p dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }}></p>
            <p>Loại phòng: {post.roomType?.typeName || "Không xác định"}</p>
            <p><strong><em>Vị trí: </em></strong>{post.location?.address || "Không xác định"}</p>
            <p><strong><em>Diện tích: </em></strong>{post.area?.size ? `${post.area.size} m²` : "Không xác định"}</p>
            <p><strong><em>Khoảng giá: </em></strong>{post.priceRange?.rangeName || "Không xác định"}</p>
            <p><strong><em>Người đăng: </em></strong>{post.fullName || "Không xác định"}</p>
            
            <div className="contact-info">
                <h3>Thông tin liên hệ</h3>
                <div className="contact-header">
                    <img 
                        src={post.avatarUrl || "https://via.placeholder.com/100"} 
                        alt="Avatar" 
                        className="contact-avatar"
                    />
                    <div>
                        <p><strong>{post.fullName || "Người đăng"}</strong> - Đang hoạt động</p>
                    </div>
                </div>
                <div className="contact-buttons">
                    
                    <a 
                        href={`tel:${post.phone}`} 
                        className="contact-btn call-btn"
                    >
                        📞 {post.phone}
                    </a>
                    <a 
                        href={`https://zalo.me/${post.phone}`} 
                        className="contact-btn zalo-btn"
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        💬 Nhắn Zalo
                    </a>
                </div>
            </div>

            <div className="contact-note">
                <p>Lưu ý: </p>
                <span >- Chỉ đặt cọc khi xác định được chủ nhà đã có thỏa thuận biên nhận rõ ràng. Kiểm tra mọi điều khoản và yêu cầu liệt kê tất cả chi phí hàng tháng vào hợp đồng. </span>
                <span >- Không thay đổi giá tiền nhá, giá dịch vụ trong thời gian hợp đồng đang có hiệu lực.</span>
                <span >- Mọi thông tin liên quan đến tin đăng này chỉ mang tính chất tham khảo. Nếu bạn thấy tin đăng này không đúng hoặc có dấu hiệu lừa đảo, vui lòng contact với chúng tôi qua Email: dtung6898@gmail.com.</span>
            </div>
        </div>
    );
};

export default PostInfoPage;
