import React, { useRef, useEffect } from 'react';

interface TerminalInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
    disabled?: boolean;
    prompt: string;
    inputRef?: React.RefObject<HTMLInputElement>; // 允许外部传入 ref，以便全局点击聚焦
}

const TerminalInput: React.FC<TerminalInputProps> = ({
    value,
    onChange,
    onSubmit,
    disabled = false,
    prompt,
    inputRef: externalInputRef,
}) => {
    const localInputRef = useRef<HTMLInputElement>(null);
    const inputRef = externalInputRef || localInputRef;

    // 确保父组件的点击事件能聚焦到输入框（父组件通过 handleTerminalClick 调用 inputRef.current?.focus()）
    // 这里不需要额外逻辑，因为 ref 会传递给父组件。

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !disabled) {
            onSubmit(value);
        }
    };

    return (
        <footer className="px-10 py-10 md:px-14 lg:px-20 border-t border-current/10 bg-black/80 backdrop-blur-2xl z-20">
            <div className="w-full flex items-center gap-4">
                <span className="font-black text-sm md:text-base whitespace-nowrap text-current tracking-tighter">
                    {prompt}:<span className="opacity-40">~</span>$
                </span>
                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-sm md:text-base font-black caret-transparent placeholder:opacity-10 tracking-tight"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="READY_FOR_COMMAND..."
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                        disabled={disabled}
                    />
                    {!disabled && (
                        <div
                            className="absolute top-[2px] bottom-[2px] w-2.5 bg-current opacity-80 cursor-blink pointer-events-none shadow-[0_0_12px_rgba(var(--current-rgb),0.8)]"
                            style={{ left: `calc(${value.length}ch + 4px)`, display: inputRef.current === document.activeElement ? 'block' : 'none' }}
                        ></div>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default TerminalInput;
