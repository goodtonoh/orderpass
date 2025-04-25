const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

// React 정적 파일 제공 (React build 폴더 서빙)
app.use(express.static(path.join(__dirname, "../frontend/build")));

// 기본 API 
app.get("/api/menu", (req, res) => {
  const menuData = [
    { category: "치킨", img: "01chicken/chicken_1.png", popupImg: "01chicken/popup_chicken_1.png" },
    { category: "치킨", img: "01chicken/chicken_2.png", popupImg: "01chicken/popup_chicken_2.png" },
    { category: "치킨", img: "01chicken/chicken_3.png", popupImg: "01chicken/popup_chicken_3.png" },
    
    { category: "순살", img: "02sunsal/sunsal_1.png", popupImg: "02sunsal/popup_sunsal_1.png" },
    { category: "순살", img: "02sunsal/sunsal_2.png", popupImg: "02sunsal/popup_sunsal_2.png" },
    { category: "순살", img: "02sunsal/sunsal_3.png", popupImg: "02sunsal/popup_sunsal_3.png" },
    
    { category: "윙봉", img: "03wingbong/wingbong_1.png", popupImg: "03wingbong/popup_wingbong_1.png" },
    { category: "윙봉", img: "03wingbong/wingbong_2.png", popupImg: "03wingbong/popup_wingbong_2.png" },
    { category: "윙봉", img: "03wingbong/wingbong_3.png", popupImg: "03wingbong/popup_wingbong_3.png" },
    
    { category: "사이드", img: "04side/side_1.png", popupImg: "04side/popup_side_1.png" },
    { category: "사이드", img: "04side/side_2.png", popupImg: "04side/popup_side_2.png" },
  ];
  res.json(menuData);
});

// React Router 
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Run the Server 
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

