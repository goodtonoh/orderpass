import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyMenusPage() {
  const [menus, setMenus] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/api/menu?user_id=${userId}`)
      .then((res) => setMenus(res.data))
      .catch((err) => console.error("메뉴 불러오기 오류:", err));
  }, [userId]);

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`, {
        data: { user_id: userId },
      });
      setMenus((prev) => prev.filter((menu) => menu.id !== id));
    } catch (err) {
      alert("삭제 실패: 권한이 없거나 서버 오류");
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">나의 메뉴</h2>
      {menus.length === 0 ? (
        <p>등록된 메뉴가 없습니다.</p>
      ) : (
        <ul className="list-group">
          {menus.map((menu) => (
            <li key={menu.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{menu.name}</strong> - {menu.category} - {menu.price}원
              </div>
              <div>
                <Link to={`/edit/${menu.id}`} className="btn btn-sm btn-outline-primary me-2">수정</Link>
                <button onClick={() => handleDelete(menu.id)} className="btn btn-sm btn-outline-danger">삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="text-center mt-4">
      <Link to="/home" className="btn btn-primary" style={{ width: "150px", marginTop: "10px" }}>홈으로</Link>
    </div>
    </div>
    
  );
}

export default MyMenusPage;
