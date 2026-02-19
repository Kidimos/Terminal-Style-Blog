import React, { useState, useEffect, useRef } from 'react';

interface SidebarCollapsibleProps {
  title: string;
  defaultOpen?: boolean;
  storageKey?: string;
  children: React.ReactNode;
}

const SidebarCollapsible: React.FC<SidebarCollapsibleProps> = ({
  title,
  defaultOpen = true,
  storageKey,
  children,
}) => {
  const getInitialState = (): boolean => {
    if (storageKey) {
      const stored = localStorage.getItem(`sidebar-collapsed-${storageKey}`);
      if (stored !== null) {
        return stored === 'false';
      }
    }
    return defaultOpen;
  };

  const [isOpen, setIsOpen] = useState(getInitialState);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (storageKey) {
      localStorage.setItem(`sidebar-collapsed-${storageKey}`, String(!newState));
    }
  };

  return (
    <div className="space-y-3">
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={toggleOpen}
      >
        <p className="text-sm opacity-40 uppercase font-black tracking-widest border-b-2 border-current/10 pb-1 flex-1 group-hover:opacity-60 transition-opacity">
          {title}
        </p>
        <span
          className={`text-xs opacity-40 transition-transform duration-200 ml-2 ${
            isOpen ? 'rotate-0' : '-rotate-90'
          }`}
        >
          ▾
        </span>
      </div>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? contentHeight : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
};

export default SidebarCollapsible;
