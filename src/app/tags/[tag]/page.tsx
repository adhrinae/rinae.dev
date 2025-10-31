import type {Metadata} from 'next'
import {getTags} from "@/lib/get-tags";
import {Posts} from "@/components/posts";
import {Tags} from "@/components/tags";

type TagPageParams = {
    tag: string
}

type TagPageProps = {
    params: Promise<TagPageParams>
}

export async function generateMetadata(props: TagPageProps): Promise<Metadata> {
    const params = await props.params
    return {
        title: `Posts Tagged with "${decodeURIComponent(params.tag)}"`
    }
}

export async function generateStaticParams(): Promise<TagPageParams[]> {
    const allTags = await getTags()
    return [...new Set(allTags)].map(item => ({tag: item.name}))
}

export default async function TagPage(props: TagPageProps) {
    const params = await props.params
    const decodedTag = decodeURIComponent(params.tag)

    return (
        <>
            <h1>Posts Tagged with &quot;{decodedTag}&quot;</h1>
            <Posts tags={[decodedTag]}/>

            <h2>More tags</h2>
            <Tags/>
        </>
    )
}