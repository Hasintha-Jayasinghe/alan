import React from "react";
import "./Switch.css";

interface Props {
  value: string;
  onClick: () => void;
}

const Switch: React.FC<Props> = ({ value, onClick }) => {
  return (
    <label className="switch" onClick={onClick}>
      <input type="checkbox" value={value} />
      <span className="slider round"></span>
    </label>
  );
};

export default Switch;
