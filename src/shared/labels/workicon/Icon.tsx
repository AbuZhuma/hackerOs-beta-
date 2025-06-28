import { FC, useState } from "react";
import styles from "./styles.module.css";
import DragDropWrapper from "@/shared/ui/dragdrop/DragDrop";
import { useWindowsStore } from "@/shared/api/windowStore";
import { FileSystemItem } from "@/shared/types";
import Editor from "../../../windows/system/editor/Editor";
import { useFstore } from "@/shared/api/fStore";
import Window from "@/shared/ui/window/Window";
import Button from "@/shared/ui/button/Button";

interface IIcon {
      data: FileSystemItem;
      [key: string]: any
}

const Icon: FC<IIcon> = ({ data, ...props }) => {
      const { addFsWindow, addAppWindow } = useWindowsStore();
      const { del, add, fs } = useFstore();
      const [context, setContext] = useState(false);
      const [isDragging, setIsDragging] = useState(false);

      const addwin = () => {
            if (data.type === "file") {
                  addAppWindow(<Editor el={data} />, data.name, 700, 500);
            } else {
                  addFsWindow(data);
            }
      };

      const addmenu = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation()
            setContext(!context);
      };

      const handleDrop = (droppedItem: FileSystemItem) => {
            if (droppedItem.path === data.path ||
                  droppedItem.path.startsWith(`${data.path}/`)) {
                  return;
            }
            del(droppedItem.path);
            add({
                  ...droppedItem,
                  path: `${data.path}/${droppedItem.name}`
            });
      };
      const close = () => {
            setContext(false)
      }

      return (
            <DragDropWrapper
                  data={data}
                  onDrop={handleDrop}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={() => setIsDragging(false)}
            >
                  <div
                        className={`${styles.icon} ${isDragging ? styles.dragging : ''}`}
                        onDoubleClick={addwin}
                        onContextMenu={addmenu}
                        {...props}
                  >
                        {data.type === "folder" ? "📁" : "📄"}
                        <p>{data.name}</p>
                  </div>
                  {context &&
                        <Window isDrag={false} initialPosition={{ x: -100, y: 40 }} initialWidth={200} initialHeight={200} title={"Context menu"} onClose={() => close()}>
                              <div className={styles.win}>
                                    <Button text="Delete" />
                              </div>
                        </Window>}
            </DragDropWrapper>
      );
};

export default Icon;