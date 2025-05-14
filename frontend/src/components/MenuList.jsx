import React from "react";

function MenuList({ menu, setSelectedImage }) {
  return (
    <div className="row">
      {menu.map((item) => (
        <div key={item.id} className="col-12 mb-4">
          <div className="card h-100 shadow-sm d-flex flex-row align-items-center p-2">
            {/* 좌측 메뉴 이미지 */}
            <img
              src={`http://localhost:5000/uploads/${item.img_path}`}
              alt={item.name}
              className="img-fluid"
              onClick={() => setSelectedImage(`http://localhost:5000/uploads/${item.img_path}`)}
              style={{ cursor: "pointer", maxWidth: "120px", maxHeight: "100px", objectFit: "cover", marginRight: "15px" }}
            />

            {/* 우측 메뉴 정보 */}
            <div className="flex-grow-1">
              <h6 className="mb-1" style={{ fontSize: "1rem", fontWeight: "bold" }}>{item.name}</h6>
              <p className="mb-1" style={{ fontSize: "0.85rem", color: "#555" }}>{item.description}</p>
              <p className="mb-0" style={{ color: "#ff5733", fontWeight: "bold", fontSize: "0.9rem" }}>{item.price}원</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuList;


