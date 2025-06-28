"use client"
import { useMissionStore } from "@/shared/api/missionStore"
import Terminal from "@/windows/system/terminal/Terminal"
import { FC, useEffect, useState } from "react"

interface UserCase {
      name: string;
      password: string;
      hash: string;
      docs: string[];
}

function generateTenDigitNumber(): [string, string] {
      let result = ''
      let hash = ''
      for (let i = 1; i < 11; i++) {
            const digit = Math.floor(Math.random() * 9) + 1
            hash += `*${digit - i}`
            result += digit.toString()
      }
      return [result, hash]
}

const Obama: FC = () => {
      const { setWin } = useMissionStore()
      const [isHacked, setIsHacked] = useState(false)
      const [cases, setCases] = useState<Map<string, UserCase>>(new Map())
      const [risk, setRisk] = useState(1.5)
      const [targetUser, setTargetUser] = useState<string | null>(null)

      const names = ["Namar", "Symon", "wayder", "skrpitri", "Tayo", "Jonku", "Misson", "Gloo"]
      
      const randomDocs = [
            "Sales Report Q2 2024",
            "Office Building Renovation Plan",
            "Fire Safety Instructions",
            "HR Department Staffing Plan",
            "Office Space Lease Agreement",
            "New Product Presentation",
            "Employee Vacation Schedule",
            "Software Development Technical Requirements",
            "Previous Year Financial Report",
            "Client Interaction Policy",
            "Privacy Policy",
            "Inventory Audit Report",
            "Shareholders Meeting Minutes",
            "Manager Job Description",
            "Marketing Campaign Plan",
            "Work Completion Certificate",
            "Employee Survey Results",
            "Next Quarter Procurement Plan",
            "Cybersecurity Assessment Report",
            "Operation Thunder Shield"
      ];

      useEffect(() => {
            const newCases = new Map<string, UserCase>()
            const secretHolderIndex = Math.floor(Math.random() * names.length)

            names.forEach((name, index) => {
                  const [password, hash] = generateTenDigitNumber()
                  const isSecretHolder = index === secretHolderIndex
                  const docs = getRandomDocuments(isSecretHolder)

                  newCases.set(name, {
                        name,
                        password,
                        hash,
                        docs
                  })
            })

            setCases(newCases)
      }, [])

      function getRandomDocuments(includeSecret: boolean): string[] {
            const shuffled = [...randomDocs]
                  .filter(doc => doc !== "Operation Thunder Shield")
                  .sort(() => 0.5 - Math.random())

            const count = 3 + Math.floor(Math.random() * 3) 
            const selected = shuffled.slice(0, count)

            if (includeSecret) {
                  selected.push("Operation Thunder Shield")
                  return selected.sort(() => 0.5 - Math.random())
            }

            return selected
      }

      const handleScanDb = (args: string[], setHistory: React.Dispatch<React.SetStateAction<string[]>>) => {
            if (args.length > 0) {
                  setHistory(prev => [...prev, "ERROR: Command takes no arguments", `Risk detection: ${risk}%`])
                  return
            }

            setHistory(prev => [...prev, "Accessing database..."])

            setTimeout(() => {
                  setHistory(prev => [
                        ...prev,
                        "OBAMA RESIDENTS DATABASE",
                        ...Array.from(cases.values()).map(user =>
                              `username: ${user.name} | password hash: ${user.hash}`
                        ),
                        `Risk detection: ${risk}%`,
                        ""
                  ])
            }, 2000)
      }

      const handleCrackUser = (args: string[], setHistory: React.Dispatch<React.SetStateAction<string[]>>) => {
            setRisk(prev => prev * 2)

            if (args.length !== 1 || !names.includes(args[0])) {
                  setHistory(prev => [...prev, "ERROR: Usage - crack <username>", `Risk detection: ${risk}%`])
                  return
            }

            setHistory(prev => [...prev, "Brute forcing password..."])

            setTimeout(() => {
                  const user = cases.get(args[0])
                  setHistory(prev => [
                        ...prev,
                        `Password cracked: ${user?.password}`,
                        `Risk detection: ${risk}%`,
                        ""
                  ])
            }, 2500)
      }

      const handleGetDocuments = (args: string[], setHistory: React.Dispatch<React.SetStateAction<string[]>>) => {
            setRisk(prev => prev * 2)

            if (args.length !== 2 || !names.includes(args[0])) {
                  setHistory(prev => [...prev, "ERROR: Usage - docs <username> <password>", `Risk detection: ${risk}%`])
                  return
            }

            const user = cases.get(args[0])
            if (!user || user.password !== args[1]) {
                  setHistory(prev => [...prev, "FAIL: Incorrect password", `Risk detection: ${risk}%`])
                  return
            }

            setHistory(prev => [
                  ...prev,
                  `Documents accessed for ${args[0]}:`,
                  ...user.docs.map(doc => `- ${doc}`),
                  user.docs.includes("Operation Thunder Shield")
                        ? "WARNING: TOP SECRET DOCUMENT DETECTED!"
                        : "",
                  `Risk detection: ${risk}%`,
                  ""
            ])
      }

      const handleTarget = (args: string[], setHistory: React.Dispatch<React.SetStateAction<string[]>>) => {
            setRisk(prev => prev * 2)

            if (args.length !== 1 || !names.includes(args[0])) {
                  setHistory(prev => [...prev, "ERROR: Usage - target <username>", `Risk detection: ${risk}%`])
                  return
            }

            const user = cases.get(args[0])
            if (!user) return

            setTargetUser(args[0])
            setHistory(prev => {
                  const newHistory = [
                        ...prev,
                        `Target locked: ${args[0]}`,
                        user.docs.includes("Operation Thunder Shield")
                              ? "CONGRATULATIONS! You found the secret document holder!"
                              : "This user doesn't have the secret document",
                        `Risk detection: ${risk}%`,
                        ""
                  ];

                  if (user.docs.includes("Operation Thunder Shield")) {
                        setWin(1);
                        setIsHacked(true)
                  }

                  return newHistory;
            })
      }

      const initialHistory = [
            "SECURITY TERMINAL v3.1.4",
            "",
            ">> MISSION OBJECTIVE:",
            "Find the user with the top secret document 'Operation Thunder Shield'",
            "",
            "Available commands:",
            "'scandb' - List all users with password hashes",
            "'crack <username>' - Brute force a user's password",
            "'docs <username> <password>' - Access user documents",
            "'target <username>' - Verify if user has secret document",
            "",
            "WARNING: Each action increases detection risk!",
            ""
      ]

      return (
            <Terminal
                  initialHistory={initialHistory}
                  customCommands={{
                        scandb: handleScanDb,
                        crack: handleCrackUser,
                        docs: handleGetDocuments,
                        target: handleTarget
                  }}
                  prompt="Obama>"
            />
      )
}

export default Obama