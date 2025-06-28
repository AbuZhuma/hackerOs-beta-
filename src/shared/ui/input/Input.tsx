"use client"

import { FC, InputHTMLAttributes, useState, useEffect } from "react";
import styles from "./styles.module.css";

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  blinkCursor?: boolean;
  error?: string;
  success?: boolean;
  disabled?: boolean;
}

const Input: FC<IInput> = ({
  label,
  blinkCursor = false,
  error,
  success = false,
  disabled = false,
  value,
  ...props
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (!blinkCursor || disabled) return;

    const interval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, [blinkCursor, disabled]);

  return (
    <div className={`${styles.inputContainer} ${disabled ? styles.disabled : ''}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {props.required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={`${styles.inputWrapper} ${error ? styles.error : ''} ${success ? styles.success : ''}`}>
        <span className={styles.bracket}>[</span>
        <input
          className={styles.input}
          value={value}
          disabled={disabled}
          {...props}
        />
        {blinkCursor && !value && !disabled && (
          <span className={`${styles.cursor} ${isBlinking ? styles.visible : ''}`}>_</span>
        )}
        <span className={styles.bracket}>]</span>
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default Input;