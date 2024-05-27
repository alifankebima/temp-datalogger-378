import React from "react";

interface SimpleButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const SimpleButton: React.FC<SimpleButtonProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`flex gap-2 items-center justify-between bg-gray-200 rounded px-3 py-1 border border-gray-300 hover:bg-gray-300 active:bg-gray-400 shadow-sm ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SimpleButton;

