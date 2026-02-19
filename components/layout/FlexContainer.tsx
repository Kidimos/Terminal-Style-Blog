import React from 'react';

interface FlexContainerProps {
  children: React.ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: boolean;
  gap?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const justifyMap: Record<string, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const alignMap: Record<string, string> = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

const FlexContainer: React.FC<FlexContainerProps> = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  wrap = false,
  gap,
  className = '',
  style = {},
}) => {
  const directionClass = direction.startsWith('col') ? `flex-${direction}` : `flex-${direction}`;
  const justifyClass = justifyMap[justify] || '';
  const alignClass = alignMap[align] || '';
  const wrapClass = wrap ? 'flex-wrap' : '';
  const gapClass = gap !== undefined ? `gap-${gap}` : '';

  return (
    <div
      className={`flex ${directionClass} ${justifyClass} ${alignClass} ${wrapClass} ${gapClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
};

export default FlexContainer;
