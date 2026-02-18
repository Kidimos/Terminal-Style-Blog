import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TerminalLine } from '../types';

interface TerminalHistoryProps {
    history: TerminalLine[];
    isLoading: boolean;
}

const TerminalHistory: React.FC<TerminalHistoryProps> = ({ history, isLoading }) => {
    return (
        <div className="w-full space-y-6 text-left">
            {history.map((line) => (
                <div key={line.id} className="line-slide-in">
                    {line.type === 'input' ? (
                        <div className="flex gap-4 items-center">
                            <span className="font-bold opacity-30 whitespace-nowrap text-sm tracking-tighter">
                                [{line.timestamp.toLocaleTimeString([], { hour12: false })}]
                            </span>
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
    );
};

export default TerminalHistory;
