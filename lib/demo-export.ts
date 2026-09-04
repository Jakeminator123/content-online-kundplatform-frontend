type ExportResource = { title: string; publisher: string; type: string; requestsYtd: number; renewal: string }

export function csvCell(value: string | number): string {
  const text = String(value)
  const safe = /^[\s]*[=+@-]/.test(text) ? "'" + text : text
  return '"' + safe.replaceAll('"', '""') + '"'
}

export function demoPortfolioCsv(rows: ExportResource[]): string {
  const records: (string | number)[][] = [
    ['Status', 'SYNTETISK DEMODATA – ingen extern import'],
    ['Organisation', 'KTH'],
    ['Källa', 'Content Online presentationsdata'],
    ['Period', '2026-01-01 – 2026-08-31'],
    ['Definition', 'Exempel på produktanvändning; ej verifierad COUNTER-rapport'],
    [],
    ['Produkt', 'Publicist', 'Typ', 'Användning (demo)', 'Förnyelse (demo)'],
    ...rows.map(r => [r.title, r.publisher, r.type, r.requestsYtd, r.renewal]),
  ]
  return '\uFEFF' + records.map(row => row.map(csvCell).join(';')).join('\r\n')
}
