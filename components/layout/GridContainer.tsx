import React from 'react';

interface GridContainerProps {
  children: React.ReactNode;
  cols?: number | string;
  rows?: number | string;
  gap?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const GridContainer: React.FC<GridContainerProps> = ({
  children,
  cols = 1,
  rows,
  gap,
  className = '',
  style = {},
}) => {
  const colsClass = typeof cols === 'number' ? `grid-cols-${cols}` : cols;
  const rowsClass = rows ? (typeof rows === 'number' ? `grid-rows-${rows}` : rows) : '';
  const gapClass = gap !== undefined ? `gap-${gap}` : '';

  return (
    <div
      className={`grid ${colsClass} ${rowsClass} ${gapClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
};

export default GridContainer;
