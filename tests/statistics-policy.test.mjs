import test from 'node:test';
import assert from 'node:assert/strict';
import { selectStatisticsViews } from '../lib/statistics-policy.ts';
const now = new Date('2026-09-05T12:00:00Z');
const row = { id: 'a', title: 'A', publisher: 'P', requestsYtd: 90, requestsPrevYtd: 100, renewal: '2026-09-30' };
const choose = extra => selectStatisticsViews({ organizationId: 'kth', resources: [row], periodEnd: '2026-08-31', now, ...extra });
test('attention stays ahead of budget and positive framing', () => {
  assert.deepEqual(choose({ denials: 50, commercial: true }).recommendations.map(r => r.view), ['changes','demand','renewals']);
});
test('readers never receive budget suggestions', () => {
  const result = choose({ resources: [{...row, requestsYtd: 100, renewal: undefined}], commercial: false });
  assert.ok(!result.recommendations.some(r => r.view === 'budget'));
});
test('missing usage is not zero and has no fabricated ranking', () => {
  const result = choose({ resources: [{...row, requestsYtd: null, renewal: undefined}] });
  assert.deepEqual(result.recommendations, []); assert.ok(result.warnings.length);
});
test('zero baseline cannot generate infinite growth', () => {
  assert.ok(!choose({resources:[{...row, requestsPrevYtd:0, renewal:undefined}]}).recommendations.some(r=>r.view==='changes'));
});
test('past renewal dates are not upcoming', () => {
  assert.ok(!choose({resources:[{...row,renewal:'2026-09-04'}]}).recommendations.some(r=>r.view==='renewals'));
});
test('day 90 included, day 91 excluded', () => {
  for (const [days, expected] of [[90,true],[91,false]]) {
    const renewal = new Date(Date.UTC(2026,8,5)+days*86400000).toISOString().slice(0,10);
    assert.equal(choose({resources:[{...row,renewal}]}).recommendations.some(r=>r.view==='renewals'),expected);
  }
});
test('stale period is explicitly flagged', () => assert.ok(choose({periodEnd:'2025-08-31'}).warnings.some(w=>w.includes('gammal'))));
test('deterministic, bounded and deduplicated', () => {
  assert.deepEqual(choose({}),choose({})); const rec=choose({}).recommendations;
  assert.ok(rec.length<=3); assert.equal(new Set(rec.map(r=>r.view)).size,rec.length);
});
test('NaN and negative usage are treated as missing', () => {
  for (const requestsYtd of [NaN,Infinity,-1]) assert.deepEqual(choose({resources:[{...row,requestsYtd,renewal:undefined}]}).recommendations,[]);
});
test('invalid evaluation date fails explicitly', () => assert.throws(()=>choose({now:new Date('invalid')})));
