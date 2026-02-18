import React, { useState, useCallback, useMemo } from 'react';
import { TerminalLine, Theme } from '../types';
import { BLOG_POSTS, HELP_TEXT, WELCOME_MESSAGE } from '../constants';
import { BLOG_CONFIG } from '../config';
import * as commandFns from '../commands';  // 导入所有命令（除了 clear）
import { CommandContext } from '../commands';

export function useTerminal(theme: Theme, setTheme: (theme: Theme) => void) {
    // 状态定义
    const [history, setHistory] = useState<TerminalLine[]>([
        {
            id: 'initial',
            type: 'system',
            content: <div className="text-xs md:text-sm font-bold opacity-80 whitespace-pre-wrap"> {WELCOME_MESSAGE} </div>,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 添加一行到历史
    const addLine = useCallback((type: TerminalLine['type'], content: string | React.ReactNode) => {
        setHistory(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content,
            timestamp: new Date()
        }]);
    }, []);

    // 清空历史（用于 clear 命令）
    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    // 获取文章内容
    const fetchPostContent = async (slug: string): Promise<string> => {
        try {
            const response = await fetch(`./post/${slug}.md`);
            if (!response.ok) throw new Error("File not found");
            return await response.text();
        } catch (e) {
            return "ERROR: Unable to retrieve source file from secure storage.";
        }
    };

    // 执行命令的函数，用于在 JSX 点击中调用（如 ls 中点击分类或文章）
    const executeCommand = useCallback((cmd: string) => {
        handleCommand(cmd);
    }, []);

    // 构建命令上下文，使用 useMemo 避免不必要的重建
    const commandContext: CommandContext = useMemo(() => ({
        addLine,
        setTheme,
        setIsLoading,
        fetchPostContent,
        executeCommand,
        blogPosts: BLOG_POSTS,
        blogConfig: BLOG_CONFIG,
        theme,
        themeEnum: Theme,
        clearHistory,   // 提供给 clear 命令使用（如果 clear 作为模块化命令）
        helpText: HELP_TEXT,
    }), [addLine, setTheme, setIsLoading, fetchPostContent, executeCommand, theme, clearHistory]);

    // 处理输入的命令
    const handleCommand = useCallback(async (command: string) => {
        const trimmed = command.trim();
        const [cmd, ...args] = trimmed.split(' ');
        const normalizedCmd = cmd.toLowerCase();

        // 总是先显示输入行
        addLine('input', `${BLOG_CONFIG.prompt}:~$ ${command}`);
        if (!normalizedCmd) return;

        // 根据命令名查找对应的命令函数（约定导出名为 xxxCommand）
        const commandFn = (commandFns as any)[`${normalizedCmd}Command`];
        if (commandFn) {
            try {
                // 执行命令，可能异步
                await commandFn(args, commandContext);
            } catch (error) {
                addLine('error', `Command '${normalizedCmd}' failed: ${String(error)}`);
            }
        } else {
            addLine('error', `Unknown command: '${normalizedCmd}'. Access 'help' for directory.`);
        }
    }, [addLine, clearHistory, commandContext]);

    // 返回需要暴露的状态和方法
    return {
        history,
        inputValue,
        setInputValue,
        isLoading,
        addLine,
        handleCommand,
    };
}
