import React from 'react';
import { BLOG_CONFIG } from '../config';
import { Theme } from '../types';

interface SidebarProps {
    currentTime: Date;
    theme: Theme;
    onCategoryClick: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTime, theme, onCategoryClick }) => {
    return (
        <aside className="hidden lg:flex w-[480px] border-r border-current/10 flex-col p-10 space-y-12 select-none z-30 bg-black/50 backdrop-blur-xl overflow-y-auto custom-scrollbar">
            {/* 原有 aside 内的所有内容原样复制过来，注意替换 props 使用的地方 */}
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
                            <div key={cat} className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors" onClick={() => onCategoryClick(cat)}>
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
    );
};

export default Sidebar;
