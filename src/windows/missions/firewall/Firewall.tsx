import { useMissionStore } from "@/shared/api/missionStore";
import Terminal from "@/windows/system/terminal/Terminal";
import { FC, useEffect, useState } from "react";

function generateEnhancedLogs() {
    const internalIPs = Array.from({ length: 30 }, () =>
        `192.168.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`
    );

    const externalIPs = Array.from({ length: 10 }, () =>
        `${Math.floor(Math.random() * 253) + 1}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`
    );

    const hackerIP = `10.0.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`;
    const hackerUsername = `user${Math.floor(Math.random() * 1000)}`;

    const logs = [];
    const normalPorts = [80, 443, 22, 3389, 8080, 21, 25, 53, 110, 143];
    const suspiciousPorts = [31337, 666, 12345, 54321, 9999, 4444, 6969];
    const protocols = ['TCP', 'UDP', 'ICMP'];
    const actions = ['CONNECTED', 'DISCONNECTED', 'AUTH_FAIL', 'SCAN_DETECTED'];

    for (let i = 0; i < 150; i++) {
        const isInternal = Math.random() > 0.3;
        const ip = isInternal
            ? internalIPs[Math.floor(Math.random() * internalIPs.length)]
            : externalIPs[Math.floor(Math.random() * externalIPs.length)];

        const port = normalPorts[Math.floor(Math.random() * normalPorts.length)];
        const protocol = protocols[Math.floor(Math.random() * protocols.length)];
        const action = actions[Math.floor(Math.random() * 3)]; 
        const time = new Date(Date.now() - Math.random() * 86400000).toISOString().replace("T", " ").slice(0, 19);

        const userAgents = [
            'Mozilla/5.0',
            'curl/7.68.0',
            'PostmanRuntime/7.26.8',
            'python-requests/2.25.1'
        ];
        const agent = userAgents[Math.floor(Math.random() * userAgents.length)];

        logs.push(`${time} | IP: ${ip} | PORT: ${port} | PROTO: ${protocol} | ACTION: ${action} | AGENT: ${agent}`);
    }

    for (let i = 0; i < 15; i++) {
        const time = new Date(Date.now() - Math.random() * 3600000).toISOString().replace("T", " ").slice(0, 19);
        const port = i % 3 === 0
            ? normalPorts[Math.floor(Math.random() * normalPorts.length)] 
            : suspiciousPorts[Math.floor(Math.random() * suspiciousPorts.length)];

        const protocol = protocols[Math.floor(Math.random() * protocols.length)];
        const action = i % 4 === 0 ? 'CONNECTED' : 'SCAN_DETECTED';

        const hackerAgents = [
            'Mozilla/5.0 (compatible; Googlebot/2.1)',
            'sqlmap/1.5.12',
            'nmap scripting engine',
            'hydra v9.3'
        ];
        const agent = hackerAgents[Math.floor(Math.random() * hackerAgents.length)];

        logs.push(`${time} | IP: ${hackerIP} | PORT: ${port} | PROTO: ${protocol} | ACTION: ${action} | AGENT: ${agent} ${i % 2 === 0 ? '| USER: ' + hackerUsername : ''}`);
    }

    const mixedLogs = logs.sort(() => Math.random() - 0.5);

    for (let i = 0; i < 5; i++) {
        const fakeIp = internalIPs[Math.floor(Math.random() * internalIPs.length)];
        const time = new Date(Date.now() - Math.random() * 86400000).toISOString().replace("T", " ").slice(0, 19);
        mixedLogs.push(`${time} | IP: ${fakeIp} | PORT: ${suspiciousPorts[i]} | PROTO: TCP | ACTION: CONNECTED | AGENT: Mozilla/5.0`);
    }

    return mixedLogs;
}

const EnhancedHackerInvestigation: FC = () => {
    const { setWin } = useMissionStore();
    const [logs, setLogs] = useState<string[]>([]);
    const [hackerIP, setHackerIP] = useState("");
    const [hackerUsername, setHackerUsername] = useState("");
    const [isSolved, setIsSolved] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [hints, setHints] = useState<string[]>([]);

    useEffect(() => {
        const generatedLogs = generateEnhancedLogs();
        setLogs(generatedLogs);

        const hackerEntries = generatedLogs.filter(entry =>
            entry.includes('sqlmap') ||
            entry.includes('nmap') ||
            entry.includes('hydra') ||
            (entry.includes('31337') && !entry.includes('192.168.'))
        );

        if (hackerEntries.length > 0) {
            const firstEntry = hackerEntries[0];
            const ipMatch = firstEntry.match(/IP: (\S+)/);
            const userMatch = firstEntry.match(/USER: (\S+)/);

            if (ipMatch) setHackerIP(ipMatch[1]);
            if (userMatch) setHackerUsername(userMatch[1]);
        } else {
            setHackerIP("10.0.5.23");
            setHackerUsername("user428");
        }
    }, []);

    const handleAnalyzeCommand = (args: string[], setHistory: React.Dispatch<React.SetStateAction<string[]>>) => {
        const showAll = args[0] === 'full';
        const logCount = showAll ? 50 : 20;

        setHistory(prev => [
            ...prev,
            showAll
                ? ">> FULL NETWORK TRAFFIC DUMP <<"
                : ">> RECENT NETWORK ACTIVITY <<",
            ...logs.slice(0, logCount),
            "",
            `Showing ${logCount} of ${logs.length} records`,
            showAll ? "" : "Use 'analyze full' for complete logs",
            ">> USE 'filter <IP>' TO CHECK SPECIFIC IP",
            ">> USE 'search <keyword>' TO FIND PATTERNS",
            ""
        ]);
    };

    const handleFilterCommand = (args: string[], setHistory: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (!args[0]) {
            setHistory(prev => [...prev, "ERROR: No filter criteria provided", "Usage: filter <IP|PORT|USER>", ""]);
            return;
        }

        const filteredLogs = logs.filter(log =>
            log.includes(args[0]) ||
            (args[0] === "hacker" && (log.includes('sqlmap') || log.includes('nmap')))
        );

        setHistory(prev => [
            ...prev,
            `>> FILTERED LOGS FOR: ${args[0]}`,
            ...filteredLogs.slice(0, 20),
            filteredLogs.length > 20 ? `...and ${filteredLogs.length - 20} more` : "",
            ""
        ]);

        if (attempts >= 3 && !hints.includes('agent')) {
            setHints(prev => [...prev, 'agent']);
            setHistory(prev => [
                ...prev,
                "HINT: Try searching for unusual user agents",
                ""
            ]);
        }
    };

    const handleSearchCommand = (args: string[], setHistory: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (!args[0]) {
            setHistory(prev => [...prev, "ERROR: No search term provided", "Usage: search <keyword>", ""]);
            return;
        }

        const keywords = args[0].toLowerCase();
        const results = logs.filter(log =>
            log.toLowerCase().includes(keywords) ||
            (keywords === 'scan' && log.includes('SCAN_DETECTED')) ||
            (keywords === 'attack' && (log.includes('sqlmap') || log.includes('hydra')))
        );

        setHistory(prev => [
            ...prev,
            `>> SEARCH RESULTS FOR: ${args[0]}`,
            ...results.slice(0, 15),
            results.length > 15 ? `...and ${results.length - 15} more` : "",
            results.length === 0 ? "No matching entries found" : "",
            ""
        ]);

        if (attempts >= 5 && !hints.includes('ports')) {
            setHints(prev => [...prev, 'ports']);
            setHistory(prev => [
                ...prev,
                "HINT: Check for connections to unusual ports like 31337",
                ""
            ]);
        }
    };

    const handleBlockCommand = (args: string[], setHistory: React.Dispatch<React.SetStateAction<string[]>>) => {
        setAttempts(prev => prev + 1);

        if (isSolved) {
            setHistory(prev => [...prev, ">> HACKER ALREADY BLOCKED <<", ""]);
            return;
        }

        if (!args[0]) {
            setHistory(prev => [...prev, "ERROR: No target specified", "Usage: block <IP|USERNAME>", ""]);
            return;
        }

        if (args[0] === hackerIP || args[0] === hackerUsername) {
            setIsSolved(true);
            setWin(1);
            setHistory(prev => [
                ...prev,
                ">> SECURITY ALERT <<",
                `>> TARGET ${args[0]} IDENTIFIED AS MALICIOUS <<`,
                ">> DEPLOYING COUNTERMEASURES <<",
                "",
                "Analyzing attack pattern...",
                `Found ${logs.filter(l => l.includes(hackerIP)).length} malicious activities`,
                `Associated username: ${hackerUsername || 'unknown'}`,
                "",
                ">> FIREWALL RULES UPDATED <<",
                ">> SYSTEM SECURED <<",
                "",
                "Mission accomplished! The hacker has been neutralized.",
                ""
            ]);
        } else {
            setHistory(prev => [
                ...prev,
                ">> BLOCK FAILED <<",
                "ERROR: Insufficient evidence for this target",
                attempts >= 3 ? "HINT: Look for patterns across multiple logs" : "",
                ""
            ]);
        }
    };

    const handleHintCommand = (args: string[], setHistory: React.Dispatch<React.SetStateAction<string[]>>) => {
        const availableHints = [
            "Try searching for scanning activity with 'search scan'",
            "Look for connections to unusual ports (31337, 666, etc.)",
            "Check user agents for hacking tools like sqlmap or nmap",
            `The hacker's IP starts with ${hackerIP.split('.')[0]}.${hackerIP.split('.')[1]}.x.x`
        ];

        const hint = availableHints[Math.floor(Math.random() * availableHints.length)];
        setHistory(prev => [...prev, ">> INVESTIGATION HINT <<", hint, ""]);
    };

    const initialHistory = [
        "SECURITY TERMINAL v3.4.1",
        "",
        ">> UNAUTHORIZED INTRUSION DETECTED <<",
        ">> MULTIPLE EXPLOIT ATTEMPTS RECORDED <<",
        "",
        "A skilled hacker has breached perimeter defenses.",
        "Your mission: identify and block the attacker.",
        "",
        "Available commands:",
        "'analyze' - show recent network activity",
        "'analyze full' - show complete traffic logs",
        "'filter <criteria>' - filter logs by IP, port or user",
        "'search <keyword>' - search logs for specific patterns",
        "'block <target>' - block identified attacker",
        "'hint' - get investigation help",
        ""
    ];

    return (
        <Terminal
            initialHistory={initialHistory}
            customCommands={{
                analyze: handleAnalyzeCommand,
                filter: handleFilterCommand,
                search: handleSearchCommand,
                block: handleBlockCommand,
                hint: handleHintCommand
            }}
            prompt="INVESTIGATION>"
        />
    );
};

export default EnhancedHackerInvestigation;