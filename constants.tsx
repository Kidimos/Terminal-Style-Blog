
import React from 'react';
import { BlogPost } from './types';
import { BLOG_CONFIG } from './config';


export const HELP_TEXT = (
    <div className="space-y-1">
        <p><span className="text-cyan-400 font-bold">ls [category]</span> - List posts in a category (Code, Anime, Game)</p>
        <p><span className="text-cyan-400 font-bold">cat [slug]</span> - Read a post (Fetched from /post/)</p>
        <p><span className="text-cyan-400 font-bold">search [keyword]</span> - Search posts by title, content, or tags</p>
        <p><span className="text-cyan-400 font-bold">tags [tag]</span> - Show all tags or filter posts by tag</p>
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
