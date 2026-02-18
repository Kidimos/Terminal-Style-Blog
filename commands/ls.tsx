import React from 'react';
import { CommandFunction } from './index';

export const lsCommand: CommandFunction = (args, context) => {
    const { addLine, blogPosts, blogConfig, executeCommand } = context;
    const catArg = args[0] ? args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase() : null;

    if (!catArg) {
        // 显示所有分类
        addLine('output', (
            <div className="flex flex-wrap gap-6 my-2" >
                {
                    blogConfig.categories.map(cat => (
                        <div
                            key={cat}
                            className="flex items-center gap-2 group cursor-pointer"
                            onClick={() => executeCommand(`ls ${cat}`)}
                        >
                            <span className="text-current opacity-40" > dir / </span>
                            < span className="font-bold underline group-hover:bg-current group-hover:text-black transition-colors" >
                                {cat}
                            </span>
                        </div>
                    ))}
            </div>
        ));
    } else {
        const filtered = blogPosts.filter(p => p.category === catArg);
        if (filtered.length === 0) {
            addLine('error', `Directory '${catArg}' not found.`);
        } else {
            addLine('output', (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3" >
                    {
                        filtered.map(post => (
                            <div
                                key={post.slug}
                                className="border border-current/20 p-4 bg-white/5 rounded-sm hover:border-current/60 transition-all cursor-pointer group"
                                onClick={() => executeCommand(`cat ${post.slug}`)}
                            >
                                <div className="flex justify-between items-start mb-1" >
                                    <span className="text-inherit font-black uppercase text-[10px] tracking-widest" >
                                        {post.section}
                                    </span>
                                    < span className="text-[10px] opacity-40 italic" > {post.date} </span>
                                </div>
                                < p className="font-bold text-sm mb-2 underline" > {post.title} </p>
                                < p className="text-[10px] opacity-60 leading-snug" > {post.summary} </p>
                            </div>
                        ))
                    }
                </div>
            ));
        }
    }
};
