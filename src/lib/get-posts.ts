import {normalizePages} from 'nextra/normalize-pages'
import {getPageMap} from 'nextra/page-map'

type GetPostsOptions = {
    first?: number;
    tags?: string[];
    excludeByTitle?: string;
};
export type PostItem = {
    title: string;
    name: string;
    route: string;
    type: string;
    frontMatter: {
        title: string;
        date: string;
        tags: string[];
        description: string;
        enableComment: boolean;
        filePath: string;
        timestamp: number;
    }
}

export async function getPosts(options: GetPostsOptions = {}): Promise<PostItem[]> {
    const {first, tags, excludeByTitle} = options;

    // get
    const {directories} = normalizePages({
        list: await getPageMap('/posts'),
        route: '/posts'
    })

    // Sort posts by date
    let posts = directories
        .filter((post) => post.name !== 'index')
        .sort((a, b) => {
            const dateA = new Date(a.frontMatter?.date || '');
            const dateB = new Date(b.frontMatter?.date || '');
            return dateB.getTime() - dateA.getTime();
        });

    // Filter by tags if provided
    if (tags && tags.length > 0) {
        posts = posts.filter(post =>
            tags.some(tag => post.frontMatter.tags?.includes(tag))
        );
    }

    // Exclude by title if provided
    if (excludeByTitle) {
        posts = posts.filter(post => post.title !== excludeByTitle);
    }

    // Apply first limit if provided
    if (first) {
        posts = posts.slice(0, first);
    }

    return posts as unknown as PostItem[];
}