import React from "react";

interface NavbarButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const NavbarButton: React.FC<NavbarButtonProps> = ({
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${
        !disabled
          ? "hover:bg-blue-200 active:bg-blue-300 hover:border-blue-300"
          : "text-gray-400"
      } rounded flex items-center flex-col border-2 border-transparent p-1`}
    >
      {children}
    </button>
  );
};

export default NavbarButton;
