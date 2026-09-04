const sv = 'sv-SE'

export const fmtNumber = (n: number) => new Intl.NumberFormat(sv).format(Math.round(n))

export const fmtCompact = (n: number) =>
  new Intl.NumberFormat(sv, { notation: 'compact', maximumFractionDigits: 1 }).format(n)

export const fmtSek = (n: number) =>
  new Intl.NumberFormat(sv, {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(n)

export const fmtSekPrecise = (n: number) =>
  new Intl.NumberFormat(sv, {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)

export const fmtPercent = (n: number, signed = false) => {
  const value = new Intl.NumberFormat(sv, { maximumFractionDigits: 1 }).format(Math.abs(n))
  if (!signed) return `${value} %`
  return `${n > 0 ? '+' : n < 0 ? '−' : ''}${value} %`
}

export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat(sv, { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(iso),
  )

export const fmtDateShort = (iso: string) =>
  new Intl.DateTimeFormat(sv, { day: 'numeric', month: 'short' }).format(new Date(iso))

export const greeting = (name: string) => {
  const hour = new Date().getHours()
  const time = hour < 10 ? 'God morgon' : hour < 17 ? 'Hej' : 'God kväll'
  return `${time}, ${name}`
}
