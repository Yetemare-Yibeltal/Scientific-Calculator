import React, { useState } from "react";
import { evaluate } from "mathjs";
import DisplayWindow from "../Components/Display Window/DisplayWindow";
import KeyWindow from "../Components/Key Window/KeyWindow";
import "../Components/Calculator.css";
import "../Components/Display Window/DisplayWindow.css";
import "../Components/Key Window/KeyWindow.css";

const Calculator = () => {
  // Stores the expression used for calculation.
  const [expression, setExpression] = useState("");

  // Stores the user-friendly expression shown on the display.
  const [displayExp, setDisplayExp] = useState("");

  // Stores the calculation result.
  const [result, setResult] = useState("0");

  // Maps calculator buttons to mathematical expressions.
  const sciFunc = {
    sin: "sin(",
    cos: "cos(",
    tan: "tan(",
    ln: "log(",
    log: "log10(",
    sqrt: "sqrt(",
    pi: "pi",
    e: "e",
    "^": "^",
  };

  // Evaluates the mathematical expression safely with mathjs.
  function calcResult() {
    if (!expression.trim()) {
      setResult("An Error Occurred!");
      return;
    }

    try {
      const balancedExp = balanceParentheses(expression);

      // Reject expressions ending with an operator.
      if ("+-*/^".includes(balancedExp.slice(-1))) {
        setResult("Incomplete Expression!");
        return;
      }

      // Convert any legacy JavaScript-style math expressions.
      const mathExpression = balancedExp
        .replace(/\*\*/g, "^")
        .replace(/Math\.log10\(/g, "log10(")
        .replace(/Math\.sin\(/g, "sin(")
        .replace(/Math\.cos\(/g, "cos(")
        .replace(/Math\.tan\(/g, "tan(")
        .replace(/Math\.sqrt\(/g, "sqrt(")
        .replace(/Math\.log\(/g, "log(")
        .replace(/Math\.PI\b/g, "pi")
        .replace(/Math\.E\b/g, "e");

      // Allow only supported mathematical names and characters.
      const allowedNames = new Set([
        "sin",
        "cos",
        "tan",
        "log",
        "log10",
        "sqrt",
        "pi",
        "e",
        "factorial",
      ]);

      const names = mathExpression.match(/[A-Za-z_]\w*/g) || [];

      const validCharacters = /^[0-9A-Za-z_+*/^().,\s-]+$/.test(
        mathExpression
      );

      if (
        !validCharacters ||
        names.some((name) => !allowedNames.has(name))
      ) {
        throw new Error("Invalid mathematical expression");
      }

      const computedValue = evaluate(mathExpression);

      // Only display finite numeric results.
      if (
        typeof computedValue !== "number" ||
        !Number.isFinite(computedValue)
      ) {
        throw new Error("Invalid calculation result");
      }

      // Round the result to four decimal places.
      const roundedResult = Number(computedValue.toFixed(4));
      setResult(String(roundedResult));
    } catch {
      setResult("An Error Occurred!");
    }
  }

  // Handles calculator button clicks.
  function handleButton(value) {
    if (value === "AC") {
      setExpression("");
      setDisplayExp("");
      setResult("0");
      return;
    }

    if (value === "DEL") {
      setExpression((previous) => previous.slice(0, -1));
      setDisplayExp((previous) => previous.slice(0, -1));
      return;
    }

    if (value === "=") {
      calcResult();
      return;
    }

    if (value === "^") {
      setExpression((previous) => previous + "^");
      setDisplayExp((previous) => previous + "^");
      return;
    }

    if (value === "!") {
      // Replace the last numeric value with its factorial expression.
      const match = expression.match(/(\d+(?:\.\d+)?)\s*$/);

      if (match) {
        const lastNum = match[1];
        const startIndex = match.index;

        const updatedExpression =
          expression.slice(0, startIndex) +
          `factorial(${lastNum})`;

        setExpression(updatedExpression);
        setDisplayExp((previous) => previous + "!");
      }
      return;
    }

    if (Object.prototype.hasOwnProperty.call(sciFunc, value)) {
      const mappedValue = sciFunc[value];

      setExpression((previous) => previous + mappedValue);

      if (["pi", "e"].includes(value)) {
        setDisplayExp((previous) => previous + value);
      } else {
        setDisplayExp((previous) => previous + value + "(");
      }
      return;
    }

    // Append digits, decimal points, parentheses, and operators.
    setExpression((previous) => previous + value);
    setDisplayExp((previous) => previous + value);
  }

  // Adds closing parentheses for any unmatched opening parentheses.
  function balanceParentheses(exp) {
    const openCount = (exp.match(/\(/g) || []).length;
    const closeCount = (exp.match(/\)/g) || []).length;

    if (closeCount > openCount) {
      throw new Error("Unbalanced parentheses");
    }

    return exp + ")".repeat(openCount - closeCount);
  }

  return (
    <div className="calculator">
      <DisplayWindow expression={displayExp} result={result} />
      <KeyWindow handleButton={handleButton} />
    </div>
  );
};

export default Calculator;
