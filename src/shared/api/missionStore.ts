import FirewallBreach from "@/windows/missions/firewall/Firewall";
import Obama from "@/windows/missions/obama/Opama";
import Password from "@/windows/missions/password/Password";
import axios from "axios";
import { ComponentType } from "react";
import { create } from "zustand";
import { url } from "./vars";

interface IMissions {
      count: number[],
      level: number,
      missons: {
            [key: number]: {
                  name: string;
                  window: ComponentType;
                  permissions: boolean;
                  isWin: boolean
            };
      };
      getMissions: () => void,
      setWin: (id: number) => void
}

export const useMissionStore = create<IMissions>()((set, get) => ({
      count: [1, 2, 3],
      level: 1,
      missons: {
            1: {
                  name: "Password",
                  window: Password,
                  permissions: true,
                  isWin: false
            },
            2: {
                  name: "Firewall",
                  window: FirewallBreach,
                  permissions: false,
                  isWin: false
            },
            3: {
                  name: "Obama",
                  window: Obama,
                  permissions: false,
                  isWin: false
            }
      },
      getMissions: async () => {
            const res = await axios.get(`${url}/missions`, {
                  headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                  }
            })
            console.log(res);

            set({ level: res.data.level })
            const missions = get().missons
            const nw = Object.entries(missions).map((el) => {
                  if (res.data.level >= el[0]) {
                        el[1].permissions = true
                        el[1].isWin = true
                  } else if (res.data.level + 1 == el[0]) {
                        el[1].permissions = true
                  }
                  return el
            })
            set({ missons: Object.fromEntries(nw) })
      },
      setWin: async (id: number) => {
            const res = await axios.post(`${url}/missions/complete`, {
                  headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                  }
            })
            const level = get().level
            set({level: level+1})
      }
}));
