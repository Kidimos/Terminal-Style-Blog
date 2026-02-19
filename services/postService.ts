import frontMatter from 'front-matter';

// 使用 Vite 的 glob 导入，在构建时同步加载所有 .md 文件
const modules = import.meta.glob('../post/*.md', { eager: true, query: '?raw', import: 'default' });

export interface PostMeta {
    slug: string;          // 文件名（不含扩展名）
    title: string;
    date: string;
    category: string;
    section: string;
    summary: string;
    tags?: string[];
}

// 从文件路径提取 slug（例如 "../post/my-article.md" -> "my-article"）
const extractSlug = (path: string): string => {
    const match = path.match(/\/([^/]+)\.md$/);
    return match ? match[1] : '';
};

// 解析所有文章
const posts: PostMeta[] = Object.entries(modules).map(([path, content]) => {
    const { attributes, body } = frontMatter(content as string);
    const data = attributes as any; // 可以进一步定义类型，但暂时用 any
    const slug = extractSlug(path);

    // 简单提取正文前几行作为摘要（如果没有提供 summary）
    let excerpt = '';
    if (!data.summary) {
        const lines = body.split('\n').filter(line => line.trim() !== '');
        excerpt = lines.slice(0, 3).join(' ').substring(0, 150) + (body.length > 150 ? '...' : '');
    }

    return {
        slug,
        title: data.title || slug,
        date: data.date
            ? new Date(data.date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        category: data.category || 'Other',
        section: data.section || 'General',
        summary: data.summary || excerpt || '',
        tags: data.tags || [],
    };
});

// 按日期排序（最新在前）
posts.sort((a, b) => (a.date < b.date ? 1 : -1));

// 导出文章列表
export const BLOG_POSTS = posts;

// 导出所有分类（去重、排序）
export const CATEGORIES = [...new Set(posts.map(p => p.category))].sort();

// 导出所有标签（如果有）
export const TAGS = [...new Set(posts.flatMap(p => p.tags || []))].sort();

// 根据分类获取文章
export function getPostsByCategory(category: string): PostMeta[] {
    return posts.filter(p => p.category === category);
}

// 根据 slug 获取文章
export function getPostBySlug(slug: string): PostMeta | undefined {
    return posts.find(p => p.slug === slug);
}

// 运行时获取文章完整内容
export async function fetchPostContent(slug: string): Promise<string> {
  try {
    const response = await fetch(`./post/${slug}.md`);
    if (!response.ok) throw new Error("File not found");
    return await response.text();
  } catch (e) {
    return "ERROR: Unable to retrieve source file from secure storage.";
  }
}

export function getPostsByTag(tag: string): PostMeta[] {
  return posts.filter(p => p.tags?.includes(tag));
}

export function getTagStats(): Record<string, number> {
  const stats: Record<string, number> = {};
  posts.forEach(p => {
    (p.tags || []).forEach(tag => {
      stats[tag] = (stats[tag] || 0) + 1;
    });
  });
  return stats;
}

export function getAllTagsWithCount(): Array<{ tag: string; count: number }> {
  const stats = getTagStats();
  return Object.entries(stats)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getCategoryStats(): Record<string, number> {
  const stats: Record<string, number> = {};
  posts.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  return stats;
}

export function getTotalPosts(): number {
  return posts.length;
}
