import React from "react";
import "./Screen.css";

const Screen = ({ value }) => {
  return (
    <input className="screen" value={value} disabled />
  );
};

export default Screen;