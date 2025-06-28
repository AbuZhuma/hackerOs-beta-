"use client"
import { useState, useRef, useEffect, KeyboardEvent } from "react"
import styles from "./styles.module.css"
import { FileSystemItem } from '@/shared/types';
import { useFstore } from "@/shared/api/fStore";
import { usePortStore } from "@/shared/api/portStore";

interface CommandHandler {
  (args: string[], setHistory: React.Dispatch<React.SetStateAction<string[]>>): void
}

interface TerminalProps {
  initialHistory?: string[]
  customCommands?: Record<string, CommandHandler>
  prompt?: string
}

const Terminal = ({
  initialHistory = [
    "██╗  ██╗ █████╗ ██╗  ██╗██╗  ██╗███████╗██████╗ ",
    "██║  ██║██╔══██╗██║ ██╔╝██║ ██╔╝██╔════╝██╔══██╗",
    "███████║███████║█████╔╝ █████╔╝ █████╗  ██████╔╝",
    "██╔══██║██╔══██║██╔═██╗ ██╔═██╗ ██╔══╝  ██╔══██╗",
    "██║  ██║██║  ██║██║  ██╗██║  ██╗███████╗██║  ██║",
    "╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝",
    "",
    "Type 'help' for available commands",
    ""
  ],
  customCommands = {},
  prompt = "$"
}: TerminalProps) => {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>(initialHistory)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { add, moveItem, updateFileContent, del, findItem } = useFstore.getState();
  const { ports, getPortFilesContent } = usePortStore.getState();
  const baseCommands: Record<string, CommandHandler> = {
    help: () => {
      setHistory(prev => [...prev, 
        "Available commands:",
        "  help - Show this help message",
        "  clear - Clear terminal",
        "  ls [path] - List directory contents",
        "  cat <file> - Show file content",
        "  mkdir <path> - Create directory",
        "  touch <file> - Create file",
        "  rm <path> - Remove file or directory",
        "  mv <src> <dest> - Move/rename item",
        "  edit <file> <content> - Edit file content",
        "  ports - List all ports",
        "  port-create <port> <title> <html> <css> <js> - Create new port",
        "  port-delete <port> - Delete port",
        "  port-files <port> - Show port files content",
        "  date - Show current date and time",
        "  echo <text> - Print text",
        "  whoami - Show current user",
        ...Object.keys(customCommands).map(cmd => `  ${cmd} - Custom command`),
        ""
      ])
    },
    
    clear: (_, setHistory) => {
      setHistory([])
    },
    
    ls: (args) => {
      const path = args[0] || "/";
      const item = findItem(path);
      
      if (!item) {
        setHistory(prev => [...prev, `ls: ${path}: No such file or directory`, ""]);
        return;
      }
      
      if (item.type !== 'folder') {
        setHistory(prev => [...prev, `ls: ${path}: Not a directory`, ""]);
        return;
      }
      
      const contents = item.children?.map(child => 
        `${child.type === 'folder' ? '📁' : '📄'} ${child.name}`
      ) || [];
      
      setHistory(prev => [...prev, `Contents of ${path}:`, ...contents, ""]);
    },
    
    cat: (args) => {
      if (!args[0]) {
        setHistory(prev => [...prev, "Usage: cat <file>", ""]);
        return;
      }
      
      const item = findItem(args[0]);
      
      if (!item) {
        setHistory(prev => [...prev, `cat: ${args[0]}: No such file`, ""]);
        return;
      }
      
      if (item.type !== 'file') {
        setHistory(prev => [...prev, `cat: ${args[0]}: Is a directory`, ""]);
        return;
      }
      
      setHistory(prev => [...prev, `Content of ${args[0]}:`, item.text || "<empty>", ""]);
    },
    
    mkdir: (args) => {
      if (!args[0]) {
        setHistory(prev => [...prev, "Usage: mkdir <path>", ""]);
        return;
      }
      const path = args[0].startsWith("/") ? args[0] : `/${args[0]}`;
      
      if (findItem(path)) {
        setHistory(prev => [...prev, `mkdir: ${path}: File or directory exists`, ""]);
        return;
      }
      
      const name = path.split("/").pop() || "new_folder";
      const parentPath = path.split("/").slice(0, -1).join("/") || "/";
      
      if (!findItem(parentPath)) {
        setHistory(prev => [...prev, `mkdir: ${parentPath}: No such directory`, ""]);
        return;
      }
      
      add({
        path,
        name,
        type: "folder",
        children: []
      });
      
      setHistory(prev => [...prev, `Created directory ${path}`, ""]);
    },
    
    touch: (args) => {
      if (!args[0]) {
        setHistory(prev => [...prev, "Usage: touch <file>", ""]);
        return;
      }
      
      const path = args[0].startsWith("/") ? args[0] : `/${args[0]}`;
      
      if (findItem(path)) {
        setHistory(prev => [...prev, `touch: ${path}: File exists`, ""]);
        return;
      }
      
      const name = path.split("/").pop() || "new_file";
      const parentPath = path.split("/").slice(0, -1).join("/") || "/";
      
      if (!findItem(parentPath)) {
        setHistory(prev => [...prev, `touch: ${parentPath}: No such directory`, ""]);
        return;
      }
      
      add({
        path,
        name,
        type: "file",
        children: [],
        text: ""
      });
      
      setHistory(prev => [...prev, `Created file ${path}`, ""]);
    },
    
    rm: (args) => {
      if (!args[0]) {
        setHistory(prev => [...prev, "Usage: rm <path>", ""]);
        return;
      }
      
      const path = args[0].startsWith("/") ? args[0] : `/${args[0]}`;
      
      if (!findItem(path)) {
        setHistory(prev => [...prev, `rm: ${path}: No such file or directory`, ""]);
        return;
      }
      
      if (path === "/") {
        setHistory(prev => [...prev, "rm: Cannot remove root directory", ""]);
        return;
      }
      
      del(path);
      setHistory(prev => [...prev, `Removed ${path}`, ""]);
    },
    
    mv: (args) => {
      if (args.length < 2) {
        setHistory(prev => [...prev, "Usage: mv <source> <destination>", ""]);
        return;
      }
      
      const source = args[0].startsWith("/") ? args[0] : `/${args[0]}`;
      const destination = args[1].startsWith("/") ? args[1] : `/${args[1]}`;
      
      if (!findItem(source)) {
        setHistory(prev => [...prev, `mv: ${source}: No such file or directory`, ""]);
        return;
      }
      
      moveItem(source, destination);
      setHistory(prev => [...prev, `Moved ${source} to ${destination}`, ""]);
    },
    
    edit: (args) => {
      if (args.length < 2) {
        setHistory(prev => [...prev, "Usage: edit <file> <content>", ""]);
        return;
      }
      
      const path = args[0].startsWith("/") ? args[0] : `/${args[0]}`;
      const content = args.slice(1).join(" ");
      
      if (!findItem(path)) {
        setHistory(prev => [...prev, `edit: ${path}: No such file`, ""]);
        return;
      }
      
      if (findItem(path)?.type !== 'file') {
        setHistory(prev => [...prev, `edit: ${path}: Is a directory`, ""]);
        return;
      }
      
      updateFileContent(path, content);
      setHistory(prev => [...prev, `Updated ${path}`, ""]);
    },
    
    ports: () => {
      if (Object.keys(ports).length === 0) {
        setHistory(prev => [...prev, "No ports configured", ""]);
        return;
      }
      
      const portList = Object.values(ports).map(port => 
        `Port ${port.port}: ${port.title} (HTML: ${port.htmlPath}, CSS: ${port.cssPath}, JS: ${port.jsPath})`
      );
      
      setHistory(prev => [...prev, "Active ports:", ...portList, ""]);
    },
    
    "port-create": (args) => {
      if (args.length < 5) {
        setHistory(prev => [...prev, "Usage: port-create <port> <title> <html> <css> <js>", ""]);
        return;
      }
      
      const port = parseInt(args[0]);
      if (isNaN(port)) {
        setHistory(prev => [...prev, "port-create: Port must be a number", ""]);
        return;
      }
      
      const { createPort } = usePortStore.getState();
      createPort(port, args[1], args[2], args[3], args[4]);
      setHistory(prev => [...prev, `Created port ${port} with title "${args[1]}"`, ""]);
    },
    
    "port-delete": (args) => {
      if (!args[0]) {
        setHistory(prev => [...prev, "Usage: port-delete <port>", ""]);
        return;
      }
      
      const port = parseInt(args[0]);
      if (isNaN(port)) {
        setHistory(prev => [...prev, "port-delete: Port must be a number", ""]);
        return;
      }
      
      const { deletePort, ports } = usePortStore.getState();
      if (!ports[port]) {
        setHistory(prev => [...prev, `port-delete: Port ${port} not found`, ""]);
        return;
      }
      
      deletePort(port);
      setHistory(prev => [...prev, `Deleted port ${port}`, ""]);
    },
    
    "port-files": async (args) => {
      if (!args[0]) {
        setHistory(prev => [...prev, "Usage: port-files <port>", ""]);
        return;
      }
      
      const port = parseInt(args[0]);
      if (isNaN(port)) {
        setHistory(prev => [...prev, "port-files: Port must be a number", ""]);
        return;
      }
      
      try {
        if (!ports[port]) {
          setHistory(prev => [...prev, `port-files: Port ${port} not found`, ""]);
          return;
        }
        
        const files = await getPortFilesContent(port);
        setHistory(prev => [
          ...prev, 
          `Files for port ${port}:`,
          "HTML:", files.html || "<empty>",
          "CSS:", files.css || "<empty>",
          "JS:", files.js || "<empty>",
          ""
        ]);
      } catch (error) {
        setHistory(prev => [...prev, `Error: ${error instanceof Error ? error.message : String(error)}`, ""]);
      }
    },
    
    date: () => {
      const now = new Date();
      setHistory(prev => [...prev, now.toString(), ""]);
    },
    
    echo: (args) => {
      setHistory(prev => [...prev, args.join(" "), ""]);
    },
    
    whoami: () => {
      setHistory(prev => [...prev, "user", ""]);
    }
  }

  const allCommands = { ...baseCommands, ...customCommands }

  const executeCommand = (command: string, args: string[]) => {
    const cmd = command.toLowerCase()
    
    if (allCommands[cmd]) {
      allCommands[cmd](args, setHistory)
    } else {
      setHistory(prev => [...prev, `Command not found: ${command}`, "Type 'help' for available commands", ""])
    }
  }

  const handleCommand = () => {
    if (!input.trim()) {
      setHistory(prev => [...prev, `${prompt} `, ""])
      setInput("")
      return
    }
    
    const [command, ...args] = input.trim().split(/\s+/)
    setHistory(prev => [...prev, `${prompt} ${input}`])
    
    executeCommand(command, args)
    setInput("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand()
    }
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight)
  }, [history])

  useEffect(() => {
    focusInput()
  }, [])

  return (
    <div className={styles.terminalContainer} onClick={focusInput}>
      <div className={styles.terminalBody} ref={terminalRef}>
        {history.map((line, index) => (
          <div key={index} className={styles.terminalLine}>
            {line.startsWith(prompt) ? (
              <>
                <span className={styles.prompt}>{prompt}</span>
                <span>{line.substring(prompt.length + 1)}</span>
              </>
            ) : (
              <span className={line ? styles.output : styles.emptyLine}>{line}</span>
            )}
          </div>
        ))}
        
        <div className={styles.inputLine}>
          <span className={styles.prompt}>{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.terminalInput}
            spellCheck={false}
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}

export default Terminal