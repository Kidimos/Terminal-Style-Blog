import React from 'react';
import { useLayoutConfig, useConfig } from '../../hooks/useConfig';
import { useStyles } from '../../hooks/useStyles';
import type { Theme } from '../../types/config';

interface LayoutContainerProps {
  children: React.ReactNode;
  theme: Theme;
  className?: string;
}

const LayoutContainer: React.FC<LayoutContainerProps> = ({ children, theme, className = '' }) => {
  const config = useConfig();
  const layoutConfig = useLayoutConfig(config.layout.preset);
  const { get, theme: getThemeClass } = useStyles();

  const themeClass = getThemeClass(theme);
  const baseClass = get('base.container');
  const sidebarPosition = layoutConfig.sidebarPosition;
  const sidebarWidth = layoutConfig.sidebarWidth;

  const isReversed = sidebarPosition === 'right';

  const childrenArray = React.Children.toArray(children);
  const sidebarElement = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === LayoutSidebar
  );
  const mainElement = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === LayoutMain
  );

  return (
    <div className={`${baseClass} ${themeClass} ${isReversed ? 'flex-row-reverse' : ''} ${className}`.trim()}>
      {layoutConfig.sidebarVisible && sidebarElement && (
        <div style={{ width: `${sidebarWidth}px` }}>{sidebarElement}</div>
      )}
      {mainElement}
    </div>
  );
};

interface LayoutSidebarProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const LayoutSidebar: React.FC<LayoutSidebarProps> = ({
  children,
  className = '',
  style = {},
}) => {
  const { get } = useStyles();
  const sidebarClass = get('sidebar.root');

  return (
    <aside className={`${sidebarClass} ${className}`.trim()} style={style}>
      {children}
    </aside>
  );
};

interface LayoutMainProps {
  children: React.ReactNode;
  className?: string;
}

export const LayoutMain: React.FC<LayoutMainProps> = ({ children, className = '' }) => {
  return (
    <main className={`flex-1 flex flex-col relative min-w-0 ${className}`.trim()}>
      {children}
    </main>
  );
};

export default LayoutContainer;
