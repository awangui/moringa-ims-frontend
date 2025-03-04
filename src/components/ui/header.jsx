import React from "react";

const Header = ({ title, children }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div>{children}</div>
    </header>
  );
};

export default Header;
