import React from "react";

function MenuList({ menu, setSelectedImage }) {
  return (
    <div className="row">
      {menu.map((item, index) => (
        <div key={index} className="col-md-4 mb-4">
          <div className="card">
            <img
              src={`/img/menu/${item.img}`}
              alt={item.category}
              className="card-img-top img-fluid"
              onClick={() => setSelectedImage(`/img/menu/${item.popupImg}`)}
              style={{ cursor: "pointer" }}
            />
            {/* <div className="card-body text-center">
              <h5 className="card-title">{item.category}</h5>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuList;

