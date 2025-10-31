import * as React from 'react';
import {getPosts, PostItem} from "@/lib/get-posts";
import {Link} from "next-view-transitions";
import {IconArrowNarrowRight, IconTags} from "@tabler/icons-react";
import {formatDate} from "@/lib/format-date";

type Props = {
    posts?: PostItem[];
    tags?: string[];
    excludeByTitle?: string;
    first?: number;
    showViewAllButton?: boolean;
};

export async function Posts({posts, tags, excludeByTitle, first, showViewAllButton}: Props) {
    const displayPosts = posts ?? await getPosts({tags, excludeByTitle, first});
    return (
        <div className="space-y-6 not-prose">
            {displayPosts.map(post => {
                return (
                    <div key={post.route} className="flex flex-wrap">

                        <div className="w-[calc(100%-100px)]">
                            <div className="font-bold">
                                <Link href={post.route} className="hover:underline">
                                    {post.title}
                                </Link>
                            </div>
                            <div className="flex gap-1 text-sm">
                                <IconTags className="w-4 min-w-4 -translate-y-0.5 text-muted-foreground"/>
                                <div className="flex flex-wrap gap-x-1">
                                    {post.frontMatter.tags.map((tagName, index: number) => {
                                        return (
                                            <Link key={tagName} href={`/tags/${tagName}`}
                                                  className="text-sm text-muted-foreground hover:underline">
                                                <span>{tagName}{index < post.frontMatter.tags.length - 1 && ", "}</span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="w-[100px] text-right">
                            <div className="text-sm text-muted-foreground pt-1">
                                <div>
                                    {formatDate(post.frontMatter.date)}
                                </div>
                            </div>
                        </div>

                    </div>
                )
            })}

            {showViewAllButton === true &&
                <Link href="/posts" className="flex gap-1 items-center hover:underline">
                    모든 글 보기 <IconArrowNarrowRight className="w-4"/>
                </Link>
            }
        </div>
    );
}
