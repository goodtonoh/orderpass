import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditMenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return navigate("/");
    }

    axios.get(`http://localhost:5000/api/menu/${id}`, { params: { user_id: userId } })
      .then(res => {
        const { name, category, price, description } = res.data;
        setForm({ name, category, price, description });
      })
      .catch(err => {
        console.error(err);
        alert("메뉴를 불러올 수 없습니다.");
        navigate("/my-menus");
      });
  }, [id, userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/menu/${id}`, {
        ...form,
        user_id: userId
      });
      alert("수정 완료!");
      navigate("/my-menus");
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm mt-4 mb-5" style={{ maxWidth: "600px", margin: "auto" }}>
      <button
        className="back-icon"
        onClick={() => navigate("/my-menus")}
        type="button"
      >
      ❮
      </button>
      <h3 className="mb-4 text-center">메뉴 수정</h3>

      <div className="mb-3">
        <label className="form-label">메뉴 이름</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">카테고리</label>
        <select
          className="form-select"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">카테고리를 선택하세요</option>
          <option value="메뉴">메뉴</option>
          <option value="사이드">사이드</option>
          <option value="음료">음료</option>
          <option value="주류">주류</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">가격</label>
        <input
          type="number"
          className="form-control"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">설명</label>
        <textarea
          className="form-control"
          name="description"
          rows="3"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">메뉴 수정하기</button>
    </form>
  );
}

export default EditMenuPage;
