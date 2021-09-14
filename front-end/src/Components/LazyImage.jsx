import React from "react";
import LazyLoad from "react-lazyload";

const LazyImage = ({ src, alt }) => {
  const refPlaceholder = React.useRef();

  const removePlaceholder = () => {
    refPlaceholder.current.remove();
  };

  return (
    <LazyLoad
      once={true}
    >
      <div ref={refPlaceholder} className="load-image" />
      <img
        onLoad={() => removePlaceholder()}
        src={src}
        alt={alt}
      />
    </LazyLoad>
  );
};

export default LazyImage;
