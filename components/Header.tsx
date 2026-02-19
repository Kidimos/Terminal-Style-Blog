import React from 'react';
import { useConfig } from '../hooks/useConfig';
import { useStyles } from '../hooks/useStyles';
import type { HeaderSection as HeaderSectionType } from '../types/config';

interface HeaderSectionProps {
  type: HeaderSectionType;
  currentTime: Date;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ type, currentTime }) => {
  const config = useConfig();
  const { get } = useStyles();

  switch (type) {
    case 'brand':
      return <span className={get('header.brand')}>{config.site.name}</span>;

    case 'session':
      return <span className={get('header.session')}>Session: TTY01</span>;

    case 'status':
      return (
        <span className={get('header.status')}>UPLINK_ENCRYPTED</span>
      );

    default:
      return null;
  }
};

interface HeaderProps {
  currentTime: Date;
}

const Header: React.FC<HeaderProps> = ({ currentTime }) => {
  const config = useConfig();
  const { get } = useStyles();

  if (!config.layout.components.header.visible) {
    return null;
  }

  return (
    <header className={get('header.root')}>
      <div className={get('header.left')}>
        {config.layout.components.header.sections.includes('brand') && (
          <HeaderSection type="brand" currentTime={currentTime} />
        )}
        {config.layout.components.header.sections.includes('session') && (
          <HeaderSection type="session" currentTime={currentTime} />
        )}
        <span className={get('header.mode')}>Mode: Read/Write</span>
      </div>
      <div className={get('header.right')}>
        <span className={get('header.time')}>
          {currentTime.toLocaleTimeString([], { hour12: false })}
        </span>
        {config.layout.components.header.sections.includes('status') && (
          <HeaderSection type="status" currentTime={currentTime} />
        )}
      </div>
    </header>
  );
};

export default Header;
