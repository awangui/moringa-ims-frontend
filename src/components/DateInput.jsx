import { useState } from "react";

// const DateInput = ({ placeholder }) => 
export default function DateInput({ placeholder, style, name }){
  const [type, setType] = useState("text");

  return (
    <input
      type={type}
      placeholder={placeholder}
      onFocus={() => setType("date")}
      onBlur={() => setType("text")}
      className="custom-input"
      style={style}
      name={name}
    />
  );
};