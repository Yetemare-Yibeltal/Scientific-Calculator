import React from "react";

const KeyWindow = ({ handleButton }) => {
  const sciKeys = ["sin", "cos", "ln", "log", "tan", "π", "e", "^", "!", "√"];
  const basicKeys = [
    "7",
    "8",
    "9",
    "*",
    "/",
    "4",
    "5",
    "6",
    "-",
    "(",
    "1",
    "2",
    "3",
    "+",
    ")",
    ".",
    "0",
    "DEL",
    "AC",
    "=",
  ];

  // Map display symbols to internal function names
  const symbolMap = {
    π: "pi",
    "√": "sqrt",
  };

  return (
    <div className="keys-window">
      <div className="keys-scientific">
        {sciKeys.map((item, index) => (
          <button
            key={index}
            onClick={() => handleButton(symbolMap[item] || item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="line"></div>
      <div className="basic-keys">
        {basicKeys.map((item, index) => (
          <button
            key={index}
            className={`${item >= "0" && item <= "9" ? "number" : ""} ${
              item === "=" ? "equal" : ""
            }`}
            onClick={() => handleButton(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default KeyWindow;
