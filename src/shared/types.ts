interface FileSystemItem {
  path: string;
  name: string;
  type: "folder" | "file";
  children: FileSystemItem[];
  text?: string,
  owner?: string
}

export type {FileSystemItem}