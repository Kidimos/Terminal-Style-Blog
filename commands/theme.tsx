import React from 'react';
import { CommandFunction } from './index';

export const themeCommand: CommandFunction = (args, context) => {
    const { addLine, setTheme, themeEnum } = context;
    const requestedTheme = args[0] as any;
    if (Object.values(themeEnum).includes(requestedTheme)) {
        setTheme(requestedTheme);
        addLine('system', `Environment recalibrated to ${requestedTheme.toUpperCase()} mode.`);
    } else {
        addLine('error', `Invalid profile. Registered: ${Object.values(themeEnum).join(', ')}`);
    }
}
