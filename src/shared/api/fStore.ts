import { FileSystemItem } from '@/shared/types';
import axios from 'axios';
import { create } from 'zustand';
import { url } from './vars';

interface IFs {
  fs: FileSystemItem;
  add: (file: FileSystemItem) => Promise<void>;
  del: (path: string) => Promise<void>;
  updateFileContent: (path: string, text: string) => Promise<void>;
  findItem: (path: string) => FileSystemItem | null;
  initFs: () => Promise<void>;
}

export const useFstore = create<IFs>()((set, get) => ({
  fs: {
    path: "/",
    name: "root",
    type: "folder",
    owner: "default",
    children: []
  },

  initFs: async () => {
    try {
      const res = await axios.get(`${url}/fs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      delete res.data.__v;
      delete res.data._id;
      set({ fs: res.data });
    } catch (error) {
      console.error("Failed to initialize file system:", error);
      throw error;
    }
  },

  findItem: (path) => {
    const { fs } = get();

    if (fs.path === path) return fs;

    const findRecursive = (current: FileSystemItem): FileSystemItem | null => {
      if (current.path === path) return current;

      if (current.type === 'folder' && current.children) {
        for (const child of current.children) {
          const found = findRecursive(child);
          if (found) return found;
        }
      }

      return null;
    };

    return findRecursive(fs);
  },

  add: async (file) => {
    try {
      await axios.post(`${url}/fs/add`, file, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      set(state => {
        const parentPath = file.path.split('/').slice(0, -1).join('/') || '/';
        const parent = state.findItem(parentPath);

        if (!parent || parent.type !== 'folder') {
          console.error(`Parent directory not found or not a folder: ${parentPath}`);
          return state;
        }

        if (state.findItem(file.path)) {
          console.error(`Item already exists at path: ${file.path}`);
          return state;
        }

        const updateTree = (current: FileSystemItem): FileSystemItem => {
          if (current.path === parentPath) {
            return {
              ...current,
              children: [...(current.children || []), file]
            };
          }

          return {
            ...current,
            children: current.children?.map(updateTree)
          };
        };

        return { fs: updateTree(state.fs) };
      });
    } catch (error) {
      console.error("Failed to add item:", error);
      throw error;
    }
  },

  del: async (path) => {
    try {
      set(state => {
        if (path === '/') {
          console.error("Cannot delete root directory");
          return state;
        }

        const updateTree = (current: FileSystemItem): FileSystemItem => {
          const filteredChildren = current.children?.filter(child => child.path !== path);

          if (filteredChildren && current.children && filteredChildren.length < current.children.length) {
            return {
              ...current,
              children: filteredChildren
            };
          }

          return {
            ...current,
            children: current.children?.map(updateTree)
          };
        };

        return { fs: updateTree(state.fs) };
      });
    } catch (error) {
      console.error("Failed to delete item:", error);
      throw error;
    }
  },

  updateFileContent: async (path, text) => {
    try {
      await axios.put(`${url}/fs/update-content`, { path, text }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      set(state => {
        const item = state.findItem(path);

        if (!item) {
          console.error(`File not found: ${path}`);
          return state;
        }

        if (item.type !== 'file') {
          console.error(`Cannot update content of a folder: ${path}`);
          return state;
        }

        const updateTree = (current: FileSystemItem): FileSystemItem => {
          if (current.path === path) {
            return {
              ...current,
              text: text
            };
          }

          return {
            ...current,
            children: current.children?.map(updateTree)
          };
        };

        return { fs: updateTree(state.fs) };
      });
    } catch (error) {
      console.error("Failed to update file content:", error);
      throw error;
    }
  }
}));