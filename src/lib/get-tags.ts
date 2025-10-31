import {getPosts} from "@/lib/get-posts";

export type TagItem = {
    name: string;
    count: number;
}

export async function getTags(): Promise<TagItem[]> {
    const posts = await getPosts();
    const tags: string[] = posts.flatMap((post) => post.frontMatter?.tags || []);

    // Count occurrences of each tag
    const tagCounts = tags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Convert to array format
    return Object.entries(tagCounts).map(([name, count]) => ({
        name,
        count
    }));
}