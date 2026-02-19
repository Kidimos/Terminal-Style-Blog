import { BLOG_POSTS, PostMeta, fetchPostContent } from './postService';

export interface SearchMatch {
  field: 'title' | 'content' | 'tags' | 'summary';
  snippet: string;
}

export interface SearchResult {
  post: PostMeta;
  matches: SearchMatch[];
  score: number;
}

let contentCache: Record<string, string> = {};
let cacheLoaded = false;

async function ensureContentCache(): Promise<void> {
  if (cacheLoaded) return;

  const promises = BLOG_POSTS.map(async (post) => {
    try {
      const content = await fetchPostContent(post.slug);
      contentCache[post.slug] = content;
    } catch {
      contentCache[post.slug] = '';
    }
  });

  await Promise.all(promises);
  cacheLoaded = true;
}

function createSnippet(text: string, keyword: string, contextLength = 50): string {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const index = lowerText.indexOf(lowerKeyword);

  if (index === -1) return text.slice(0, 100) + (text.length > 100 ? '...' : '');

  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + keyword.length + contextLength);

  let snippet = text.slice(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  return snippet;
}

function highlightKeyword(text: string, keyword: string): string {
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '**$1**');
}

export async function searchPosts(keyword: string): Promise<SearchResult[]> {
  if (!keyword.trim()) return [];

  await ensureContentCache();

  const results: SearchResult[] = [];
  const lowerKeyword = keyword.toLowerCase();

  for (const post of BLOG_POSTS) {
    const matches: SearchMatch[] = [];
    let score = 0;

    if (post.title.toLowerCase().includes(lowerKeyword)) {
      matches.push({
        field: 'title',
        snippet: createSnippet(post.title, keyword),
      });
      score += 10;
    }

    if (post.summary.toLowerCase().includes(lowerKeyword)) {
      matches.push({
        field: 'summary',
        snippet: createSnippet(post.summary, keyword),
      });
      score += 5;
    }

    if (post.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword))) {
      const matchedTags = post.tags.filter(tag => tag.toLowerCase().includes(lowerKeyword));
      matches.push({
        field: 'tags',
        snippet: matchedTags.join(', '),
      });
      score += 8;
    }

    const content = contentCache[post.slug] || '';
    if (content.toLowerCase().includes(lowerKeyword)) {
      matches.push({
        field: 'content',
        snippet: createSnippet(content, keyword, 80),
      });
      score += 3;
    }

    if (matches.length > 0) {
      results.push({ post, matches, score });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

export function searchByTag(tag: string): PostMeta[] {
  const lowerTag = tag.toLowerCase();
  return BLOG_POSTS.filter(post =>
    post.tags?.some(t => t.toLowerCase() === lowerTag)
  );
}

export { highlightKeyword };
