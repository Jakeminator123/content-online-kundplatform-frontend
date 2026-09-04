import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resources, monthlyUsage, departmentUsage, totals } from '../lib/data.ts'
import { csvCell, demoPortfolioCsv } from '../lib/demo-export.ts'

test('demo chart, departments and portfolio agree on the displayed Jan-Aug totals', () => {
  assert.equal(monthlyUsage.length, 8)
  assert.equal(monthlyUsage.at(-1).month, 'Aug')
  assert.equal(monthlyUsage.reduce((s,m) => s+m.requests,0), totals.requestsYtd)
  assert.equal(monthlyUsage.reduce((s,m) => s+m.denials,0), totals.denialsYtd)
  assert.equal(departmentUsage.reduce((s,m) => s+m.requests,0), totals.requestsYtd)
})
test('CSV export carries provenance and only the selected products', () => {
  const csv = demoPortfolioCsv([resources[0]])
  assert.ok(csv.includes('SYNTETISK DEMODATA'))
  assert.ok(csv.includes('2026-01-01 – 2026-08-31'))
  assert.ok(csv.includes(resources[0].title))
  assert.ok(!csv.includes(resources[1].title))
  assert.equal(csvCell('=HYPERLINK("example")'), '"\'=HYPERLINK(""example"")"')
  assert.equal(csvCell(' +1'), '"\' +1"')
})
