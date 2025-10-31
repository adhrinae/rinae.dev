import {generateStaticParamsFor, importPage} from 'nextra/pages'
import {useMDXComponents as getMDXComponents} from '../../../mdx-components'
import type {Metadata} from 'next'
import React from "react";
import {PostDetail} from "@/components/post-detail";

// Define types for params and metadata
type PageParams = {
    mdxPath: string[]
}

type PageProps = {
    params: Promise<PageParams>
}

export type CustomMetadata = Metadata & {
    date?: string
    enableComment?: boolean
    tags?: string[]
}

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params
    const {metadata} = await importPage(params.mdxPath)
    return metadata
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: PageProps) {
    const params = await props.params
    const result = await importPage(params.mdxPath)
    const {default: MDXContent, toc, metadata} = result as {
        default: React.ComponentType<any>
        toc: any
        metadata: CustomMetadata
    }

    const isPostPage = params.mdxPath && params.mdxPath.length > 1 && params.mdxPath.includes('posts');

    return (
        // @ts-ignore
        <Wrapper toc={toc} metadata={metadata}>
            {
                isPostPage &&
                <PostDetail metadata={metadata}>
                    <MDXContent {...props} params={params}/>
                </PostDetail>
            }

            {
                !isPostPage &&
                <>
                    <MDXContent {...props} params={params}/>
                </>
            }

        </Wrapper>
    )
}