"use client";

import { useAuthStore } from "@/shared/api/authStore";
import styles from "./styles.module.css";
import Terminal from "@/windows/system/terminal/Terminal";
import { useState } from "react";
import Router from 'next/router'

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { login, register, error } = useAuthStore();
  const [authData, setAuthData] = useState({
    username: "iqoiquwdiqwd",
    password: "qkwjdhqwkd "
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCommand = async (
    args: string[],
    setHistory: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (isProcessing) {
      setHistory((prev) => [...prev, ">> SYSTEM BUSY - PROCESSING REQUEST <<", ""]);
      return;
    }

    const command = args[0]?.toLowerCase();

    switch (command) {
      case "login":
        setMode("login");
        setHistory((prev) => [...prev, ">> AUTH MODE SET TO: LOGIN <<", ""]);
        break;

      case "register":
        setMode("register");
        setHistory((prev) => [...prev, ">> AUTH MODE SET TO: REGISTER <<", ""]);
        break;

      case "set":
        if (!args[1]) {
          setHistory((prev) => [
            ...prev,
            "ERROR: Missing field name",
            "Usage: set <field> <value>",
            "Available fields: username, password",
            ""
          ]);
          return;
        }

        const field = args[1].toLowerCase();
        const value = args.slice(2).join(" ");

        if (!["username", "password"].includes(field)) {
          setHistory((prev) => [
            ...prev,
            `ERROR: Invalid field '${field}'`,
            "Available fields: username, password",
            ""
          ]);
          return;
        }

        setAuthData((prev) => ({ ...prev, [field]: value }));
        setHistory((prev) => [
          ...prev,
          `>> ${field.toUpperCase()} SET TO: ${"*".repeat(value.length)} <<`,
          ""
        ]);
        break;

      case "submit":
        if (!authData.username) {
          setHistory((prev) => [...prev, "ERROR: Username not set", "Use: set username <value>", ""]);
          return;
        }

        if (!authData.password) {
          setHistory((prev) => [...prev, "ERROR: Password not set", "Use: set password <value>", ""]);
          return;
        }

        setIsProcessing(true);
        setHistory((prev) => [
          ...prev,
          ">> CONNECTING TO AUTH SERVER <<",
          ">> ENCRYPTING DATA STREAM <<",
          ">> VERIFYING CREDENTIALS <<"
        ]);

        try {
          if (mode === "login") {
            await login(authData.username, authData.password);
          } else {
            await register(authData.username, authData.password);
          }
          setHistory((prev) => [
            ...prev,
            `>> ${mode === "login" ? "LOGIN" : "REGISTRATION"} SUCCESSFUL <<`,
            ">> WELCOME TO THE SYSTEM <<",
            ""
          ]);
        } catch {
          setHistory((prev) => [
            ...prev,
            `>> ${mode.toUpperCase()} FAILED <<`,
            `ERROR: ${error || "Unknown error"}`,
            ""
          ]);
        } finally {
          setIsProcessing(false);
        }
        break;

      case "clear":
        setHistory([]);
        break;

      case "help":
        setHistory((prev) => [
          ...prev,
          "AVAILABLE COMMANDS:",
          "login       - Switch to login mode",
          "register    - Switch to register mode",
          "set <field> <value> - Set credential field",
          "           (fields: username, password)",
          "submit      - Submit credentials",
          "clear       - Clear terminal",
          "help        - Show this help",
          ""
        ]);
        break;

      default:
        setHistory((prev) => [
          ...prev,
          `ERROR: Unknown command '${command}'`,
          "Type 'help' for available commands",
          ""
        ]);
    }
  };

  const initialHistory = [
    "SECURE AUTH TERMINAL v4.2.0",
    "",
    ">> WARNING: UNAUTHORIZED ACCESS PROHIBITED <<",
    ">> ALL ACTIVITIES ARE LOGGED AND MONITORED <<",
    "",
    `Current mode: ${mode}`,
    "",
    "Enter credentials using the following commands:",
    "set username <your_username>",
    "set password <your_password>",
    "submit - to authenticate",
    "",
    "Type 'help' for available commands",
    ""
  ];

  return (
    <div className={styles.page}>
      <Terminal
        initialHistory={initialHistory}
        customCommands={{
          login: (args, setHistory) => handleCommand(["login", ...args], setHistory),
          register: (args, setHistory) => handleCommand(["register", ...args], setHistory),
          set: (args, setHistory) => handleCommand(["set", ...args], setHistory),
          submit: (args, setHistory) => handleCommand(["submit", ...args], setHistory),
          clear: (args, setHistory) => handleCommand(["clear", ...args], setHistory),
          help: (args, setHistory) => handleCommand(["help", ...args], setHistory)
        }}
        prompt="AUTH>"
      />
    </div>
  );
}
