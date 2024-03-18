import React from 'react';

const NavbarButton = ({ children, onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${
        !disabled
          ? 'hover:bg-blue-200 active:bg-blue-300 hover:border-blue-300'
          : 'text-gray-400'
      } rounded flex items-center flex-col border-2 border-transparent  p-1`}
    >
      {children}
    </button>
  );
};

export default NavbarButton;
