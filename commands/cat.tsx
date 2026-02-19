import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import frontMatter from 'front-matter';
import { CommandFunction } from './index';

export const catCommand: CommandFunction = async (args, context) => {
    const { addLine, setIsLoading, fetchPostContent, blogPosts, blogConfig, theme } = context;
    const target = args[0];
    if (!target) {
        addLine('error', "Usage: cat [slug].");
        return;
    }
    const postMeta = blogPosts.find(p => p.slug === target);
    if (postMeta) {
        setIsLoading(true);
        const rawContent = await fetchPostContent(target);
        setIsLoading(false);

        // 解析 frontmatter，分离正文
        let body = rawContent;
        try {
            const parsed = frontMatter(rawContent);
            body = parsed.body;
        } catch (e) {
            // 解析失败（可能没有 frontmatter），保持原内容不变
        }

        addLine('output', (
            <div className={`max-w-4xl my-12 mx-auto border border-current/10 bg-black/40 p-6 md:p-12 lg:p-16 markdown-content shadow-2xl relative overflow-hidden rounded-lg theme-${theme}`}>
                <div className="absolute top-0 right-0 p-3 text-[10px] opacity-30 select-none font-bold tracking-tighter">
                    SECURE_FS // {target}.md
                </div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {body}
                </ReactMarkdown>
                <div className="mt-16 pt-8 border-t border-current/20 flex flex-col sm:flex-row justify-between items-center text-[10px] opacity-40 gap-4">
                    <div className="flex gap-4">
                        <span>AUTHOR: {blogConfig.author}</span>
                        <span>TIMESTAMP: {postMeta.date}</span>
                    </div>
                    <span>END_OF_TRANSMISSION // CRC_OK</span>
                </div>
            </div>
        ));
    } else {
        addLine('error', `File '${target}' not located in /post/ registry.`);
    }
};
