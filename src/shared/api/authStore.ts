import axios from 'axios';
import { create } from 'zustand';
import { url } from './vars';

interface User {
  username: string;
  id: string  
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${url}/auth/login`, { username, password })
      localStorage.setItem("token", res.data.token)
    } catch (error) {
      set({ error: "Error" })
      console.log(error);
      throw error
    }
  },

  register: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${url}/auth/register`, { username, password })
      localStorage.setItem("token", res.data.token)
      console.log(res);
      
    } catch (error) {
      set({ error: "Error" })
      console.log(error);
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, error: null });
  },

  initialize: async () => {
    try {
      const res = await axios.get(`${url}/missions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      set({user: {username: res.data.username, id: res.data.id}})
    } catch (error) { 
      set({ error: "Error" })
      console.log(error);
      throw error
    }
  }
}));
