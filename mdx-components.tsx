import {useMDXComponents as getBlogMDXComponents} from 'nextra-theme-blog'
import {useMDXComponents as getNextraComponents} from 'nextra/mdx-components'
import {Posts} from "@/components/posts";
import {Tags} from "@/components/tags";

const blogComponents = getBlogMDXComponents({
    h1: ({children}) => (
        <h1 className="custom-h1">
            {children}
        </h1>
    ),
    DateFormatter: ({date}) =>
        `마지막 업데이트: ${date.toLocaleDateString('ko-KR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })}`
})

const defaultComponents = getNextraComponents({
    wrapper({children}) {
        return (
            <>
                {children}
            </>
        )
    }
})

export function useMDXComponents() {
    return {
        ...blogComponents,
        ...defaultComponents,
        Posts: Posts,
        Tags: Tags,
    }
}
