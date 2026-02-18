
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TerminalLine, Theme, BlogPost, CategoryType } from './types';
import { BLOG_POSTS, HELP_TEXT, WELCOME_MESSAGE } from './constants';
import { BLOG_CONFIG } from './config';

const App: React.FC = () => {
    const [history, setHistory] = useState<TerminalLine[]>([
        { id: 'initial', type: 'system', content: <div className="text-xs md:text-sm font-bold opacity-80 whitespace-pre-wrap">{WELCOME_MESSAGE}</div>, timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [theme, setTheme] = useState<Theme>(BLOG_CONFIG.defaultTheme as Theme);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
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

    useEffect(() => {
        if (terminalRef.current && isAtBottom.current) {
            terminalRef.current.scrollTo({
                top: terminalRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [history, isLoading]);

    const handleTerminalClick = () => {
        if (window.getSelection()?.toString()) return;
        inputRef.current?.focus();
    };

    const addLine = useCallback((type: TerminalLine['type'], content: string | React.ReactNode) => {
        setHistory(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content,
            timestamp: new Date()
        }]);
    }, []);

    const fetchPostContent = async (slug: string): Promise<string> => {
        try {
            const response = await fetch(`./post/${slug}.md`);
            if (!response.ok) throw new Error("File not found");
            return await response.text();
        } catch (e) {
            return "ERROR: Unable to retrieve source file from secure storage.";
        }
    };

    const handleCommand = async (command: string) => {
        const trimmed = command.trim();
        const [cmd, ...args] = trimmed.split(' ');
        const normalizedCmd = cmd.toLowerCase();

        addLine('input', `${BLOG_CONFIG.prompt}:~$ ${command}`);
        if (!normalizedCmd) return;
        isAtBottom.current = true;

        switch (normalizedCmd) {
            case 'help':
                addLine('system', HELP_TEXT);
                break;

            case 'ls':
                const catArg = args[0] ? args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase() : null;
                if (!catArg) {
                    addLine('output', (
                        <div className="flex flex-wrap gap-6 my-2">
                            {BLOG_CONFIG.categories.map(cat => (
                                <div key={cat} className="flex items-center gap-2 group cursor-pointer" onClick={() => handleCommand(`ls ${cat}`)}>
                                    <span className="text-current opacity-40">dir/</span>
                                    <span className="font-bold underline group-hover:bg-current group-hover:text-black transition-colors">{cat}</span>
                                </div>
                            ))}
                        </div>
                    ));
                } else {
                    const filtered = BLOG_POSTS.filter(p => p.category === catArg);
                    if (filtered.length === 0) {
                        addLine('error', `Directory '${catArg}' not found.`);
                    } else {
                        addLine('output', (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
                                {filtered.map(post => (
                                    <div key={post.slug} className="border border-current/20 p-4 bg-white/5 rounded-sm hover:border-current/60 transition-all cursor-pointer group" onClick={() => handleCommand(`cat ${post.slug}`)}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-inherit font-black uppercase text-[10px] tracking-widest">{post.section}</span>
                                            <span className="text-[10px] opacity-40 italic">{post.date}</span>
                                        </div>
                                        <p className="font-bold text-sm mb-2 underline">{post.title}</p>
                                        <p className="text-[10px] opacity-60 leading-snug">{post.summary}</p>
                                    </div>
                                ))}
                            </div>
                        ));
                    }
                }
                break;

            case 'tree':
                const structure: Record<string, Record<string, string[]>> = {};
                BLOG_POSTS.forEach(p => {
                    if (!structure[p.category]) structure[p.category] = {};
                    if (!structure[p.category][p.section]) structure[p.category][p.section] = [];
                    structure[p.category][p.section].push(p.slug);
                });
                addLine('output', (
                    <div className="my-2 space-y-1 text-sm">
                        <p className="font-bold">.</p>
                        {Object.entries(structure).map(([cat, sections]) => (
                            <div key={cat} className="pl-4">
                                <p>├── <span className="text-current font-bold">{cat}</span></p>
                                {Object.entries(sections).map(([sec, slugs], idx, arr) => (
                                    <div key={sec} className="pl-4">
                                        <p>{idx === arr.length - 1 ? '└──' : '├──'} <span className="opacity-70">{sec}</span></p>
                                        {slugs.map((slug, sIdx) => (
                                            <p key={slug} className="pl-8 text-xs opacity-50">
                                                {sIdx === slugs.length - 1 ? '└──' : '├──'} {slug}.md
                                            </p>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ));
                break;

            case 'cat':
                const target = args[0];
                if (!target) {
                    addLine('error', "Usage: cat [slug].");
                    break;
                }
                const postMeta = BLOG_POSTS.find(p => p.slug === target);
                if (postMeta) {
                    setIsLoading(true);
                    const content = await fetchPostContent(target);
                    setIsLoading(false);
                    addLine('output', (
                        <div className={`max-w-4xl my-12 mx-auto border border-current/10 bg-black/40 p-6 md:p-12 lg:p-16 markdown-content shadow-2xl relative overflow-hidden rounded-lg theme-${theme}`}>
                            <div className="absolute top-0 right-0 p-3 text-[10px] opacity-30 select-none font-bold tracking-tighter">SECURE_FS // {target}.md</div>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content}
                            </ReactMarkdown>
                            <div className="mt-16 pt-8 border-t border-current/20 flex flex-col sm:flex-row justify-between items-center text-[10px] opacity-40 gap-4">
                                <div className="flex gap-4">
                                    <span>AUTHOR: {BLOG_CONFIG.author}</span>
                                    <span>TIMESTAMP: {postMeta.date}</span>
                                </div>
                                <span>END_OF_TRANSMISSION // CRC_OK</span>
                            </div>
                        </div>
                    ));
                } else {
                    addLine('error', `File '${target}' not located in /post/ registry.`);
                }
                break;


            case 'clear':
                setHistory([]);
                break;

            case 'theme':
                const requestedTheme = args[0] as Theme;
                if (Object.values(Theme).includes(requestedTheme)) {
                    setTheme(requestedTheme);
                    addLine('system', `Environment recalibrated to ${requestedTheme.toUpperCase()} mode.`);
                } else {
                    addLine('error', `Invalid profile. Registered: ${Object.values(Theme).join(', ')}`);
                }
                break;

            case 'whoami':
                addLine('output', (
                    <div className="my-8 p-8 border-2 border-current flex flex-col md:flex-row items-center gap-12 bg-current/5 max-w-5xl">
                        <img
                            src={BLOG_CONFIG.avatarUrl}
                            alt={BLOG_CONFIG.author}
                            className="w-40 h-40 object-cover border-2 border-current rounded-sm shadow-[0_0_20px_rgba(var(--current-rgb),0.5)] grayscale hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="space-y-4 flex-1 text-left">
                            <h2 className="text-3xl font-black underline italic tracking-tight uppercase">ACCESS_ID: {BLOG_CONFIG.author}</h2>
                            <p className="text-lg opacity-90 font-bold">{BLOG_CONFIG.title}</p>
                            <div className="flex flex-wrap gap-4 text-xs">
                                <span className="bg-current text-black px-3 py-1 font-bold tracking-widest">MODULAR_UX</span>
                                <span className="bg-current text-black px-3 py-1 font-bold tracking-widest">TYPESCRIPT_LTS</span>
                                <span className="bg-current text-black px-3 py-1 font-bold tracking-widest">NEURAL_CSS</span>
                            </div>
                            <p className="text-xs opacity-60 mt-6 leading-relaxed border-l border-current/30 pl-4 italic">
                                "{BLOG_CONFIG.bio}"
                            </p>
                        </div>
                    </div>
                ));
                break;

            default:
                addLine('error', `Unknown command: '${normalizedCmd}'. Access 'help' for directory.`);
        }
    };

    const themeClasses = {
        [Theme.Matrix]: 'bg-black text-green-500 [--current-rgb:34,197,94] selection:bg-green-500/20',
        [Theme.Amber]: 'bg-black text-amber-500 [--current-rgb:245,158,11] selection:bg-amber-500/20',
        [Theme.Modern]: 'bg-[#060a0f] text-cyan-400 [--current-rgb:34,211,238] selection:bg-cyan-400/20',
        [Theme.Cyberpunk]: 'bg-black text-fuchsia-500 [--current-rgb:217,70,239] selection:bg-fuchsia-500/20',
    };

    return (
        <div className={`h-screen w-full flex flex-row font-mono relative overflow-hidden transition-colors duration-500 ${themeClasses[theme]}`} onClick={handleTerminalClick}>

            {/* Sidebar Dashboard */}
            <aside className="hidden lg:flex w-[480px] border-r border-current/10 flex-col p-10 space-y-12 select-none z-30 bg-black/50 backdrop-blur-xl overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                    <pre className="text-[6px] xl:text-[9px] leading-[1.1] text-current font-black opacity-100 mb-6">
                        {BLOG_CONFIG.asciiLogo}
                    </pre>
                </div>

                <div className="flex items-center gap-6 p-4 border border-current/20 bg-current/5 rounded-sm">
                    <img
                        src={BLOG_CONFIG.avatarUrl}
                        alt={BLOG_CONFIG.author}
                        className="w-20 h-20 object-cover border border-current opacity-80 flex-shrink-0 shadow-[0_0_15px_rgba(var(--current-rgb),0.3)] grayscale hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-xl font-black truncate">{BLOG_CONFIG.author}</p>
                        <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest truncate">{BLOG_CONFIG.title}</p>
                        <p className="text-[9px] opacity-40 mt-1 line-clamp-2 leading-tight italic">"{BLOG_CONFIG.bio}"</p>
                    </div>
                </div>

                <div className="space-y-12 flex-1">
                    <div className="space-y-3">
                        <p className="text-sm opacity-40 uppercase font-black tracking-widest border-b-2 border-current/10 pb-1">Master Clock</p>
                        <p className="text-6xl font-black tracking-tighter leading-none">{currentTime.toLocaleTimeString([], { hour12: false })}</p>
                        <p className="text-lg font-bold opacity-60 tracking-widest mt-1">{currentTime.toDateString().toUpperCase()}</p>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm opacity-40 uppercase font-black tracking-widest border-b-2 border-current/10 pb-1">Catalog // 目录</p>
                        <div className="grid grid-cols-2 gap-y-3 pt-2">
                            {BLOG_CONFIG.categories.map(cat => (
                                <div key={cat} className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors" onClick={() => handleCommand(`ls ${cat}`)}>
                                    <span className="text-xs opacity-40 group-hover:opacity-100 group-hover:animate-pulse">▸</span>
                                    <span className="text-base font-black underline uppercase tracking-tighter">{cat}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black mt-6 pt-4 border-t border-current/5">
                            <span className="text-green-500 animate-pulse text-lg">●</span>
                            <span className="tracking-widest opacity-60 uppercase">{BLOG_CONFIG.location}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-sm opacity-40 uppercase font-black tracking-widest border-b-2 border-current/10 pb-1">Kernel Analytics</p>
                        <div className="space-y-6 pt-2">
                            <div>
                                <div className="flex justify-between text-xs mb-2 font-black tracking-widest"><span>CPU_LOAD</span><span>52.4%</span></div>
                                <div className="w-full bg-current/10 h-2.5 rounded-full overflow-hidden"><div className="bg-current h-full w-[52%] animate-[width_2s_ease-out]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-2 font-black tracking-widest"><span>NEURAL_BUS</span><span>{BLOG_CONFIG.systemStatus.ram}</span></div>
                                <div className="w-full bg-current/10 h-2.5 rounded-full overflow-hidden"><div className="bg-current h-full w-[24%] animate-[width_2s_ease-out]"></div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t-2 border-current/10 text-[11px] opacity-40 font-black space-y-2 uppercase tracking-widest">
                    <p>&copy; {new Date().getFullYear()} {BLOG_CONFIG.name}_SYSTEMS</p>
                    <p>AUTHORIZED_OPERATOR_ONLY</p>
                </div>
            </aside>

            <main className="flex-1 flex flex-col relative min-w-0">
                <header className="flex items-center justify-between px-10 py-5 text-xs border-b border-current/10 bg-black/60 backdrop-blur-md z-20">
                    <div className="flex gap-10 font-black uppercase tracking-[0.2em]">
                        <span className="lg:hidden text-current text-lg font-black">{BLOG_CONFIG.name}</span>
                        <span className="opacity-40">Session: TTY01</span>
                        <span className="hidden sm:inline opacity-40">Mode: Read/Write</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="lg:hidden font-black text-base">{currentTime.toLocaleTimeString([], { hour12: false })}</span>
                        <span className="bg-current text-black px-4 py-1.5 font-black rounded-sm shadow-[0_0_15px_rgba(var(--current-rgb),0.4)] tracking-widest">UPLINK_ENCRYPTED</span>
                    </div>
                </header>

                <section
                    ref={terminalRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto terminal-scroll-area custom-scrollbar p-10 md:p-14 lg:p-20 min-h-0"
                >
                    <div className="w-full space-y-6 text-left">
                        {history.map((line) => (
                            <div key={line.id} className="line-slide-in">
                                {line.type === 'input' ? (
                                    <div className="flex gap-4 items-center">
                                        <span className="font-bold opacity-30 whitespace-nowrap text-sm tracking-tighter">[{line.timestamp.toLocaleTimeString([], { hour12: false })}]</span>
                                        <span className="font-black text-sm md:text-base tracking-tight">{line.content}</span>
                                    </div>
                                ) : line.type === 'error' ? (
                                    <div className="text-red-500/90 border-l-4 border-red-500 pl-8 py-5 my-6 text-base bg-red-500/5 rounded-r-md font-bold">
                                        <span className="font-black mr-4 tracking-[0.2em] uppercase">[System_Fault]</span>
                                        <span>{line.content}</span>
                                    </div>
                                ) : (
                                    <div className="opacity-90 leading-relaxed text-base font-medium">{line.content}</div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-5 text-sm font-black tracking-[0.4em] opacity-40 pt-10 line-slide-in italic">
                                <div className="flex gap-2">
                                    <span className="w-2 h-2 bg-current animate-bounce"></span>
                                    <span className="w-2 h-2 bg-current animate-bounce [animation-delay:-0.2s]"></span>
                                    <span className="w-2 h-2 bg-current animate-bounce [animation-delay:-0.4s]"></span>
                                </div>
                                <span>ACCESSING_DATA_BANKS...</span>
                            </div>
                        )}
                        <div className="h-32 w-full"></div>
                    </div>
                </section>

                <footer className="px-10 py-10 md:px-14 lg:px-20 border-t border-current/10 bg-black/80 backdrop-blur-2xl z-20">
                    <div className="w-full flex items-center gap-4">
                        <span className="font-black text-sm md:text-base whitespace-nowrap text-current tracking-tighter">
                            {BLOG_CONFIG.prompt}:<span className="opacity-40">~</span>$
                        </span>
                        <div className="relative flex-1">
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-sm md:text-base font-black caret-transparent placeholder:opacity-10 tracking-tight"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isLoading) {
                                        handleCommand(inputValue);
                                        setInputValue('');
                                    }
                                }}
                                placeholder="READY_FOR_COMMAND..."
                                autoFocus
                                spellCheck={false}
                                autoComplete="off"
                                disabled={isLoading}
                            />
                            {!isLoading && (
                                <div
                                    className="absolute top-[2px] bottom-[2px] w-2.5 bg-current opacity-80 cursor-blink pointer-events-none shadow-[0_0_12px_rgba(var(--current-rgb),0.8)]"
                                    style={{ left: `calc(${inputValue.length}ch + 4px)`, display: inputRef.current === document.activeElement ? 'block' : 'none' }}
                                ></div>
                            )}
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default App;
