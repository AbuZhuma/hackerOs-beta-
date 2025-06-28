import styles from "./styles.module.css"
import Create from "../creating/Create"
import Opener from "../../../shared/labels/opener/Opener"
import Terminal from "@/windows/system/terminal/Terminal"

const MainContext = () => {
      return (
            <div className={styles.win}>
                  <Opener text="Create file" render={<Create father="/" type="file" />} w={230} h={250} />      
                  <Opener text="Create folder" render={<Create father="/" type="folder" />} w={230} h={250} />      
                  <Opener text="Terminal" render={<Terminal />} />
            </div>
      )
}

export default MainContext
