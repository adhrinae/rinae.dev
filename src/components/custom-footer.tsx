import { ThemeSwitch } from 'nextra-theme-blog'
import { getPageMap } from 'nextra/page-map'
import { Navbar } from '@/components/navbar'
import { Search } from 'nextra/components'

const CustomFooter = async () => {
  return (
    <div className="pt-32">
      <div className="space-y-6">
        <Navbar pageMap={await getPageMap()} />

        <div className="flex justify-between items-center gap-4 flex-col sm:flex-row sm:items-center">
          <div className="flex gap-2 items-center">
            <ThemeSwitch />
            <div>© {new Date().getFullYear()} rinae</div>
          </div>
          {/*FIXME: Pagefind is not working on production env*/}
          {/*<Search placeholder="글 검색..." />*/}
        </div>
      </div>
    </div>
  )
}

export default CustomFooter
