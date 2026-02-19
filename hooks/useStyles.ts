import { useMemo } from 'react';
import { getStyles, getStyle, getThemeClass } from '../config/loader';

export function useStyles() {
  const styles = useMemo(() => getStyles(), []);

  const get = (path: string, fallback = ''): string => {
    const parts = path.split('.');
    let current: unknown = styles;

    for (const part of parts) {
      if (typeof current === 'object' && current !== null && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return fallback;
      }
    }

    return typeof current === 'string' ? current : fallback;
  };

  const theme = (name: string): string => {
    return getThemeClass(name);
  };

  return { styles, get, theme };
}

export function useStyle(path: string, fallback = ''): string {
  return useMemo(() => getStyle(path) || fallback, [path, fallback]);
}
