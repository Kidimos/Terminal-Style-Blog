import React, { useRef } from 'react';
import { useConfig } from '../hooks/useConfig';
import { useStyles } from '../hooks/useStyles';

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const TerminalInput: React.FC<TerminalInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  inputRef: externalInputRef,
}) => {
  const localInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || localInputRef;
  const config = useConfig();
  const { get } = useStyles();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      onSubmit(value);
    }
  };

  const cursorLeft = `calc(${value.length}ch + 4px)`;
  const cursorDisplay = inputRef.current === document.activeElement ? 'block' : 'none';

  return (
    <footer className={get('terminal.input.wrapper')}>
      <div className={get('terminal.input.container')}>
        <span className={get('terminal.input.prompt')}>
          {config.site.prompt}:<span className={get('terminal.input.promptTilde')}>~</span>$
        </span>
        <div className={get('terminal.input.inputWrapper')}>
          <input
            ref={inputRef}
            type="text"
            className={get('terminal.input.input')}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={config.messages.ready}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            disabled={disabled}
          />
          {!disabled && (
            <div
              className={get('terminal.input.cursor')}
              style={{ left: cursorLeft, display: cursorDisplay }}
            ></div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default TerminalInput;
