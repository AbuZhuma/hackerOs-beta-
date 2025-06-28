import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { FileSystemItem } from '@/shared/types';

interface DragDropWrapperProps {
  children: React.ReactNode;
  data: FileSystemItem;
  onDrop?: (item: FileSystemItem) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const DragDropWrapper: React.FC<DragDropWrapperProps> = ({ 
  children, 
  data,
  onDrop,
  onDragStart,
  onDragEnd
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (data.type === 'folder') {
      e.preventDefault();
      setIsDragOver(true);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (data.type === 'folder' && onDrop) {
      const droppedItem = JSON.parse(e.dataTransfer.getData('application/json'));
      onDrop(droppedItem);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart();
  };

  const handleDragEnd = () => {
    if (onDragEnd) onDragEnd();
  };

  return (
    <div
      className={`${styles.dragDropWrapper} ${isDragOver ? styles.dragOver : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
    </div>
  );
};

export default DragDropWrapper;