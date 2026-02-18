
import React from 'react';
import { BlogPost } from './types';
import { BLOG_CONFIG } from './config';

export const BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        slug: 'typescript-tricks',
        title: 'Advanced TypeScript: Utility Types',
        date: '2024-06-01',
        category: 'Code',
        section: 'Frontend',
        summary: 'Mastering Pick, Omit, and Partial for cleaner codebases.',
        content: '' // Fetched on demand
    },
    {
        id: '2',
        slug: 'cyberpunk-edgerunners-review',
        title: 'Edgerunners: A Neon Heartbreak',
        date: '2024-05-20',
        category: 'Anime',
        section: 'Reviews',
        summary: 'Why Edgerunners is a masterpiece of modern animation and storytelling.',
        content: '' // Fetched on demand
    },
    {
        id: '3',
        slug: 'elden-ring-lore',
        title: 'The Shattering of the Elden Ring',
        date: '2024-04-15',
        category: 'Game',
        section: 'Lore',
        summary: 'Understanding the motivations of Queen Marika the Eternal.',
        content: '' // Fetched on demand
    }
];

export const HELP_TEXT = (
    <div className="space-y-1">
        <p><span className="text-cyan-400 font-bold">ls [category]</span> - List posts in a category (Code, Anime, Game)</p>
        <p><span className="text-cyan-400 font-bold">cat [slug]</span> - Read a post (Fetched from /post/)</p>
        <p><span className="text-cyan-400 font-bold">tree</span> - Visualize the entire blog structure</p>
        <p><span className="text-cyan-400 font-bold">whoami</span> - Access developer profile</p>
        <p><span className="text-cyan-400 font-bold">clear</span> - Wipe terminal buffer</p>
        <p><span className="text-cyan-400 font-bold">theme [name]</span> - (matrix, amber, modern, cyberpunk)</p>
        <p><span className="text-cyan-400 font-bold">help</span> - Display this menu</p>
    </div>
);

export const WELCOME_MESSAGE = `
System Initialized: ${BLOG_CONFIG.version}
Authentication Successful: Terminal Interface v4.0.0 Ready.
Welcome to the archives of Node_01.
Enter 'help' or 'tree' to explore.
`;
