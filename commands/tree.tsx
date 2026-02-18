import React from 'react';
import { CommandFunction } from './index';

export const treeCommand: CommandFunction = (args, context) => {
    const { addLine, blogPosts } = context;
    const structure: Record<string, Record<string, string[]>> = {};
    blogPosts.forEach(p => {
        if (!structure[p.category]) structure[p.category] = {};
        if (!structure[p.category][p.section]) structure[p.category][p.section] = [];
        structure[p.category][p.section].push(p.slug);
    });

    addLine('output', (
        <div className="my-2 space-y-1 text-sm" >
            <p className="font-bold" >.</p>
            {
                Object.entries(structure).map(([cat, sections]) => (
                    <div key={cat} className="pl-4" >
                        <p>├── <span className="text-current font-bold" > {cat} </span></p >
                        {
                            Object.entries(sections).map(([sec, slugs], idx, arr) => (
                                <div key={sec} className="pl-4" >
                                    <p>{idx === arr.length - 1 ? '└──' : '├──'} <span className="opacity-70" > {sec} </span></p >
                                    {
                                        slugs.map((slug, sIdx) => (
                                            <p key={slug} className="pl-8 text-xs opacity-50" >
                                                {sIdx === slugs.length - 1 ? '└──' : '├──'} {slug}.md
                                            </p>
                                        ))
                                    }
                                </div>
                            ))}
                    </div>
                ))}
        </div>
    ));
};
