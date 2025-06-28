import Window from "@/shared/ui/window/Window"
import { useWindowsStore } from "../../shared/api/windowStore"
import Fs from "@/shared/ui/fs/Fs"

const WindowsRender = () => {
  const { windows, closeWindow } = useWindowsStore()
  const onClose = (id: string) => {
    closeWindow(id)
  }
  return (
    <>
      {windows.map((el) => {
        if (el.type === "fs" && el.fs) {
          return (
            <Window onClose={() => onClose(el.id)} initialPosition={{ x: 500, y: 100 }} initialWidth={600} initialHeight={500} title={el.fs.name} id={el.id}>
              <Fs data={el.fs}/>
            </Window>
          )
        }else if(el.type === "app"){
          return(
            <Window onClose={() => onClose(el.id)} initialPosition={el.title.includes("Create") ? {x: 700, y:200} :{ x: 400, y: 100 }} initialWidth={el.w} initialHeight={el.h} title={el.title} id={el.id}>
              {el.app}
            </Window>
          )
        }
      })}
    </>
  )
}

export default WindowsRender
