"use client"
import { FC, TextareaHTMLAttributes, useState, useEffect, useRef, RefObject } from "react";
import styles from "./styles.module.css";

interface ITextarea extends TextareaHTMLAttributes<HTMLTextAreaElement> {
      label?: string;
      blinkCursor?: boolean;
      error?: string;
      success?: boolean;
      disabled?: boolean;
      value?: string,
      ref?:RefObject<HTMLTextAreaElement | null>
}

const Textarea: FC<ITextarea> = ({
      label,
      blinkCursor = false,
      error,
      success = false,
      disabled = false,
      value = "",
      ...props
}) => {
      const [isBlinking, setIsBlinking] = useState(false);
      const [cursorPosition, setCursorPosition] = useState({ row: 0, col: 0 });
      const textareaRef = useRef<HTMLTextAreaElement>(null);
      const linesContainerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
            if (!blinkCursor || disabled) return;

            const interval = setInterval(() => {
                  setIsBlinking(prev => !prev);
            }, 500);

            return () => clearInterval(interval);
      }, [blinkCursor, disabled]);

      const updateCursorPosition = () => {
            if (!textareaRef.current) return;

            const textarea = textareaRef.current;
            const startPos = textarea.selectionStart || 0;

            const text = textarea.value.substring(0, startPos);
            const lines = text.split('\n');
            const row = lines.length - 1;
            const col = lines[row].length;

            setCursorPosition({ row, col });
      };

      const renderLinesWithBrackets = () => {
            const lines = value.split('\n');

            return lines.map((line: string, rowIndex: number) => {
                  const isCurrentLine = rowIndex === cursorPosition.row;
                  const beforeCursor = isCurrentLine ? line.substring(0, cursorPosition.col) : line;
                  const afterCursor = isCurrentLine ? line.substring(cursorPosition.col) : '';

                  return (
                        <div key={rowIndex} className={styles.line}>
                              <span className={styles.bracket}>[</span>
                              <span className={styles.lineContent}>
                                    {beforeCursor}
                                    {isCurrentLine && blinkCursor && !disabled && (
                                          <span className={`${styles.cursor} ${isBlinking ? styles.visible : ''}`} />
                                    )}
                                    {afterCursor}
                              </span>
                              <span className={styles.bracket}>]</span>
                        </div>
                  );
            });
      };

      return (
            <div className={`${styles.textareaContainer} ${disabled ? styles.disabled : ''}`}>
                  {label && (
                        <label className={styles.label}>
                              {label}
                              {props.required && <span className={styles.required}>*</span>}
                        </label>
                  )}

                  <div className={`${styles.textareaWrapper} ${error ? styles.error : ''} ${success ? styles.success : ''}`}>
                        <div className={styles.linesContainer} ref={linesContainerRef}>
                              {renderLinesWithBrackets()}
                        </div>

                        <textarea
                              ref={textareaRef}
                              className={styles.textarea}
                              value={value}
                              disabled={disabled}
                              onSelect={updateCursorPosition}
                              onClick={updateCursorPosition}
                              onKeyUp={updateCursorPosition}
                              {...props}
                        />
                  </div>

                  {error && <div className={styles.errorMessage}>{error}</div>}
            </div>
      );
};

export default Textarea;