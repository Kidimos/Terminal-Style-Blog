import React from 'react';
import { CommandFunction } from './index';

export const whoamiCommand: CommandFunction = (args, context) => {
    const { addLine, blogConfig } = context;
    addLine('output', (
        <div className="my-8 p-8 border-2 border-current flex flex-col md:flex-row items-center gap-12 bg-current/5 max-w-5xl" >
            <img
                src={blogConfig.avatarUrl}
                alt={blogConfig.author}
                className="w-40 h-40 object-cover border-2 border-current rounded-sm shadow-[0_0_20px_rgba(var(--current-rgb),0.5)] grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="space-y-4 flex-1 text-left" >
                <h2 className="text-3xl font-black underline italic tracking-tight uppercase" > ACCESS_ID: {blogConfig.author} </h2>
                < p className="text-lg opacity-90 font-bold" > {blogConfig.title} </p>
                < div className="flex flex-wrap gap-4 text-xs" >
                    <span className="bg-current text-black px-3 py-1 font-bold tracking-widest" > MODULAR_UX </span>
                    < span className="bg-current text-black px-3 py-1 font-bold tracking-widest" > TYPESCRIPT_LTS </span>
                    < span className="bg-current text-black px-3 py-1 font-bold tracking-widest" > NEURAL_CSS </span>
                </div>
                < p className="text-xs opacity-60 mt-6 leading-relaxed border-l border-current/30 pl-4 italic" >
                    "{blogConfig.bio}"
                </p>
            </div>
        </div>
    ));
};
