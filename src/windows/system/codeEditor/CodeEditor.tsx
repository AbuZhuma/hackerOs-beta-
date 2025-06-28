"use client"
import { useFstore } from "@/shared/api/fStore"
import styles from "./styles.module.css"
import Button from "@/shared/ui/button/Button"
import Input from "@/shared/ui/input/Input"
import Textarea from "@/shared/ui/textarea/Textarea"
import { useState, useEffect, useRef } from "react"
import { FileSystemItem } from '@/shared/types';

const CodeEditor = () => {
      const { fs, findItem, updateFileContent, add, del } = useFstore();
      const [currentFile, setCurrentFile] = useState<FileSystemItem | null>(null);
      const [content, setContent] = useState("");
      const [fileName, setFileName] = useState("");
      const [searchTerm, setSearchTerm] = useState("");
      const [showNewFileDialog, setShowNewFileDialog] = useState(false);
      const [fileType, setFileType] = useState<"file" | "folder">("file");
      const [activeTab, setActiveTab] = useState<string | null>(null);
      const [openFiles, setOpenFiles] = useState<FileSystemItem[]>([]);
      const [currentFolder, setCurrentFolder] = useState<FileSystemItem | null>(null);
      const textareaRef = useRef<HTMLTextAreaElement>(null);

      useEffect(() => {
            if (fs.children && fs.children.length > 0 && !currentFile) {
                  const firstFile = findFirstFile(fs);
                  if (firstFile) {
                        openFile(firstFile);
                  }
            }
            setCurrentFolder(fs); // Устанавливаем корневую папку по умолчанию
      }, [fs]);

      const findFirstFile = (item: FileSystemItem): FileSystemItem | null => {
            if (item.type === "file") return item;
            if (item.children) {
                  for (const child of item.children) {
                        const found = findFirstFile(child);
                        if (found) return found;
                  }
            }
            return null;
      };

      const openFile = (file: FileSystemItem) => {
            if (file.type !== "file") return;

            setCurrentFile(file);
            setContent(file.text || "");
            setFileName(file.name);

            if (!openFiles.some(f => f.path === file.path)) {
                  setOpenFiles([...openFiles, file]);
            }
            setActiveTab(file.path);

            const parentPath = file.path.split('/').slice(0, -1).join('/') || '/';
            const parent = findItem(parentPath);
            if (parent) {
                  setCurrentFolder(parent);
            }
      };

      const selectFolder = (folder: FileSystemItem) => {
            if (folder.type !== "folder") return;
            setCurrentFolder(folder);
      };

      const saveFile = () => {
            if (!currentFile) return;
            updateFileContent(currentFile.path, content);
            console.log(currentFile);
            
      };

      const createNewFile = () => {
            if (!fileName.trim()) return;

            const parentPath = currentFolder?.path || '/';
            const newPath = `${parentPath}/${fileName}`;

            const newItem: FileSystemItem = {
                  path: newPath,
                  name: fileName,
                  type: fileType,
                  children: [],
                  text: fileType === "file" ? "" : undefined
            };

            add(newItem);

            if (fileType === "file") {
                  openFile(newItem);
            } else {
                  setCurrentFolder(newItem);
            }

            setShowNewFileDialog(false);
            setFileName("");
      };

      const deleteFile = () => {
            if (!currentFile) return;
            del(currentFile.path);
            const newOpenFiles = openFiles.filter(f => f.path !== currentFile.path);
            setOpenFiles(newOpenFiles);

            if (newOpenFiles.length > 0) {
                  openFile(newOpenFiles[newOpenFiles.length - 1]);
            } else {
                  setCurrentFile(null);
                  setContent("");
                  setActiveTab(null);
            }
      };

      const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.ctrlKey && e.key === 's') {
                  e.preventDefault();
                  saveFile();
            }

            if (e.key === 'Tab') {
                  e.preventDefault();
                  const start = textareaRef.current?.selectionStart || 0;
                  const end = textareaRef.current?.selectionEnd || 0;
                  const newValue = content.substring(0, start) + '  ' + content.substring(end);
                  setContent(newValue);

                  setTimeout(() => {
                        if (textareaRef.current) {
                              textareaRef.current.selectionStart = start + 2;
                              textareaRef.current.selectionEnd = start + 2;
                        }
                  }, 0);
            }
      };

      const filteredFiles = (item: FileSystemItem): FileSystemItem[] => {
            let result: FileSystemItem[] = [];

            if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                  result.push(item);
            }

            if (item.children) {
                  item.children.forEach(child => {
                        result = [...result, ...filteredFiles(child)];
                  });
            }

            return result;
      };

      const renderFileTree = (item: FileSystemItem, level = 0) => {
            const isInCurrentPath = currentFolder?.path.startsWith(item.path);
            const isCurrentFolder = currentFolder?.path === item.path;
            const shouldShowChildren = isInCurrentPath && item.children;

            return (
                  <div key={item.path} className={styles.treeItem}>
                        <div
                              className={`${styles.treeRow} 
          ${currentFile?.path === item.path ? styles.active : ''}
          ${isCurrentFolder ? styles.currentFolder : ''}
        `}
                              onClick={() => item.type === "file" ? openFile(item) : selectFolder(item)}
                              style={{ paddingLeft: `${level * 15}px` }}
                        >
                              {item.type === "folder" ? "📁" : "📄"} {item.name}

                        </div>
                        {shouldShowChildren && (
                              <div className={styles.treeChildren}>
                                    {item.children?.map(child => renderFileTree(child, level + 1))}
                              </div>
                        )}
                  </div>
            );
      };

      const closeTab = (path: string, e: React.MouseEvent) => {
            e.stopPropagation();
            const newOpenFiles = openFiles.filter(f => f.path !== path);
            setOpenFiles(newOpenFiles);

            if (path === activeTab) {
                  if (newOpenFiles.length > 0) {
                        openFile(newOpenFiles[newOpenFiles.length - 1]);
                  } else {
                        setCurrentFile(null);
                        setContent("");
                        setActiveTab(null);
                  }
            }
      };

      return (
            <div className={styles.editorContainer}>
                  <div className={styles.sidebar}>
                        <div className={styles.currentFolderInfo}>
                              {currentFolder && (
                                    <div className={styles.folderPath}>
                                          📁 {currentFolder.path === "/" ? "root" : currentFolder.path}
                                    </div>
                              )}
                        </div>

                        <div className={styles.searchBox}>
                              <Input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search files..."
                                    blinkCursor
                              />
                        </div>

                        <div className={styles.fileTree}>
                              {renderFileTree(fs)}
                        </div>
                        <div className={styles.sidebarButtons}>
                              <Button
                                    text="File"
                                    onClick={() => {
                                          setFileType("file");
                                          setShowNewFileDialog(true);
                                    }}
                                    small
                              />
                              <Button
                                    text="Folder"
                                    onClick={() => {
                                          setFileType("folder");
                                          setShowNewFileDialog(true);
                                    }}
                                    small
                              />
                        </div>
                  </div>

                  <div className={styles.mainArea}>
                        <div className={styles.tabsContainer}>
                              {openFiles.map(file => (
                                    <div
                                          key={file.path}
                                          className={`${styles.tab} ${activeTab === file.path ? styles.activeTab : ''}`}
                                          onClick={() => openFile(file)}
                                    >
                                          <span>{file.name}</span>
                                          <span
                                                className={styles.closeTab}
                                                onClick={(e) => closeTab(file.path, e)}
                                          >
                                                ×
                                          </span>
                                    </div>
                              ))}
                        </div>

                        {currentFile ? (
                              <div className={styles.editorWrapper}>
                                    <div className={styles.editorHeader}>
                                          <span className={styles.fileName}>{currentFile.name}</span>
                                          <div className={styles.editorButtons}>
                                                <Button
                                                      text="Save"
                                                      onClick={saveFile}
                                                      small
                                                />
                                                <Button
                                                      text="Delete"
                                                      onClick={deleteFile}
                                                      small
                                                      className={styles.deleteButton}
                                                />
                                          </div>
                                    </div>

                                    <Textarea
                                          ref={textareaRef}
                                          value={content}
                                          onChange={(e) => setContent(e.target.value)}
                                          onKeyDown={handleKeyDown}
                                    />
                              </div>
                        ) : (
                              <div className={styles.welcomeScreen}>
                                    <h2>Cyberpunk Code Editor</h2>
                                    <p>Select a file to edit or create a new one</p>
                                    <div className={styles.welcomeButtons}>
                                          <Button
                                                text="New File"
                                                onClick={() => {
                                                      setFileType("file");
                                                      setShowNewFileDialog(true);
                                                }}
                                          />
                                          <Button
                                                text="New Folder"
                                                onClick={() => {
                                                      setFileType("folder");
                                                      setShowNewFileDialog(true);
                                                }}
                                          />
                                    </div>
                              </div>
                        )}
                  </div>

                  {showNewFileDialog && (
                        <div className={styles.dialogOverlay}>
                              <div className={styles.dialog}>
                                    <h3>Create New {fileType === "file" ? "File" : "Folder"}</h3>
                                    <div className={styles.dialogPath}>
                                          Location: {currentFolder?.path === "/" ? "root" : currentFolder?.path}
                                    </div>
                                    <Input
                                          value={fileName}
                                          onChange={(e) => setFileName(e.target.value)}
                                          placeholder={`Enter ${fileType} name...`}
                                          blinkCursor
                                          autoFocus
                                    />
                                    <div className={styles.dialogButtons}>
                                          <Button
                                                text="Cancel"
                                                onClick={() => setShowNewFileDialog(false)}
                                                small
                                          />
                                          <Button
                                                text={`Create ${fileType === "file" ? "File" : "Folder"}`}
                                                onClick={createNewFile}
                                                small
                                          />
                                    </div>
                              </div>
                        </div>
                  )}
            </div>
      );
};

export default CodeEditor;