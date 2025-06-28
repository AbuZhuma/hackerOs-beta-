import { useState, useRef, useEffect } from 'react';
import styles from "./styles.module.css";
import { useWindowsStore } from '@/shared/api/windowStore';

interface WindowProps {
      children: React.ReactNode;
      title?: string;
      onClose?: () => void;
      initialWidth?: number;
      initialHeight?: number;
      isDrag?: boolean;
      id?: string;
      initialPosition?: { x: number; y: number };
}

const Window: React.FC<WindowProps> = ({
      children,
      title = 'Terminal',
      onClose,
      isDrag = true,
      initialWidth = 600,
      initialHeight = 400,
      initialPosition = { x: 300, y: 300 },
      id
}) => {
      const [isDragging, setIsDragging] = useState(false);
      const [position, setPosition] = useState(initialPosition);
      const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
      const [startPos, setStartPos] = useState({ x: 0, y: 0 });
      const [startSize, setStartSize] = useState({ width: 0, height: 0 });
      const [resizeDir, setResizeDir] = useState<'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | null>(null);
      const [zi, setZi] = useState(100)
      const { setActive, active } = useWindowsStore()
      const windowRef = useRef<HTMLDivElement>(null);
      const headerRef = useRef<HTMLDivElement>(null);

      const handleMouseDown = (e: React.MouseEvent) => {
            if (!isDrag) return
            if (e.target !== headerRef.current && !(e.target as HTMLElement).closest(`.${styles.windowHeader}`)) return;

            setIsDragging(true);
            setStartPos({
                  x: e.clientX - position.x,
                  y: e.clientY - position.y
            });
      };

      const handleResizeMouseDown = (dir: typeof resizeDir, e: React.MouseEvent) => {
            e.stopPropagation();
            setResizeDir(dir);
            setStartPos({ x: e.clientX, y: e.clientY });
            setStartSize({ width: size.width, height: size.height });
      };

      useEffect(() => {
            const handleMouseMove = (e: MouseEvent) => {
                  if (isDragging) {
                        setPosition({
                              x: e.clientX - startPos.x,
                              y: e.clientY - startPos.y
                        });
                  }

                  if (resizeDir) {
                        const deltaX = e.clientX - startPos.x;
                        const deltaY = e.clientY - startPos.y;

                        let newWidth = startSize.width;
                        let newHeight = startSize.height;

                        if (resizeDir.includes('right')) newWidth = Math.max(300, startSize.width + deltaX);
                        if (resizeDir.includes('left')) newWidth = Math.max(300, startSize.width - deltaX);
                        if (resizeDir.includes('bottom')) newHeight = Math.max(200, startSize.height + deltaY);
                        if (resizeDir.includes('top')) newHeight = Math.max(200, startSize.height - deltaY);

                        setSize({ width: newWidth, height: newHeight });

                        if (resizeDir.includes('left')) {
                              setPosition(prev => ({
                                    ...prev,
                                    x: initialPosition.x + deltaX
                              }));
                        }
                        if (resizeDir.includes('top')) {
                              setPosition(prev => ({
                                    ...prev,
                                    y: initialPosition.y + deltaY
                              }));
                        }
                  }
            };

            const handleMouseUp = () => {
                  setIsDragging(false);
                  setResizeDir(null);
            };

            if (isDragging || resizeDir) {
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
            }

            return () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
            };
      }, [isDragging, resizeDir, startPos, startSize, initialPosition]);

      const handleClose = () => {
            if (onClose) onClose();
      };
      useEffect(() => {
            if (active === id) {
                  setZi(200)
            } else if (zi !== 100) {
                  setZi(100)
            }
      }, [active])

      return (
            <div
                  ref={windowRef}
                  className={styles.window}
                  style={{
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        zIndex: zi,
                  }}
                  onMouseDown={handleMouseDown}
            >
                  <div ref={headerRef} className={styles.windowHeader} onClick={() => setActive(id ? id : "")}>
                        <div className={styles.windowTitle}>{title}</div>
                        <div className={styles.windowControls}>
                              <button
                                    className={`${styles.controlButton} ${styles.closeButton}`}
                                    onClick={handleClose}
                                    aria-label="Close window"
                              >
                                    ✕
                              </button>
                        </div>
                  </div>
                  <div className={styles.windowContent} onClick={() => setZi(zi + 2)}>
                        {children}
                  </div>

                  <div className={`${styles.resizeHandle} ${styles.top}`} onMouseDown={(e) => handleResizeMouseDown('top', e)}></div>
                  <div className={`${styles.resizeHandle} ${styles.right}`} onMouseDown={(e) => handleResizeMouseDown('right', e)}></div>
                  <div className={`${styles.resizeHandle} ${styles.bottom}`} onMouseDown={(e) => handleResizeMouseDown('bottom', e)}></div>
                  <div className={`${styles.resizeHandle} ${styles.left}`} onMouseDown={(e) => handleResizeMouseDown('left', e)}></div>
                  <div className={`${styles.resizeHandle} ${styles.topRight}`} onMouseDown={(e) => handleResizeMouseDown('top-right', e)}></div>
                  <div className={`${styles.resizeHandle} ${styles.topLeft}`} onMouseDown={(e) => handleResizeMouseDown('top-left', e)}></div>
                  <div className={`${styles.resizeHandle} ${styles.bottomRight}`} onMouseDown={(e) => handleResizeMouseDown('bottom-right', e)}></div>
                  <div className={`${styles.resizeHandle} ${styles.bottomLeft}`} onMouseDown={(e) => handleResizeMouseDown('bottom-left', e)}></div>
            </div>
      );
};

export default Window;