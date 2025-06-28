import { useMissionStore } from "@/shared/api/missionStore"
import Terminal from "@/windows/system/terminal/Terminal"
import { FC, useEffect, useState } from "react"

function generateTenDigitNumber() {
      let result = ''
      let hash = ''
      for (let i = 1; i < 11; i++) {
            const digit = Math.floor(Math.random() * 9) + 1
            hash += `*${digit * i}`
            result += digit.toString()
      }
      return [result, hash]
}

const Password: FC = () => {
      const { setWin } = useMissionStore()
      const [mainPassword, setMainPassword] = useState<string[]>([])
      const [isHacked, setIsHacked] = useState(false)

      useEffect(() => {
            const [result, hash] = generateTenDigitNumber()
            setMainPassword([result, hash])
      }, [])
      if (!mainPassword[1]) return
      
      const handleSolveCommand = (args: string[], setHistory: React.Dispatch<React.SetStateAction<string[]>>) => {
            if (isHacked) {
                  setHistory(prev => [...prev, ">> SYSTEM ALREADY COMPROMISED <<", ""])
                  return
            }

            if (!args[0] || args[0].length !== 10) {
                  setHistory(prev => [...prev, "ERROR: Invalid code format", "Usage: solve <10-digit-code>", ""])
                  return
            }

            setHistory(prev => [...prev, ">> VERIFYING CODE... <<"])

            setTimeout(() => {
                  if (args[0] === mainPassword[0]) {
                        setIsHacked(true)
                        setWin(1)
                        setHistory(prev => [
                              ...prev,
                              ">> CODE ACCEPTED <<",
                              ">> SYSTEM ACCESS GRANTED <<",
                              ">> MISSION ACCOMPLISHED <<",
                              "",
                              "You can now close this terminal",
                              ""
                        ])
                  } else {
                        setHistory(prev => [
                              ...prev,
                              ">> ACCESS DENIED <<",
                              "ERROR: Code verification failed",
                              "Try analyzing the hash pattern again",
                              ""
                        ])
                  }
            }, 2000)
      }

      const initialHistory = [
            "SECURITY TERMINAL v3.1.4",
            "",
            ">> ENCRYPTION PROTOCOL ACTIVATED <<",
            `>> TARGET HASH: ${mainPassword[1]}`,
            "",
            "Analyze the hash pattern and reconstruct the original code",
            "Each * represents digit × position (1-10)",
            "10-digit code required (1-9 only)",
            "",
            "Enter 'solve' followed by your 10-digit code",
            "Enter 'help' for available commands",
            ""
      ]

      return (
            <Terminal
                  initialHistory={initialHistory}
                  customCommands={{
                        solve: handleSolveCommand
                  }}
                  prompt="PASSWORD>"
            />
      )
}

export default Password