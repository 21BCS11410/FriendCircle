import React from "react";
import { useSelector } from "react-redux";

const Carousel = ({ images, id }) => {
  const { theme } = useSelector(state => state);
    const isActive = index => {
        if(index === 0) return "active";
    }
  return (
    <div id={`image${id}`} className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {images.map((img, index) => (
          <button
            key={index}
            type="button"
            data-bs-target={`#image${id}`}
            data-bs-slide-to={index}
            className={isActive(index)}
            aria-current="true"
          />
        ))}
      </div>
      <div className="carousel-inner">
        {images.map((img, index) => {
          const src = typeof img === "string" ? img : img?.url || "";
          if (!src) return null;
          const isVideo = /video/i.test(src);
          return (
            <div key={index} className={`carousel-item ${isActive(index)}`}>
              {isVideo ? (
                <video
                  controls
                  style={{ filter: theme ? "invert(1)" : "invert(0)" }}
                  src={src}
                  className="d-block w-100"
                  alt={src}
                />
              ) : (
                <img
                  style={{ filter: theme ? "invert(1)" : "invert(0)" }}
                  src={src}
                  className="d-block w-100"
                  alt={src}
                />
              )}
            </div>
          );
        })}
      </div>
      <button
        style={{ width: "5%" }}
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#image${id}`}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        style={{ width: "5%" }}
        className="carousel-control-next"
        type="button"
        data-bs-target={`#image${id}`}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
