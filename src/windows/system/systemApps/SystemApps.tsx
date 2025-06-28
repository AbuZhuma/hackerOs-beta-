import Opener from "@/shared/labels/opener/Opener"
import styles from "./styles.module.css"
import Calculator from "../calculator/Calculator"
import PortManager from "../portManager/PortManager"
import Terminal from "../terminal/Terminal"

const SystemApps = () => {
  return (
    <div className={styles.container}>
      <Opener text="Calcutor" render={<Calculator/>} w={500}/>
      <Opener text="Port manager" render={<PortManager/>}/>
      <Opener text="Terminal" render={<Terminal />} />
    </div>
  )
}

export default SystemApps
