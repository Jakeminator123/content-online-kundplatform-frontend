import { NewsList } from '@/components/dashboard/news-list'
import { PageHeader } from '@/components/dashboard/page-header'
import { news } from '@/lib/data'

export default function NewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Från förlagen"
        title="Nyheter som rör ert bestånd"
        description="Produktlanseringar, uppdateringar och erbjudanden från de förlag ni redan arbetar med – filtrerat på vad som är relevant för KTH:s användning och efterfrågan."
      />
      <NewsList items={news} detailed />
    </>
  )
}
