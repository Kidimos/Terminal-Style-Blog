import { TerminalLine, Theme } from '../types';
import { BLOG_POSTS } from '../constants';
import { BLOG_CONFIG } from '../config';

// 命令上下文：包含所有命令可能需要的依赖
export interface CommandContext {
    addLine: (type: TerminalLine['type'], content: string | React.ReactNode) => void;
    setTheme: (theme: Theme) => void;
    setIsLoading: (loading: boolean) => void;
    fetchPostContent: (slug: string) => Promise<string>;
    executeCommand: (cmd: string) => void;          // 用于在 JSX 中调用其他命令
    blogPosts: typeof BLOG_POSTS;
    blogConfig: typeof BLOG_CONFIG;
    theme: Theme;                                    // 当前主题值
    themeEnum: typeof Theme;
    clearHistory: () => void;
    helpText: string;
}

// 命令函数类型
export type CommandFunction = (args: string[], context: CommandContext) => void | Promise<void>;

// 统一导出所有命令（注意扩展名 .tsx 会自动处理）
export { helpCommand } from './help';
export { clearCommand } from './clear';
export { themeCommand } from './theme';
export { lsCommand } from './ls';
export { treeCommand } from './tree';
export { catCommand } from './cat';
export { whoamiCommand } from './whoami';
