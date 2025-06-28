"use client"
import React, { useState } from 'react';
import styles from './styles.module.css';
import Button from '@/shared/ui/button/Button';

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [glitchEffect, setGlitchEffect] = useState<boolean>(false);

  const handleButtonClick = (value: string) => {
    if (glitchEffect) return;
    setInput(prev => prev + value);
  };

  const calculate = () => {
    if (glitchEffect) return;

    try {
      setGlitchEffect(true);

      setTimeout(() => {
        const evalResult = eval(input.replace(/×/g, '*').replace(/÷/g, '/'));
        setResult(evalResult.toString());
        setGlitchEffect(false);
      }, 300);
    } catch (error) {
      setResult('Error');
      setTimeout(() => {
        setGlitchEffect(false);
        setInput('');
        setResult('');
      }, 1000);
    }
  };

  const clearInput = () => {
    setInput('');
    setResult('');
  };

  const backspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  return (
    <div className={`${styles.calculator} ${glitchEffect ? styles.glitch : ''}`}>
      <div className={styles.display}>
        <div className={styles.input}>{input || '0'}</div>
        <div className={styles.result}>{result ? `= ${result}` : ''}</div>
      </div>

      <div className={styles.keypad}>
        <Button onClick={() => handleButtonClick('+')} text="+" className={styles.operator} />
        <Button onClick={() => handleButtonClick('-')} text="-" className={styles.operator} />
        <Button onClick={() => handleButtonClick('×')} text="×" className={styles.operator} />
        <Button onClick={() => handleButtonClick('÷')} text="÷" className={styles.operator} />

        <Button onClick={() => handleButtonClick('7')} text="7" className={styles.number} />
        <Button onClick={() => handleButtonClick('8')} text="8" className={styles.number} />
        <Button onClick={() => handleButtonClick('9')} text="9" className={styles.number} />

        <Button onClick={() => handleButtonClick('4')} text="4" className={styles.number} />
        <Button onClick={() => handleButtonClick('5')} text="5" className={styles.number} />
        <Button onClick={() => handleButtonClick('6')} text="6" className={styles.number} />

        <Button onClick={() => handleButtonClick('1')} text="1" className={styles.number} />
        <Button onClick={() => handleButtonClick('2')} text="2" className={styles.number} />
        <Button onClick={() => handleButtonClick('3')} text="3" className={styles.number} />

        <Button onClick={() => handleButtonClick('0')} text="0" className={styles.number} />
        <Button onClick={() => handleButtonClick('.')} text="." className={styles.number} />
        <Button onClick={backspace} text="⌫" className={styles.control} />
        <Button onClick={clearInput} text="C" className={styles.control} />

        <Button onClick={calculate} text="=" className={styles.equals} />
      </div>

      <div className={styles.scanline}></div>
      <div className={styles.corner}></div>
    </div>
  );
};

export default Calculator;
