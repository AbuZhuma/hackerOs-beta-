import { FC, useState } from "react"
import styles from "./styles.module.css"
import Input from "@/shared/ui/input/Input"
import Button from "@/shared/ui/button/Button"
import { useFstore } from "@/shared/api/fStore"

interface ICreate {
      type: "folder" | "file",
      father: string
}

const Create: FC<ICreate> = ({ type, father }) => {
      const [value, setValue] = useState("")
      const { add, fs } = useFstore()
      const onClick = () => {
            const opt = {
                  path: father + value,
                  name: value,
                  type: type,
                  children: [],
                  text: ""
            }
            add(opt)
      }
      return (
            <div className={styles.create}>
                  {type === "folder" ? "📁" : "📄"}
                  <Input value={value} onChange={(e) => setValue(e.target.value)} />
                  <Button onClick={onClick} text="create" />
            </div>
      )
}

export default Create
