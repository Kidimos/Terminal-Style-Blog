import { Theme } from '../types';

export const themeClasses = {
    [Theme.Matrix]: 'bg-black text-green-500 [--current-rgb:34,197,94] selection:bg-green-500/20',
    [Theme.Amber]: 'bg-black text-amber-500 [--current-rgb:245,158,11] selection:bg-amber-500/20',
    [Theme.Modern]: 'bg-[#060a0f] text-cyan-400 [--current-rgb:34,211,238] selection:bg-cyan-400/20',
    [Theme.Cyberpunk]: 'bg-black text-fuchsia-500 [--current-rgb:217,70,239] selection:bg-fuchsia-500/20',
};
