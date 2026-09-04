import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DocumentList } from '@/components/dashboard/document-list'
import { PageHeader } from '@/components/dashboard/page-header'
import { requireUser } from '@/lib/auth'
import { documents, type Document } from '@/lib/data'

const categories: Array<Document['category']> = ['Avtal', 'Rapport', 'Presentation', 'Faktura', 'Övrigt']

export default async function DocumentsPage() {
  const user = await requireUser()
  const visible = user.role === 'admin' ? documents : documents.filter(d => !['Avtal', 'Faktura'].includes(d.category))
  const sorted = [...visible].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  return (
    <>
      <PageHeader
        eyebrow="Dokument"
        title="Dokumenten, samlade."
        description="Förhandsvisa rapporter, presentationer och dokumentinformation för KTH. Originalfiler är ännu inte anslutna i demon."
        action={
          user.role === 'admin' ? (
            <Button className="gap-2" nativeButton={false} render={<Link href="/kundservice?arende=dokument" />}>
              <ArrowUpRight className="size-4" />
              Fråga om dokument
            </Button>
          ) : null
        }
      />

      <Tabs defaultValue="alla" className="gap-5">
        <TabsList variant="line" className="max-w-full overflow-x-auto">
          <TabsTrigger value="alla">Alla ({visible.length})</TabsTrigger>
          {categories.filter(c => visible.some(d => d.category === c)).map((c) => {
            const count = visible.filter((d) => d.category === c).length
            return (
              <TabsTrigger key={c} value={c}>
                {c} ({count})
              </TabsTrigger>
            )
          })}
        </TabsList>
        <TabsContent value="alla">
          <DocumentList items={sorted} />
        </TabsContent>
        {categories.filter(c => visible.some(d => d.category === c)).map((c) => (
          <TabsContent key={c} value={c}>
            <DocumentList items={sorted.filter((d) => d.category === c)} />
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}
