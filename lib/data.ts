export const organisation = {
  id: 'kth',
  name: 'KTH',
  fullName: 'Kungliga Tekniska högskolan',
  unit: 'KTH Biblioteket',
  city: 'Stockholm',
  accountManager: {
    name: 'Johanna Lindqvist',
    email: 'johanna.lindqvist@contentonline.se',
    phone: '+46 8 123 45 67',
  },
  contractYear: '2026',
  fiscalYearStart: '2026-01-01',
  fiscalYearEnd: '2026-12-31',
}

export type ResourceType = 'Tidskriftspaket' | 'Databas' | 'E-bokskollektion' | 'Standarder' | 'Verktyg'

export type Resource = {
  id: string
  title: string
  publisher: string
  type: ResourceType
  annualCost: number
  requestsYtd: number
  requestsPrevYtd: number
  uniqueUsersYtd: number
  renewal: string
  status: 'Aktiv' | 'Förnyelse snart' | 'Under utvärdering'
  departments: string[]
}

export const resources: Resource[] = [
  {
    id: 'ieee-xplore',
    title: 'IEEE Xplore Digital Library',
    publisher: 'IEEE',
    type: 'Databas',
    annualCost: 1_840_000,
    requestsYtd: 412_380,
    requestsPrevYtd: 371_900,
    uniqueUsersYtd: 9_120,
    renewal: '2026-12-31',
    status: 'Aktiv',
    departments: ['EECS', 'ITM', 'SCI'],
  },
  {
    id: 'springer-nature',
    title: 'Springer Nature Journals',
    publisher: 'Springer Nature',
    type: 'Tidskriftspaket',
    annualCost: 2_310_000,
    requestsYtd: 286_540,
    requestsPrevYtd: 279_100,
    uniqueUsersYtd: 7_840,
    renewal: '2026-12-31',
    status: 'Förnyelse snart',
    departments: ['CBH', 'SCI', 'ABE'],
  },
  {
    id: 'acm-dl',
    title: 'ACM Digital Library',
    publisher: 'ACM',
    type: 'Databas',
    annualCost: 640_000,
    requestsYtd: 198_220,
    requestsPrevYtd: 164_300,
    uniqueUsersYtd: 5_610,
    renewal: '2027-06-30',
    status: 'Aktiv',
    departments: ['EECS'],
  },
  {
    id: 'sciencedirect',
    title: 'ScienceDirect Freedom Collection',
    publisher: 'Elsevier',
    type: 'Tidskriftspaket',
    annualCost: 3_120_000,
    requestsYtd: 521_760,
    requestsPrevYtd: 498_400,
    uniqueUsersYtd: 11_230,
    renewal: '2026-12-31',
    status: 'Förnyelse snart',
    departments: ['CBH', 'SCI', 'ITM', 'ABE', 'EECS'],
  },
  {
    id: 'wiley-online',
    title: 'Wiley Online Library',
    publisher: 'Wiley',
    type: 'Tidskriftspaket',
    annualCost: 1_270_000,
    requestsYtd: 143_900,
    requestsPrevYtd: 151_200,
    uniqueUsersYtd: 4_980,
    renewal: '2026-12-31',
    status: 'Under utvärdering',
    departments: ['CBH', 'ABE'],
  },
  {
    id: 'sis-standarder',
    title: 'SIS Abonnemang – Svenska standarder',
    publisher: 'Svenska institutet för standarder',
    type: 'Standarder',
    annualCost: 380_000,
    requestsYtd: 38_410,
    requestsPrevYtd: 29_800,
    uniqueUsersYtd: 2_140,
    renewal: '2027-03-31',
    status: 'Aktiv',
    departments: ['ABE', 'ITM'],
  },
  {
    id: 'oreilly',
    title: "O'Reilly Learning Platform",
    publisher: "O'Reilly Media",
    type: 'E-bokskollektion',
    annualCost: 520_000,
    requestsYtd: 96_730,
    requestsPrevYtd: 71_200,
    uniqueUsersYtd: 3_870,
    renewal: '2026-09-30',
    status: 'Förnyelse snart',
    departments: ['EECS', 'ITM'],
  },
  {
    id: 'knovel',
    title: 'Knovel Engineering Reference',
    publisher: 'Elsevier',
    type: 'Verktyg',
    annualCost: 410_000,
    requestsYtd: 42_110,
    requestsPrevYtd: 44_900,
    uniqueUsersYtd: 1_960,
    renewal: '2026-12-31',
    status: 'Aktiv',
    departments: ['SCI', 'ITM', 'CBH'],
  },
]

export type Turnaway = {
  id: string
  title: string
  publisher: string
  type: ResourceType
  denialsYtd: number
  trend: number
  uniqueUsers: number
  topDepartment: string
  estimatedCost: number
  reason: 'Ej prenumererad' | 'Utanför avtalsperiod' | 'Samtidiga användare'
}

export const turnaways: Turnaway[] = [
  {
    id: 'nature-portfolio',
    title: 'Nature Portfolio – fullständigt paket',
    publisher: 'Springer Nature',
    type: 'Tidskriftspaket',
    denialsYtd: 18_420,
    trend: 24,
    uniqueUsers: 2_310,
    topDepartment: 'CBH',
    estimatedCost: 890_000,
    reason: 'Ej prenumererad',
  },
  {
    id: 'ieee-standards',
    title: 'IEEE Standards Online',
    publisher: 'IEEE',
    type: 'Standarder',
    denialsYtd: 11_870,
    trend: 41,
    uniqueUsers: 1_640,
    topDepartment: 'EECS',
    estimatedCost: 420_000,
    reason: 'Ej prenumererad',
  },
  {
    id: 'sciencedirect-backfiles',
    title: 'ScienceDirect Backfiles – Engineering',
    publisher: 'Elsevier',
    type: 'Tidskriftspaket',
    denialsYtd: 9_340,
    trend: 8,
    uniqueUsers: 1_120,
    topDepartment: 'SCI',
    estimatedCost: 310_000,
    reason: 'Utanför avtalsperiod',
  },
  {
    id: 'oreilly-seats',
    title: "O'Reilly Learning – fler samtidiga platser",
    publisher: "O'Reilly Media",
    type: 'E-bokskollektion',
    denialsYtd: 6_210,
    trend: 67,
    uniqueUsers: 890,
    topDepartment: 'EECS',
    estimatedCost: 140_000,
    reason: 'Samtidiga användare',
  },
  {
    id: 'wiley-ebooks',
    title: 'Wiley E-books – Materials Science',
    publisher: 'Wiley',
    type: 'E-bokskollektion',
    denialsYtd: 4_780,
    trend: 15,
    uniqueUsers: 620,
    topDepartment: 'ITM',
    estimatedCost: 260_000,
    reason: 'Ej prenumererad',
  },
]

export type NewsItem = {
  id: string
  publisher: string
  title: string
  summary: string
  date: string
  tag: 'Ny produkt' | 'Uppdatering' | 'Erbjudande' | 'Webinar'
  relevance: string
}

export const news: NewsItem[] = [
  {
    id: 'n1',
    publisher: 'IEEE',
    title: 'IEEE Xplore lanserar AI-assisterad sökning',
    summary:
      'Semantisk sökning och automatiska sammanfattningar rullas ut till alla institutionskunder under Q4. Ingen extra kostnad inom befintligt avtal.',
    date: '2026-09-02',
    tag: 'Uppdatering',
    relevance: 'Ni har IEEE Xplore',
  },
  {
    id: 'n2',
    publisher: 'Springer Nature',
    title: 'Nature Portfolio: nytt konsortiepris för svenska lärosäten',
    summary:
      'Nytt Bibsam-anpassat prispaket med Read & Publish för hela Nature Portfolio. KTH:s denials på Nature-titlar har ökat 24 % i år.',
    date: '2026-08-28',
    tag: 'Erbjudande',
    relevance: 'Matchar er efterfrågan',
  },
  {
    id: 'n3',
    publisher: "O'Reilly Media",
    title: "Ny kurskatalog inom kvantberäkning och LLM-utveckling",
    summary:
      '140 nya titlar och interaktiva labbmiljöer. Passar EECS som står för 71 % av er O\u2019Reilly-användning.',
    date: '2026-08-21',
    tag: 'Ny produkt',
    relevance: 'Hög användning inom EECS',
  },
  {
    id: 'n4',
    publisher: 'Elsevier',
    title: 'Webinar: Så maximerar ni värdet av ScienceDirect – för bibliotek',
    summary:
      'Live-session 18 september kl. 13.00 med fokus på nyttjandeanalys, Read & Publish-workflow och rapportering till ledning.',
    date: '2026-08-15',
    tag: 'Webinar',
    relevance: 'Ni har ScienceDirect',
  },
  {
    id: 'n5',
    publisher: 'Svenska institutet för standarder',
    title: 'Uppdaterad Eurokod-serie tillgänglig i SIS Abonnemang',
    summary:
      'Andra generationens Eurokoder (EN 1990–1999) publiceras löpande och ingår i ert befintliga abonnemang.',
    date: '2026-08-11',
    tag: 'Uppdatering',
    relevance: 'Ni har SIS Abonnemang',
  },
]

export type Document = {
  id: string
  name: string
  category: 'Avtal' | 'Presentation' | 'Rapport' | 'Faktura' | 'Övrigt'
  publisher?: string
  size: string
  updatedAt: string
  uploadedBy: string
}

export const documents: Document[] = [
  {
    id: 'd1',
    name: 'Ramavtal Content Online – KTH 2026–2028.pdf',
    category: 'Avtal',
    size: '2,4 MB',
    updatedAt: '2026-01-14',
    uploadedBy: 'Johanna Lindqvist',
  },
  {
    id: 'd2',
    name: 'Licensavtal IEEE Xplore 2026.pdf',
    category: 'Avtal',
    publisher: 'IEEE',
    size: '1,1 MB',
    updatedAt: '2026-01-09',
    uploadedBy: 'Johanna Lindqvist',
  },
  {
    id: 'd3',
    name: 'Licensavtal ScienceDirect Freedom Collection.pdf',
    category: 'Avtal',
    publisher: 'Elsevier',
    size: '3,8 MB',
    updatedAt: '2025-12-19',
    uploadedBy: 'Johanna Lindqvist',
  },
  {
    id: 'd4',
    name: 'Nature Portfolio – erbjudande KTH.pptx',
    category: 'Presentation',
    publisher: 'Springer Nature',
    size: '14,2 MB',
    updatedAt: '2026-08-28',
    uploadedBy: 'Johanna Lindqvist',
  },
  {
    id: 'd5',
    name: 'Nyttjanderapport H1 2026 – KTH.pdf',
    category: 'Rapport',
    size: '860 kB',
    updatedAt: '2026-07-04',
    uploadedBy: 'Content Online Analytics',
  },
  {
    id: 'd6',
    name: 'Produktrapport – syntetiskt exempel, jan–aug.xlsx',
    category: 'Rapport',
    size: '412 kB',
    updatedAt: '2026-09-01',
    uploadedBy: 'Content Online Analytics',
  },
  {
    id: 'd7',
    name: 'Faktura 2026-0142 – Q3.pdf',
    category: 'Faktura',
    size: '210 kB',
    updatedAt: '2026-07-01',
    uploadedBy: 'Ekonomi',
  },
  {
    id: 'd8',
    name: 'Kravspecifikation e-resurser – KTH Biblioteket.docx',
    category: 'Övrigt',
    size: '96 kB',
    updatedAt: '2026-03-22',
    uploadedBy: 'Hampus',
  },
]

export const totals = (() => {
  const annualCost = resources.reduce((s, r) => s + r.annualCost, 0)
  const requestsYtd = resources.reduce((s, r) => s + r.requestsYtd, 0)
  const requestsPrevYtd = resources.reduce((s, r) => s + r.requestsPrevYtd, 0)
  const denialsYtd = turnaways.reduce((s, t) => s + t.denialsYtd, 0)
  return {
    annualCost,
    requestsYtd,
    requestsPrevYtd,
    requestsGrowth: ((requestsYtd - requestsPrevYtd) / requestsPrevYtd) * 100,
    costPerRequest: annualCost / requestsYtd,
    denialsYtd,
    activeResources: resources.length,
    renewalsSoon: resources.filter((r) => r.status === 'Förnyelse snart').length,
  }
})()

const demoUsageTotal = resources.reduce((sum, r) => sum + r.requestsYtd, 0)
const monthWeights = [148200, 176900, 201400, 189300, 210800, 142600, 88100, 132500]
const monthWeightTotal = monthWeights.reduce((a,b) => a+b,0)
const monthValues = monthWeights.map(w => Math.round(w / monthWeightTotal * demoUsageTotal))
monthValues[7] += demoUsageTotal - monthValues.reduce((a,b) => a+b,0)
const denialWeights = [4120,4980,5610,5240,6130,3870,2210,3960]
const totalDenialWeight = denialWeights.reduce((a,b) => a+b,0)
const denialValues = denialWeights.map(w => Math.round(w / totalDenialWeight * totals.denialsYtd))
denialValues[7] += totals.denialsYtd - denialValues.reduce((a,b) => a+b,0)
export const monthlyUsage = ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug'].map((month,i) => ({
  month, requests: monthValues[i], searches: Math.round(monthValues[i] * .62), denials: denialValues[i],
}))
const schools = [
  { code:'EECS', name:'Elektroteknik och datavetenskap',share:35 },
  { code:'SCI', name:'Teknikvetenskap',share:22 },
  { code:'CBH', name:'Kemi, bioteknologi och hälsa',share:20 },
  { code:'ITM', name:'Industriell teknik och management',share:13 },
  { code:'ABE', name:'Arkitektur och samhällsbyggnad',share:10 },
]
export const departmentUsage = schools.map(s => ({...s, requests: Math.round(demoUsageTotal * s.share / 100)}))

departmentUsage[4].requests += demoUsageTotal - departmentUsage.reduce((sum,d) => sum + d.requests, 0)
