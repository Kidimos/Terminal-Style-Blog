import React from 'react';
import { CommandFunction } from './index';
import { searchPosts, highlightKeyword } from '../services/searchService';

export const searchCommand: CommandFunction = async (args, context) => {
  const { addLine, executeCommand, setIsLoading } = context;

  if (args.length === 0) {
    addLine('error', 'Usage: search <keyword>');
    addLine('output', 'Search through post titles, content, and tags.');
    return;
  }

  const keyword = args.join(' ');
  setIsLoading(true);

  try {
    const results = await searchPosts(keyword);

    if (results.length === 0) {
      addLine('output', (
        <div className="opacity-60">
          No results found for "<span className="text-current font-bold">{keyword}</span>"
        </div>
      ));
    } else {
      addLine('output', (
        <div className="mb-2">
          Found <span className="font-bold text-current">{results.length}</span> result(s) for "
          <span className="font-bold">{keyword}</span>":
        </div>
      ));

      addLine('output', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
          {results.map(({ post, matches }) => (
            <div
              key={post.slug}
              className="border border-current/20 p-4 bg-white/5 rounded-sm hover:border-current/60 transition-all cursor-pointer group"
              onClick={() => executeCommand(`cat ${post.slug}`)}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-inherit font-black uppercase text-[10px] tracking-widest">
                  {post.section}
                </span>
                <span className="text-[10px] opacity-40 italic">{post.date}</span>
              </div>
              <p className="font-bold text-sm mb-2 underline">{post.title}</p>
              {matches.slice(0, 2).map((match, idx) => (
                <div key={idx} className="text-[10px] opacity-60 leading-snug mb-1">
                  <span className="opacity-40 uppercase">[{match.field}]</span>{' '}
                  <span dangerouslySetInnerHTML={{
                    __html: highlightKeyword(match.snippet, keyword)
                      .replace(/\*\*/g, '<mark class="bg-current/30 px-0.5">')
                      .replace(/\*\*/g, '</mark>')
                      .replace(/\*\*(.*?)\*\*/g, '<mark class="bg-current/30 px-0.5">$1</mark>')
                  }} />
                </div>
              ))}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[9px] px-1 border border-current/20 rounded-sm opacity-50">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ));
    }
  } catch (error) {
    addLine('error', `Search failed: ${String(error)}`);
  } finally {
    setIsLoading(false);
  }
};
