import React, { useState, useEffect, useRef } from 'react';
import { useTerminal } from './hooks/useTerminal';
import { useTheme } from './hooks/useTheme';
import { useConfig, useLayoutConfig } from './hooks/useConfig';
import { useStyles } from './hooks/useStyles';
import { useSidebar } from './hooks/useSidebar';
import Sidebar from './components/Sidebar';
import SidebarToggle from './components/SidebarToggle';
import Header from './components/Header';
import TerminalHistory from './components/TerminalHistory';
import TerminalInput from './components/TerminalInput';
import { Theme } from './types';

const App: React.FC = () => {
  const config = useConfig();
  const layoutConfig = useLayoutConfig(config.layout.preset);
  const { theme, setTheme } = useTheme(config.theme.default as Theme);
  const { history, inputValue, setInputValue, isLoading, handleCommand } = useTerminal(
    theme,
    setTheme
  );
  const { get, theme: getThemeClass } = useStyles();
  const { isCollapsed, toggle: toggleSidebar } = useSidebar();
  const [currentTime, setCurrentTime] = useState(new Date());
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useRef(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAtBottom.current && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

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

  const themeClass = getThemeClass(theme);
  const baseClass = get('base.container');
  const isReversed = layoutConfig.sidebarPosition === 'right';

  return (
    <div
      className={`${baseClass} ${themeClass} ${isReversed ? 'flex-row-reverse' : ''}`}
      onClick={handleTerminalClick}
    >
      {layoutConfig.sidebarVisible && (
        <div className="relative">
          <Sidebar
            currentTime={currentTime}
            theme={theme}
            onCategoryClick={(cat) => handleCommand(`ls ${cat}`)}
            onTagClick={(tag) => handleCommand(`tags ${tag}`)}
            isCollapsed={isCollapsed}
          />
          <SidebarToggle
            isCollapsed={isCollapsed}
            onToggle={toggleSidebar}
            position={layoutConfig.sidebarPosition}
          />
        </div>
      )}
      <main className="flex-1 flex flex-col relative min-w-0">
        {layoutConfig.headerVisible && <Header currentTime={currentTime} />}
        <section
          ref={terminalRef}
          onScroll={handleScroll}
          className={get('terminal.section')}
        >
          <TerminalHistory history={history} isLoading={isLoading} />
        </section>
        {config.layout.components.terminal.visible && (
          <TerminalInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={onCommandSubmit}
            disabled={isLoading}
            inputRef={inputRef}
          />
        )}
      </main>
    </div>
  );
};

export default App;
