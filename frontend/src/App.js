import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginPage from "./components/LoginPage";
import MenuList from "./components/MenuList";
import Modal from "./components/Modal";
import AddMenuForm from "./components/AddMenuForm";
import EditMenuPage from "./components/EditMenuPage";
import MyMenusPage from "./components/MyMenusPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

function App() {
  const [menu, setMenu] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  // const navigate = useNavigate();

  const API_URL =
  window.location.hostname === "localhost"
    ? process.env.REACT_APP_API_URL_LOCAL
    : process.env.REACT_APP_API_URL_PROD;
  
  const isAuthenticated = () => {
    return localStorage.getItem("isLoggedIn") === "true";
  };

  const fetchMenu = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios.get(`${API_URL}/api/menu?user_id=${userId}`).then((res) => {
      setMenu(res.data);
    });
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchMenu();
    }
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("isLoggedIn");
    alert("로그아웃 되었습니다.");
    window.location.href = "/";
  }

  const userId = localStorage.getItem("userId");
  const filteredMenu = menu.filter((item) => item.user_id == userId);

  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          {/* 🔐 로그인 페이지 */}
          <Route path="/" element={<LoginPage />} />

          {/* ✅ 홈 페이지 */}
          <Route
            path="/home"
            element={
              <>
                {/* 로그인 */}
                <nav className="navbar mb-4 d-flex justify-content-between">
                  <div>
                    {/* <Link to="/home" className="btn btn-outline-primary me-2">메뉴 보기</Link> */}
                    <Link to="/add" className="btn btn-primary">메뉴 추가</Link>
                    <Link to="/my-menus" className="btn btn-outline-secondary me-2" style={{ marginLeft: "10px" }}>메뉴 수정</Link>
                  </div>
                  <button className="btn btn-outline-primary me-2" onClick={handleLogout}>로그아웃</button> {/* ✅ 로그아웃 버튼 */}
                </nav>

                {/* 카테고리 내비 */}
                <nav className="navbar mb-4">
                  <button onClick={() => scrollToSection("mainDish")}>메뉴</button>
                  <button onClick={() => scrollToSection("sides")}>사이드</button>
                  <button onClick={() => scrollToSection("drinks")}>음료</button>
                  <button onClick={() => scrollToSection("soju")}>주류</button>
                </nav>

                {/* 메뉴 리스트 */}
                <div id="mainDish">
                  <h2 className="menu-title">🍗 메뉴</h2>
                  <MenuList menu={filteredMenu.filter((item) => item.category === "메뉴")} setSelectedImage={setSelectedImage} />
                </div>

                <div id="sides">
                  <h2 className="menu-title">🍖 사이드</h2>
                  <MenuList menu={filteredMenu.filter((item) => item.category === "사이드")} setSelectedImage={setSelectedImage} />
                </div>

                <div id="drinks">
                  <h2 className="menu-title">🥤 음료</h2>
                  <MenuList menu={filteredMenu.filter((item) => item.category === "음료")} setSelectedImage={setSelectedImage} />
                </div>

                <div id="soju">
                  <h2 className="menu-title">🍺 주류</h2>
                  <MenuList menu={filteredMenu.filter((item) => item.category === "주류")} setSelectedImage={setSelectedImage} />
                </div>

                {selectedImage && <Modal img={selectedImage} onClose={() => setSelectedImage(null)} />}
              </>
            }
          />

          {/* ➕ 메뉴 추가 */}
          <Route path="/add" element={<AddMenuForm onMenuAdded={fetchMenu} />} />
          {/* ➕ 메뉴 수정 */}
          <Route path="/edit/:id" element={<EditMenuPage />} />
          <Route path="/my-menus" element={<MyMenusPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
