import { useMissionStore } from "@/shared/api/missionStore"
import styles from "./styles.module.css"
import MissionButton from "@/shared/ui/missionButton/MissionBtn"
import { useWindowsStore } from "@/shared/api/windowStore"

const Missons = () => {
      const { missons, count } = useMissionStore()
      const { addAppWindow } = useWindowsStore()

      return (
            <div className={styles.container}>
                  {count.map((el, i) => {
                        let mission = missons[el]
                        return (
                              <MissionButton disabled={!mission.permissions} text={mission.permissions ? `${el}lvl-${mission.name}` : "--#--"} onClick={() => addAppWindow(<mission.window />, mission.name, 800, 500)} />
                        )
                  })}
            </div>
      )
}

export default Missons
