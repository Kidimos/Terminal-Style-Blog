
import React from 'react';

export type LineType = 'input' | 'output' | 'system' | 'error';

export interface TerminalLine {
    id: string;
    type: LineType;
    content: string | React.ReactNode;
    timestamp: Date;
}

export type CategoryType = 'Code' | 'Anime' | 'Game' | 'Other';

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    date: string;
    category: CategoryType;
    section: string; // E.g. "React", "Cyberpunk", "Hardware"
    content: string;
    summary: string;
}

export enum Theme {
    Matrix = 'matrix',
    Amber = 'amber',
    Modern = 'modern',
    Cyberpunk = 'cyberpunk'
}
