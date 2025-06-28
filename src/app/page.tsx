"use client"
import styles from "./page.module.css";
import WindowsRender from "@/rendering/widnowsren/WindowsRender";
import FileSystemrender from "@/rendering/fsrender/FileSystemrender";
import { useWindowsStore } from "@/shared/api/windowStore";
import MainContext from "@/windows/contexts/mainContext/MainContext";
import Header from "@/cpanel/Header";
import { useAuthStore } from "@/shared/api/authStore";
import { useEffect } from "react";
import { useFstore } from "@/shared/api/fStore";
import { useMissionStore } from "@/shared/api/missionStore";

export default function Home() {
  const { addAppWindow } = useWindowsStore()
  const {initialize} = useAuthStore()
  const {initFs, fs} = useFstore()
  const {getMissions} = useMissionStore()
  useEffect(() => {
    initialize() 
    initFs()
    getMissions()
  }, [])
  useEffect(() => {
    console.log(fs);
  }, [fs])
  return (
    <>
      <div className={styles.page} onContextMenu={(e) => {
        addAppWindow(<MainContext />, "Main context", 200, 200)
      }}>
        <WindowsRender />
        <FileSystemrender />
      </div>
      <Header />
    </>
  );
}
