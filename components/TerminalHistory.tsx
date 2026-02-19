import React from 'react';
import { TerminalLine } from '../types';
import { useStyles } from '../hooks/useStyles';
import { useConfig } from '../hooks/useConfig';

interface TerminalHistoryProps {
  history: TerminalLine[];
  isLoading: boolean;
}

const TerminalHistory: React.FC<TerminalHistoryProps> = ({ history, isLoading }) => {
  const { get } = useStyles();
  const config = useConfig();

  return (
    <div className={get('terminal.history')}>
      {history.map((line) => (
        <div key={line.id} className={get('animations.lineSlideIn')}>
          {line.type === 'input' ? (
            <div className={get('terminal.line.input')}>
              <span className={get('terminal.line.timestamp')}>
                [{line.timestamp.toLocaleTimeString([], { hour12: false })}]
              </span>
              <span className={get('terminal.line.content')}>{line.content}</span>
            </div>
          ) : line.type === 'error' ? (
            <div className={get('terminal.line.error')}>
              <span className={get('terminal.line.errorLabel')}>{config.messages.error}</span>
              <span>{line.content}</span>
            </div>
          ) : (
            <div className={get('terminal.line.output')}>{line.content}</div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className={get('terminal.loading.wrapper')}>
          <div className={get('terminal.loading.dots')}>
            <span className={get('terminal.loading.dot')}></span>
            <span className={`${get('terminal.loading.dot')} [animation-delay:-0.2s]`}></span>
            <span className={`${get('terminal.loading.dot')} [animation-delay:-0.4s]`}></span>
          </div>
          <span>{config.messages.loading}</span>
        </div>
      )}
      <div className={get('terminal.spacer')}></div>
    </div>
  );
};

export default TerminalHistory;
