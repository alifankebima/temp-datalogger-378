import React from "react";

interface SimpleButtonProps {
  children?: React.ReactNode
  onClick?: () => void
}

const SimpleButton: React.FC<SimpleButtonProps> = ({children, onClick}) => {
  return <button className='bg-gray-300 rounded px-3 py-1' onClick={onClick}>{children}</button>
};

export default SimpleButton;
