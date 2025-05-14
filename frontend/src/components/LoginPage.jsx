import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.NODE_ENV === "production"
  ? process.env.REACT_APP_API_URL_PROD || "https://your-backend.onrender.com"
  : process.env.REACT_APP_API_URL_LOCAL || "http://localhost:5000";
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("아이디와 비밀번호를 입력해주세요!");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/login`, { username, password }, { withCredentials: true });
      if (response.data.success) {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("isLoggedIn", "true");

        console.log("로그인 성공, userId:", localStorage.getItem("userId"));

        alert("로그인 성공!");
        navigate("/home");
        window.location.href = "/home";
      } else {
        alert(response.data.message || "로그인 실패");
      }
    } catch (error) {
      console.error(error);
      alert("로그인 중 에러가 발생했습니다");
      
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm mb-5 mt-5" style={{ maxWidth: "400px", margin: "auto" }}>
      <div className="text-center mb-3">
        <img src="/img/2025airpassCI_logo.png" alt="logo" style={{ maxWidth: "200px", marginBottom: "20px" }} />
      </div>
      
      <h3 className="mb-3 text-center">로그인</h3>

      <div className="mb-3">
        <label className="form-label">아이디</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디 입력"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">비밀번호</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        로그인
      </button>
    </form>
  );
}

export default LoginPage;
