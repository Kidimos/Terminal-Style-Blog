import React from 'react';
import { BLOG_CONFIG } from '../config';

interface HeaderProps {
    currentTime: Date;
}

const Header: React.FC<HeaderProps> = ({ currentTime }) => {
    return (
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
    );
};

export default Header;
