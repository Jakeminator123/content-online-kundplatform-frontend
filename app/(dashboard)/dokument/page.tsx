import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DocumentList } from '@/components/dashboard/document-list'
import { PageHeader } from '@/components/dashboard/page-header'
import { requireUser } from '@/lib/auth'
import { documents, type Document } from '@/lib/data'

const categories: Array<Document['category']> = ['Avtal', 'Rapport', 'Presentation', 'Faktura', 'Övrigt']

export default async function DocumentsPage() {
  const user = await requireUser()
  const sorted = [...documents].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  return (
    <>
      <PageHeader
        eyebrow="Dokument"
        title="Ert gemensamma valv"
        description="Avtal, licensvillkor, nyttjanderapporter, offerter och presentationer – samlade på ett ställe och delade mellan KTH och Content Online."
        action={
          user.role === 'admin' ? (
            <Button className="gap-2">
              <Upload className="size-4" />
              Ladda upp
            </Button>
          ) : null
        }
      />

      <Tabs defaultValue="alla" className="gap-5">
        <TabsList variant="line">
          <TabsTrigger value="alla">Alla ({documents.length})</TabsTrigger>
          {categories.map((c) => {
            const count = documents.filter((d) => d.category === c).length
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
        {categories.map((c) => (
          <TabsContent key={c} value={c}>
            <DocumentList items={sorted.filter((d) => d.category === c)} />
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}
