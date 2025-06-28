"use client"
import styles from "./styles.module.css"
import Opener from "@/shared/labels/opener/Opener";
import Browser from "@/windows/system/browser/Browser";
import CodeEditor from "@/windows/system/codeEditor/CodeEditor";
import Missons from "@/windows/system/missons/Missons";
import SystemApps from "@/windows/system/systemApps/SystemApps";

const Header = () => {
      return (
            <div className={styles.header}>
                  <div className={styles.inner}>
                        <Opener text="System apps" render={<SystemApps/>} h={200}/>
                        <Opener text="Browser" render={<Browser />} />
                        <Opener text="C-Editor" render={<CodeEditor />} w={1000} h={700}/>
                        <Opener text="Missions" render={<Missons/>}/>
                  </div>
            </div>
      )
}

export default Header
