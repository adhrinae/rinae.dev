import {Head} from 'nextra/components'
import 'nextra-theme-blog/style.css'
import '@/styles/globals.css'
import CustomFooter from "@/components/custom-footer";
import CustomHeader from "@/components/custom-header";
import {Metadata} from "next";
import {Layout} from "nextra-theme-blog";
import {Noto_Sans_KR} from 'next/font/google';

export const metadata: Metadata = {
    title: 'rinae.dev',
    description: 'rinae의 개발 블로그'
}

const bodyFont = Noto_Sans_KR({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
})

export default async function RootLayout({children}) {
    return (
        <html
            // Not required, but good for SEO
            lang="ko"
            // Required to be set
            dir="ltr"
            // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
            suppressHydrationWarning

            className={bodyFont.className}
        >
        <Head backgroundColor={{dark: '#15120d', light: '#faf5e9'}}/>
        <body className="min-h-screen">
        <Layout>
            <CustomHeader/>

            {children}

            <CustomFooter/>
        </Layout>
        </body>
        </html>
    )
}
