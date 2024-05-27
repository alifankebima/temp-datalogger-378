import React, { useEffect, useRef, useState } from "react";
import { dropdownItems, DropdownItems } from "../types/dropdown";
import { IoMdArrowDropdown } from "react-icons/io";
import SimpleButton from "./SimpleButton";

interface Props {
  onChange: (option: DropdownItems) => void;
  selectedOption: {
    name: string
    value: number
  };
}

const Dropdown: React.FC<Props> = ({ selectedOption, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false)
  }

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelected = (option: DropdownItems) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(()=> {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <SimpleButton onClick={toggleDropdown} className="min-w-28">
          {selectedOption.name}
          <IoMdArrowDropdown />
        </SimpleButton>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-15">
          <div className="py-1">
            {dropdownItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleSelected(item)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

