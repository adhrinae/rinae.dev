import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../../mdx-components'
import type { Metadata } from 'next'
import { PostDetail } from '@/components/post-detail'

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
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: PageProps) {
  const params = await props.params
  const result = await importPage(params.mdxPath)
  const { default: MDXContent, toc, metadata, sourceCode } = result

  const isPostPage = params.mdxPath && params.mdxPath.length > 1 && params.mdxPath.includes('posts')

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      {isPostPage ? (
        <PostDetail metadata={metadata} toc={toc}>
          <MDXContent {...props} params={params} />
        </PostDetail>
      ) : (
        <MDXContent {...props} params={params} />
      )}
    </Wrapper>
  )
}
