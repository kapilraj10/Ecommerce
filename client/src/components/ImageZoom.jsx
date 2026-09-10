import { useState } from 'react';

const ImageZoom = ({ src, alt = '' }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-crosshair w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain transition-opacity duration-200"
        style={{ opacity: showZoom ? 0 : 1 }}
      />
      {showZoom && (
        <div
          className="absolute inset-0 transition-opacity duration-100"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: '200%',
            backgroundPosition: `${position.x}% ${position.y}%`,
          }}
        />
      )}
    </div>
  );
};

export default ImageZoom;
