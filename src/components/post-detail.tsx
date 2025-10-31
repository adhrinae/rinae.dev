// @flow
import * as React from 'react';
import {Link} from "next-view-transitions";
import {IconArrowBack, IconPoint} from "@tabler/icons-react";
import {formatDate} from "@/lib/format-date";
import GiscusComments from "@/components/giscus-comments";
import {CustomMetadata} from "@/app/[[...mdxPath]]/page";
import {Posts} from "@/components/posts";

type Props = {
    metadata: CustomMetadata;
    children: React.ReactNode;
};

export function PostDetail({metadata, children}: Props) {
    return (
        <>
            <div className="flex items-center gap-4 text-sm mb-6">
                <Link href="/posts" className="hover:underline no-underline flex items-center gap-1">
                    <IconArrowBack className="w-4"/>
                    글 목록으로
                </Link>
                <IconPoint className="w-3"/>
                <div>{formatDate(metadata.date)}</div>
            </div>

            {children}

            <h2>관련 글</h2>
            <Posts tags={metadata.tags} excludeByTitle={metadata.title as string} first={5}/>

            {metadata.enableComment === true &&
                <div className="pt-32">
                    <GiscusComments/>
                </div>
            }
        </>
    );
}
