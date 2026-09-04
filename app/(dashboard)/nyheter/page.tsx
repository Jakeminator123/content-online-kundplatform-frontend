import { NewsList } from '@/components/dashboard/news-list'
import { PageHeader } from '@/components/dashboard/page-header'
import { news } from '@/lib/data'

export default function NewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Från förlagen"
        title="Nyheter som rör ert bestånd"
        description="Exempel på hur relevanta publicistnyheter kan visas för KTH. Texter, erbjudanden och datum är påhittat demoinnehåll."
      />
      <NewsList items={news} detailed />
    </>
  )
}
