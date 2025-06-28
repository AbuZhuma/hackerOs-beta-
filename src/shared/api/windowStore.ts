import { FileSystemItem } from '@/shared/types';
import { ReactNode } from 'react';
import { create } from 'zustand';

type FileSystemWindow = {
  type: 'fs';
  id: string;
  fs: FileSystemItem;
}

type AppWindow = {
  type: 'app';
  w: number; 
  h: number;
  id: string;
  app: ReactNode;
  title: string
}

type Window = FileSystemWindow | AppWindow;

interface EditorState {
  windows: Window[];
  active: string;
  setActive: (id: string) => void,
  addFsWindow: (fsItem: FileSystemItem) => void;
  addAppWindow: (app: ReactNode, title: string, w: number, h: number) => void;
  closeWindow: (id: string) => void;
}

export const useWindowsStore = create<EditorState>()((set, get) => ({
  windows: [],
  active: "",
  setActive: (id: string) => {
    set({active: id})
  },
  addFsWindow: (fsItem) => {
    const wins = get().windows;
    if (!wins.some(win => win.type === 'fs' && win.id === fsItem.path)) {
      set({ 
        windows: [...wins, { 
          type: 'fs', 
          id: fsItem.path, 
          fs: fsItem 
        }] 
      });
      set({active: fsItem.path})
    }
  },
  addAppWindow: (app, title, w, h) => {
    const wins = get().windows;
    const newId = `app-${title}-${Date.now()}`;
    set({ 
      windows: [...wins, { 
        type: 'app', 
        w: w, 
        h: h,
        id: newId, 
        app: app ,
        title: title
      }] 
    });
    set({active: newId})
  },
  closeWindow: (id) => {
    const wins = get().windows;
    set({ windows: wins.filter(win => {
      if(win.id === id){
        return null
      }else{
        return win
      }
    }) });
  }
}));