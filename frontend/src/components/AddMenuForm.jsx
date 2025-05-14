import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";

function AddMenuForm({ onMenuAdded }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !price || !description || !file) {
      alert("모든 항목을 입력해주세요!");
      return;
    }

    const userId = localStorage.getItem("userId");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("img", file);
    formData.append("user_id", userId);

    try {
      await axios.post("http://localhost:5000/api/menu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("메뉴가 추가되었습니다!");
      setName("");
      setCategory("");
      setPrice("");
      setDescription("");
      setFile(null);
      if (onMenuAdded) onMenuAdded(); // 목록 갱신

      navigate("/home");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "등록 실패!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm mb-5">
      {/* 🔙 뒤로가기 아이콘 */}
      <button
        className="back-icon"
        onClick={() => navigate("/home")}
        type="button"
      >
      ❮
      </button>
      
      <h3 className="mb-4 text-center">메뉴 추가</h3>
      <br></br>

      <div className="mb-3">
        <label className="form-label">메뉴 이름</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 허니콤보"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">카테고리</label>
        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">카테고리를 선택하세요</option>
          <option value="메뉴">메뉴</option>
          <option value="사이드">사이드</option>
          <option value="음료">음료</option>
          <option value="주류">주류</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">가격 (₩)</label>
        <input
          type="number"
          className="form-control"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="예: 15000"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">설명</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="예: 바삭하고 촉촉한 허니콤보 치킨입니다"
          rows="3"
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">이미지 파일</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>
      <br />

      <button type="submit" className="btn btn-primary">
        메뉴 등록
      </button>
    </form>
  );
}

export default AddMenuForm;
