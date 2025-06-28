"use client"
import { FC, useState, useEffect } from "react";
import styles from "./styles.module.css";

interface IButton {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  blinkEffect?: boolean;
  small?: boolean; 
  className?: string
}

const Button: FC<IButton> = ({ 
  text, 
  onClick, 
  disabled = false, 
  blinkEffect = false, 
  small = false,
  className
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  
  useEffect(() => {
    if (!blinkEffect) return;
    
    const interval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, [blinkEffect]);

  return (
    <button
      className={`${styles.hackerButton} ${small ? styles.small : ''} ${disabled ? styles.disabled : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.bracket}>[</span>
      <span className={styles.text}>
        {text}
        {blinkEffect && <span className={`${styles.cursor} ${isBlinking ? styles.visible : ''}`}>_</span>}
      </span>
      <span className={styles.bracket}>]</span>
    </button>
  );
};

export default Button;