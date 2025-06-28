"use client"
import Button from "@/shared/ui/button/Button"
import styles from "./styles.module.css"
import Textarea from "@/shared/ui/textarea/Textarea"
import { FC, useState } from "react"
import { FileSystemItem } from "@/shared/types"
import { useFstore } from "@/shared/api/fStore"

interface IEditor{
      el: FileSystemItem
} 

const Editor:FC<IEditor> = ({el}) => {
      const [value, setValue] = useState(el.text || "")
      const {updateFileContent, fs} = useFstore()
      const update = () => {
            updateFileContent(el.path, value)
            console.log(fs);
      }
      return (
            <div className={styles.editor}>
                  <div>
                    <Button text="save" onClick={update}/>    
                  </div>
                  
                  <Textarea blinkCursor={true} value={value} onChange={(e) => setValue(e.target.value)}/>
            </div>
      )
}

export default Editor
