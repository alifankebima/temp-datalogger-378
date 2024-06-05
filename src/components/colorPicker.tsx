import React, { useState } from 'react';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ColorPicker = () => {
  const [colors, setColors] = useState<string[]>([]);
  const [showColors, setShowColors] = useState(false);

  const handleButtonClick = () => {
    const newColors = Array.from({ length: 8 }, () => getRandomColor());
    setColors(newColors);
    setShowColors(true);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <button
      type='button'
        onClick={handleButtonClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Show Colors
      </button>
      {showColors && (
        <div className="flex mt-4 space-x-2">
          {colors.map((color, index) => (
            <button
              key={index}
              className="w-10 h-10 rounded"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
