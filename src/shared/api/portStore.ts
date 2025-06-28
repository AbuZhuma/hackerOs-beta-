import { FileSystemItem } from '@/shared/types';
import { create } from 'zustand';
import { useFstore } from './fStore';

interface OnePort {
  port: number;
  title: string;
  htmlPath: string;
  cssPath: string;
  jsPath: string;
}

interface IPorts {
  ports: { [key: number]: OnePort };
  createPort: (port: number, title: string, htmlPath: string, cssPath: string, jsPath: string) => void;
  deletePort: (port: number) => void;
  updatePort: (port: number, updates: Partial<OnePort>) => void;
  getPortFilesContent: (port: number) => Promise<{ html: string, css: string, js: string }>;
}

export const usePortStore = create<IPorts>()((set, get) => ({
  ports: {
    5000: { port: 5000, title: "Wellcome to HackerOs", htmlPath: "/system/web/index.html", cssPath: "/system/web/styles.css", jsPath: "/system/web/main.js" }
  },
  createPort: (port, title, htmlPath, cssPath, jsPath) => {
    set(state => ({
      ports: {
        ...state.ports,
        [port]: { port, title, htmlPath, cssPath, jsPath }
      }
    }));
  },

  deletePort: (port) => {
    set(state => {
      const newPorts = { ...state.ports };
      delete newPorts[port];
      return { ports: newPorts };
    });
  },

  updatePort: (port, updates) => {
    set(state => {
      if (!state.ports[port]) return state;

      return {
        ports: {
          ...state.ports,
          [port]: {
            ...state.ports[port],
            ...updates
          }
        }
      };
    });
  },

  getPortFilesContent: async (port) => {
    const { ports } = get();
    const portData = ports[port];
    if (!portData) throw new Error(`Port ${port} not found`);

    const { findItem } = useFstore.getState();

    const getFileContent = (path: string): string => {
      const file = findItem(path);
      if (!file || file.type !== 'file') throw new Error(`File not found at path: ${path}`);
      return file.text || '';
    };

    return {
      html: getFileContent(portData.htmlPath),
      css: getFileContent(portData.cssPath),
      js: getFileContent(portData.jsPath)
    };
  }
}));