import React, { useState } from "react";
import DisplayWindow from "../Components/Display Window/DisplayWindow";
import KeyWindow from "../Components/Key Window/KeyWindow";
import "../Components/Calculator.css";
import '../Components/Display Window/DisplayWindow.css';
import '../Components/Key Window/KeyWindow.css';
const Calculator = () => {
  // Stores the raw expression used for calculation
  const [expression, setExpression] = useState("");

  // Stores the user-friendly version of the expression for display
  const [displayExp, setDisplayExp] = useState("");

  // Stores the final result
  const [result, setResult] = useState("0");

  // Scientific function mappings to JavaScript syntax
  const sciFunc = {
    sin: "Math.sin(",
    cos: "Math.cos(",
    tan: "Math.tan(",
    ln: "Math.log(",
    log: "Math.log10(",
    sqrt: "Math.sqrt(",
    pi: "Math.PI",
    e: "Math.E",
    "^": "**", // JS exponentiation
  };

  // Evaluates the expression and updates the result
  function calcResult() {
    if (expression.length !== 0) {
      try {
        const balancedExp = balanceParentheses(expression); // Auto-close parentheses

        // Prevent trailing operators like 2 + or 3 **
        if (/[\+\-\*\/\^]$/.test(balancedExp)) {
          setResult("Incomplete Expression!");
          return;
        }

        let compute = eval(balancedExp); // Evaluate expression
        compute = parseFloat(compute.toFixed(4)); // Round result
        setResult(compute);
      } catch {
        setResult("An Error Occurred!");
      }
    } else {
      setResult("An Error Occurred!");
    }
  }

  // Handles button clicks from KeyWindow
  function handleButton(value) {
    if (value === "AC") {
      // Clear all states
      setExpression("");
      setDisplayExp("");
      setResult("0");
    } else if (value === "DEL") {
      // Remove last character
      setExpression(expression.slice(0, -1));
      setDisplayExp(displayExp.slice(0, -1));
    } else if (value === "pi" || value === "e") {
      // Constants: no parentheses
      setExpression(expression + sciFunc[value]);
      setDisplayExp(displayExp + value);
    } else if (value === "^") {
      // Exponentiation operator
      setExpression(expression + sciFunc[value]);
      setDisplayExp(displayExp + "^");
    } else if (sciFunc.hasOwnProperty(value)) {
      // Functions like sin, cos, sqrt
      setExpression(expression + sciFunc[value]);
      setDisplayExp(displayExp + value + "(");
    } else if (value === "!") {
      // Apply factorial to last number
      const lastNum = extractLastNum(expression);
      if (lastNum != null) {
        setExpression(expression.replace(lastNum, `factorial(${lastNum})`));
        setDisplayExp(displayExp + "!");
      }
    } else if (value === "=") {
      // Calculate result
      calcResult();
    } else {
      // Append normal value
      setExpression(expression + value);
      setDisplayExp(displayExp + value);
    }
  }

  // Factorial function exposed to eval
  function factorial(n) {
    let result = 1;
    for (let i = 1; i <= n; i++) result *= i;
    return result;
  }
  window.factorial = factorial;

  // Extracts the last number from the expression
  function extractLastNum(exp) {
    const numbers = exp.match(/\d+(\.\d+)?/g);
    return numbers ? numbers[numbers.length - 1] : null;
  }

  // Balances open and closed parentheses before evaluation
  function balanceParentheses(exp) {
    const open = (exp.match(/\(/g) || []).length;
    const close = (exp.match(/\)/g) || []).length;
    return exp + ")".repeat(open - close);
  }

  // Render calculator layout
  return (
    <div className="calculator">
      <DisplayWindow expression={displayExp} result={result} />
      <KeyWindow handleButton={handleButton} />
    </div>
  );
};

export default Calculator;
