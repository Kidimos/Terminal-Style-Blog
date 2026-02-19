import React from 'react';

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
  position?: 'left' | 'right';
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({
  isCollapsed,
  onToggle,
  position = 'left',
}) => {
  const isLeft = position === 'left';

  return (
    <button
      onClick={onToggle}
      className={`
        absolute ${isLeft ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2
        w-6 h-16 flex items-center justify-center
        bg-current/10 hover:bg-current/20 
        cursor-pointer transition-all duration-300 z-40
        group
      `}
      aria-label={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
    >
      <span
        className={`
          text-current opacity-60 group-hover:opacity-100
          transition-transform duration-300 text-xs
          ${isCollapsed ? (isLeft ? 'rotate-180' : 'rotate-0') : (isLeft ? 'rotate-0' : 'rotate-180')}
        `}
      >
        ◀
      </span>
    </button>
  );
};

export default SidebarToggle;
