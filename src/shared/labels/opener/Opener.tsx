import Button from "@/shared/ui/button/Button";
import Terminal from "@/windows/system/terminal/Terminal";
import { useWindowsStore } from "@/shared/api/windowStore";
import { FC, ReactNode } from "react";
import styles from "./styles.module.css"
interface IOpener {
      text: string,
      render: ReactNode,
      w?: number,
      h?: number,
      icon?: string
}
const Opener: FC<IOpener> = ({ text, render, w=700, h=500, icon }) => {
      const { addAppWindow } = useWindowsStore()
      return (
            <div className={styles.apps}>
                  {icon ? <img src={icon} className={styles.img} /> : null}
                  <Button text={text} onClick={() => addAppWindow(render, text, w, h)} />
            </div>
      )
}

export default Opener
