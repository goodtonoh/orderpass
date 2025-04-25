import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuList from "./components/MenuList";
import Modal from "./components/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

function App() {
  const [menu, setMenu] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/menu").then((res) => {
      setMenu(res.data);
    });
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="container mt-4">
      {/* 🔥 상단 배너 */}
      <div className="text-center mb-4">
        <img
          src={`${process.env.PUBLIC_URL}/img/menu/menuTop.jpg`}
          alt="배너 이미지"
          style={{ width: "100%", maxHeight: "750px", objectFit: "cover", borderRadius: "10px" }}
        />
      </div>

      {/* 🔥 가로 Navbar 추가 */}
      <nav className="navbar">
        <button onClick={() => scrollToSection("chicken")}>치킨</button>
        <button onClick={() => scrollToSection("boneless")}>순살</button>
        <button onClick={() => scrollToSection("wings")}>윙봉</button>
        <button onClick={() => scrollToSection("sides")}>사이드</button>
      </nav>

      {/* <h1 className="text-center">🍗 깐부치킨 메뉴 🍗</h1> */}

      {/* 🔥 메뉴 리스트 - 각 섹션에 ID 추가 */}
      <div id="chicken">
        <h2 className="menu-title">🍗 치킨</h2>
        <MenuList menu={menu.filter((item) => item.category === "치킨")} setSelectedImage={setSelectedImage} />
      </div>

      <div id="boneless">
        <h2 className="menu-title">🍖 순살</h2>
        <MenuList menu={menu.filter((item) => item.category === "순살")} setSelectedImage={setSelectedImage} />
      </div>

      <div id="wings">
        <h2 className="menu-title">🍗 윙봉</h2>
        <MenuList menu={menu.filter((item) => item.category === "윙봉")} setSelectedImage={setSelectedImage} />
      </div>

      <div id="sides">
        <h2 className="menu-title">🍟 사이드</h2>
        <MenuList menu={menu.filter((item) => item.category === "사이드")} setSelectedImage={setSelectedImage} />
      </div>

      {selectedImage && <Modal img={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
}

export default App;
