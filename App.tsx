import React, { useState, useEffect, useRef } from 'react';
import { useTerminal } from './hooks/useTerminal';
import { useTheme } from './hooks/useTheme';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TerminalHistory from './components/TerminalHistory';
import TerminalInput from './components/TerminalInput';
import { themeClasses } from './constants/themeClasses';
import { BLOG_CONFIG } from './config';
import { Theme } from './types';

const AppTest: React.FC = () => {
    const { theme, setTheme } = useTheme(BLOG_CONFIG.defaultTheme as Theme);
    const { history, inputValue, setInputValue, isLoading, handleCommand } = useTerminal(theme, setTheme);
    const [currentTime, setCurrentTime] = useState(new Date());
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);  // 用于滚动容器
    const isAtBottom = useRef(true);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleScroll = () => {
        if (!terminalRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
        isAtBottom.current = scrollHeight - scrollTop - clientHeight < 100;
    };

    const onCommandSubmit = (cmd: string) => {
        handleCommand(cmd);
        setInputValue('');
    };

    const handleTerminalClick = () => {
        if (window.getSelection()?.toString) return;
        inputRef.current?.focus();
    };

    return (
        <div
            className={`h-screen w-full flex flex-row font-mono relative overflow-hidden transition-colors duration-500 ${themeClasses[theme]}`}  // 恢复原始类名
            onClick={handleTerminalClick}
        >
            <Sidebar currentTime={currentTime} theme={theme} onCategoryClick={(cat) => handleCommand(`ls ${cat}`)} />
            <main className="flex-1 flex flex-col relative min-w-0">
                <Header currentTime={currentTime} />
                {/* 恢复滚动容器 section */}
                <section
                    ref={terminalRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto terminal-scroll-area custom-scrollbar p-10 md:p-14 lg:p-20 min-h-0"
                >
                    <TerminalHistory history={history} isLoading={isLoading} />
                </section>
                <TerminalInput
                    value={inputValue}
                    onChange={setInputValue}
                    onSubmit={onCommandSubmit}
                    disabled={isLoading}
                    prompt={BLOG_CONFIG.prompt}
                    inputRef={inputRef}
                />
            </main>
        </div>
    );
};

export default AppTest;
