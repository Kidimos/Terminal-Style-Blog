import React, { useState, useCallback, useMemo } from 'react';
import { Theme } from '../types';
import { BLOG_POSTS, fetchPostContent, CATEGORIES } from '@/services/postService';
import { HELP_TEXT } from '../constants';
import { useConfig, useWelcomeMessage } from './useConfig';
import * as commandFns from '../commands';
import { CommandContext } from '../commands';

export function useTerminal(theme: Theme, setTheme: (theme: Theme) => void) {
  const config = useConfig();
  const welcomeMessage = useWelcomeMessage();
  
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'initial',
      type: 'system',
      content: (
        <div className="text-xs md:text-sm font-bold opacity-80 whitespace-pre-wrap">
          {' '}
          {welcomeMessage}{' '}
        </div>
      ),
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addLine = useCallback(
    (type: TerminalLine['type'], content: string | React.ReactNode) => {
      setHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          type,
          content,
          timestamp: new Date(),
        },
      ]);
    },
    []
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const executeCommand = useCallback(
    (cmd: string) => {
      handleCommand(cmd);
    },
    []
  );

  const commandContext: CommandContext = useMemo(
    () => ({
      addLine,
      setTheme,
      setIsLoading,
      fetchPostContent,
      executeCommand,
      blogPosts: BLOG_POSTS,
      blogConfig: { ...config.site, categories: CATEGORIES, systemStatus: config.systemStatus, defaultTheme: config.theme.default },
      theme,
      themeEnum: Theme,
      clearHistory,
      helpText: HELP_TEXT,
    }),
    [addLine, setTheme, setIsLoading, fetchPostContent, executeCommand, theme, clearHistory, config]
  );

  const handleCommand = useCallback(
    async (command: string) => {
      const trimmed = command.trim();
      const [cmd, ...args] = trimmed.split(' ');
      const normalizedCmd = cmd.toLowerCase();

      addLine('input', `${config.site.prompt}:~$ ${command}`);
      if (!normalizedCmd) return;

      const commandFn = (commandFns as any)[`${normalizedCmd}Command`];
      if (commandFn) {
        try {
          await commandFn(args, commandContext);
        } catch (error) {
          addLine('error', `Command '${normalizedCmd}' failed: ${String(error)}`);
        }
      } else {
        addLine('error', `Unknown command: '${normalizedCmd}'. Access 'help' for directory.`);
      }
    },
    [addLine, clearHistory, commandContext, config]
  );

  return {
    history,
    inputValue,
    setInputValue,
    isLoading,
    addLine,
    handleCommand,
  };
}

type TerminalLine = {
  id: string;
  type: 'input' | 'output' | 'system' | 'error';
  content: string | React.ReactNode;
  timestamp: Date;
};
