import './App.css';

import React, { useState } from "react";
import { Decimal } from 'decimal.js';

import Screen from "./components/Screen.tsx";
import Button from "./components/Button.tsx";

const btnValues = [
  ["C", "DEL", "÷", "×"],
  [7, 8, 9, "-"],
  [4, 5, 6, "+"],
  [1, 2, 3],
  [0, ".", "="],
];

const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const math = (a, b, sign) => {
  let A = new Decimal(removeSpaces(a));
  let B = new Decimal(removeSpaces(b));
  switch (sign) {
    case "+":
      return A.plus(B);
    case "-":
      return A.minus(B);
    case "×":
      return A.mul(B);
    case "÷":
      return A.div(B);
    default:
      return;
  }
}

const zeroDivisionError = "Can't divide with 0";

function App() {
  let [calc, setCalc] = useState({
    sign: "", // 当前运算符
    num: 0, // 当前数字
    res: 0, // 上一个运算结果
  });

  const numClickHandler = (value) => {
    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num:
          removeSpaces(calc.num) % 1 === 0 && !calc.num.toString().includes(".")
            ? toLocaleString(Number(removeSpaces(calc.num + value)))
            : toLocaleString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
      });
    }
  }

  const signClickHandler = (sign) => {
    setCalc({
      ...calc,
      sign,
      res: 
        calc.res && calc.num ? toLocaleString(
          math(calc.res, calc.num, calc.sign)
        ): calc.res || calc.num,
      num: 0,
    });
  }
  
  const equalsClickHandler = () => {
    if (calc.sign && calc.num) {
      setCalc({
        ...calc,
        res:
          calc.num === "0" && calc.sign === "÷"
            ? zeroDivisionError
            : toLocaleString(
                math(calc.res, calc.num ,calc.sign)
              ),
        sign: "",
        num: 0,
      });
    }
  }

  const comaClickHandler = () => {
    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + '.' : calc.num,
    });
  }

  const revertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num).slice(0, -1)) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res).slice(0, -1)) : 0,
      sign: calc.sign,
    });
  }

  const resetClickHandler = () => {
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
    });
  }

  const buttonClickHandler = (e, btn) => {
    e.preventDefault();
    if (calc.res === zeroDivisionError) {
      return resetClickHandler();
    }
    switch (btn) {
      case "C": resetClickHandler(); break;
      case "DEL": revertClickHandler(); break;
      case ".": comaClickHandler(); break;
      case "=": equalsClickHandler(); break;
      case "+":
      case "-":
      case "×":
      case "÷":
        signClickHandler(btn); break;
      default:
        numClickHandler(btn); break;
    }
  }

  return (
    <div className='wrapper'>
      <Screen value={calc.num ? calc.num : calc.res} />
      <div className='button-box'>
        {btnValues.flat().map((btn, i) => {
          return (
            <Button
              key={i}
              className={btn === "=" ? "equals" : `equal-${btn}`}
              value={btn}
              onClick={(e) => buttonClickHandler(e, btn)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
