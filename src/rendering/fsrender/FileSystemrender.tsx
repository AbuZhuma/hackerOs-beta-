import { useFstore } from "@/shared/api/fStore"
import Icon from "@/shared/labels/workicon/Icon"
import styles from "./styles.module.css"

const FileSystemrender = () => {
      const {fs, add} = useFstore()
      return (
            <div className={styles.cont}>
                  {fs?.children?.map((el) => {
                        return(
                              <Icon data={el}/>
                        )
                  })}
            </div>
      )
}

export default FileSystemrender
