import React from 'react';
import { CommandFunction } from './index';
import { getAllTagsWithCount, getPostsByTag } from '../services/postService';

export const tagsCommand: CommandFunction = (args, context) => {
  const { addLine, executeCommand } = context;

  if (args.length === 0) {
    const tagsWithCount = getAllTagsWithCount();

    if (tagsWithCount.length === 0) {
      addLine('output', 'No tags found.');
      return;
    }

    addLine('output', (
      <div className="mb-2">
        Available tags (<span className="font-bold">{tagsWithCount.length}</span>):
      </div>
    ));

    addLine('output', (
      <div className="flex flex-wrap gap-2 my-3">
        {tagsWithCount.map(({ tag, count }) => (
          <span
            key={tag}
            className="text-xs px-3 py-1.5 border border-current/30 rounded-sm hover:bg-current/10 cursor-pointer transition-colors group"
            onClick={() => executeCommand(`tags ${tag}`)}
          >
            <span className="group-hover:underline">{tag}</span>
            <span className="opacity-40 ml-1">({count})</span>
          </span>
        ))}
      </div>
    ));

    addLine('output', (
      <div className="text-[10px] opacity-40 mt-2">
        Click on a tag or use "tags &lt;tag&gt;" to filter posts
      </div>
    ));
  } else {
    const tag = args[0];
    const posts = getPostsByTag(tag);

    if (posts.length === 0) {
      addLine('error', `No posts found with tag "${tag}".`);
      addLine('output', 'Use "tags" to see all available tags.');
    } else {
      addLine('output', (
        <div className="mb-2">
          Posts tagged with "<span className="font-bold text-current">{tag}</span>" (
          <span className="font-bold">{posts.length}</span>):
        </div>
      ));

      addLine('output', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
          {posts.map(post => (
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
              <p className="text-[10px] opacity-60 leading-snug">{post.summary}</p>
              {post.tags && post.tags.length > 1 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.filter(t => t !== tag).slice(0, 3).map(t => (
                    <span key={t} className="text-[9px] px-1 border border-current/20 rounded-sm opacity-50">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ));
    }
  }
};
