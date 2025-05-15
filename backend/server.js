const express = require("express");
const path = require("path");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const API_URL = process.env.NODE_ENV === "production"
  ? process.env.API_URL_PROD
  : process.env.API_URL_LOCAL;

console.log(`🔹 MODE: ${process.env.NODE_ENV}`);
console.log(`🔹 API_URL: ${API_URL}`);

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://orderpass.onrender.com"]
    : ["http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS 정책에 의해 차단되었습니다."), false);
    }
  },
  credentials: true
}));

app.use(express.json());

// 파일 업로드용 'uploads' 폴더 정적 제공
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// public 폴더 정적 제공
app.use(express.static(path.join(__dirname, "public")));

// React build 폴더 정적 제공
app.use(express.static(path.join(__dirname, "../frontend/build")));

// MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if(err) {
    console.error("MySQL 연결 실패: ", err);
  } else {
    console.log("✅ MySQL 연결 성공!");
  }
})

// 파일 업로드 multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ 메뉴 등록 API (POST)
app.post("/api/menu", upload.single("img"), (req, res) => {
  const { name, category, price, description, user_id } = req.body;
  const img_path = req.file?.filename;

  if (!name || !category || !price || !description || !img_path || !user_id) {
    return res.status(400).send("모든 필드를 입력해야 합니다.");
  }

  db.query(
    "INSERT INTO menu (name, category, price, description, img_path, user_id) VALUES (?, ?, ?, ?, ?, ?)",
    [name, category, price, description, img_path, user_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("서버 에러");
      } else {
        res.json({ success: true, id: result.insertId });
      }
    }
  );
});

// ✅ 메뉴 수정 API
app.put("/api/menu/:id", upload.single("img"), (req, res) => {
  const menuId = req.params.id;
  const { name, category, price, description, user_id } = req.body;
  const img_path = req.file?.filename;

  if (!name || !category || !price || !description || !user_id) {
    return res.status(400).send("모든 필드를 입력해야 합니다.");
  }

  const query = img_path
    ? "UPDATE menu SET name = ?, category = ?, price = ?, description = ?, img_path = ? WHERE id = ? AND user_id = ?"
    : "UPDATE menu SET name = ?, category = ?, price = ?, description = ? WHERE id = ? AND user_id = ?";

  const params = img_path
    ? [name, category, price, description, img_path, menuId, user_id]
    : [name, category, price, description, menuId, user_id];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("수정 중 서버 오류 발생");
    }
    if (result.affectedRows === 0) {
      return res.status(403).send("수정 권한이 없습니다.");
    }
    res.json({ success: true });
  });
});

// ✅ 메뉴 삭제 API
app.delete("/api/menu/:id", (req, res) => {
  const menuId = req.params.id;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).send("user_id가 필요합니다.");
  }

  db.query("DELETE FROM menu WHERE id = ? AND user_id = ?", [menuId, user_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("삭제 중 서버 오류 발생");
    }
    if (result.affectedRows === 0) {
      return res.status(403).send("삭제 권한이 없습니다.");
    }
    res.json({ success: true });
  });
});


// 메뉴 단건 조회 
app.get("/api/menu/:id", (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;

  db.query("SELECT * FROM menu WHERE id = ? AND user_id = ?", [id, user_id], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    if (results.length === 0) return res.status(403).send("권한이 없습니다.");
    res.json(results[0]);
  });
});


// ✅ 메뉴 조회 API (GET)
app.get("/api/menu", (req, res) => {
  const userId = req.query.user_id;

  db.query("SELECT * FROM menu WHERE user_id = ?", [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("서버 에러");
    } else {
      res.json(results);
    }
  });
});


// 로그인 API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT id FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("서버 에러");
      }
      if (results.length > 0) {
        const userId = results[0].id; // ✅ 여기서 user_id 가져오기
        res.json({ success: true, userId });
      } else {
        res.json({ success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." });
      }
    }
  );
});

// ✅ React 앱 라우팅 처리 (SPA 지원)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`✅ Server running at ${PORT}`);
});

