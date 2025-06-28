import { FileSystemItem } from '@/shared/types'
import styles from "./styles.module.css"
import { FC, useState } from 'react'
import Icon from '@/shared/labels/workicon/Icon'

interface IFs {
      data: FileSystemItem
}
const Fs: FC<IFs> = ({ data }) => {
      const [files, setFiles] = useState(data.children || [])
      const onClick = (el: FileSystemItem) => {
            if(el.type === "file") return
            setFiles(el.children)
      }
      return (
            <div className={styles.inn}>
                  {files.length ?  files.map((el) => {
                        return (
                              <Icon onClick={() => onClick(el)} data={el} />
                        )
                  }) : <p>No files</p>}
            </div>
      )
}

export default Fs
