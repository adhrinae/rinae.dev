import type { Heading } from "nextra";
import * as React from "react";
import { Link } from "next-view-transitions";
import { IconArrowBack, IconPoint } from "@tabler/icons-react";
import { formatDate } from "@/lib/format-date";
import GiscusComments from "@/components/giscus-comments";
import { Posts } from "@/components/posts";
import { TOC } from "@/components/toc";
import { CustomMetadata } from "@/app/[[...mdxPath]]/page";

type Props = {
  metadata: CustomMetadata;
  children: React.ReactNode;
  toc?: Heading[];
};

export function PostDetail({ metadata, children, toc }: Props) {
  return (
    <article className="!pt-0 mx-auto flex w-full max-w-5xl flex-col gap-10">
      <div className="mb-6 flex items-center gap-4 text-sm">
        <Link
          href="/posts"
          className="flex items-center gap-1 no-underline hover:underline"
        >
          <IconArrowBack className="w-4" />
          <span>글 목록으로</span>
        </Link>
        <IconPoint className="w-3" />
        <div>{formatDate(metadata.date)}</div>
      </div>

      {toc?.length ? <TOC toc={toc} /> : null}

      {children}

      <div className="mt-16">
        <h2>관련 글</h2>
        <Posts
          tags={metadata.tags}
          excludeByTitle={metadata.title as string}
          first={5}
        />
      </div>

      {metadata.enableComment === true ? (
        <div className="pt-32">
          <GiscusComments />
        </div>
      ) : null}
    </article>
  );
}
