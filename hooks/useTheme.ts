import { useState } from 'react';
import { Theme } from '../types';

export function useTheme(defaultTheme: Theme) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    return { theme, setTheme };
}
