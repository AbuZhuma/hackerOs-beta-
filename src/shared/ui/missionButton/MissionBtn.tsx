import React from "react";
import styles from "./styles.module.css";

interface MissionButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const MissionButton: React.FC<MissionButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <button
      className={styles.missionButton}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.buttonText}>{text}</span>
      <div className={styles.cornerTopLeft}></div>
      <div className={styles.cornerTopRight}></div>
      <div className={styles.cornerBottomLeft}></div>
      <div className={styles.cornerBottomRight}></div>
    </button>
  );
};

export default MissionButton;