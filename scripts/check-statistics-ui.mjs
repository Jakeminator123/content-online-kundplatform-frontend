import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:3000';
const secret = process.env.SESSION_SECRET;
assert.ok(secret, 'An explicit disposable test secret is required');
for (let attempt = 0; attempt < 90; attempt++) {
  try { if ((await fetch(base + '/login')).ok) break; } catch {}
  if (attempt === 89) throw new Error('Local test server did not become ready');
  await new Promise(resolve => setTimeout(resolve, 1000));
}
await mkdir('test-artifacts', { recursive: true });
const browser = await chromium.launch();
try {
  for (const [username, role, expectedViews] of [['hampus', 'admin', 8], ['bibbi', 'staff', 7]]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const body = Buffer.from(JSON.stringify({ username, role, exp: Date.now() + 600000 })).toString('base64url');
    const signature = createHmac('sha256', secret).update(body).digest('base64url');
    await context.addCookies([{ name: 'co_session', value: `${body}.${signature}`, url: base, httpOnly: true, sameSite: 'Lax' }]);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/anvandning?vy=budget', { waitUntil: 'networkidle' });
    await page.locator('.statistics-tabs button').first().waitFor();
    assert.equal(await page.locator('.statistics-tabs button').count(), expectedViews);
    if (role === 'staff') {
      assert.equal(await page.locator('.statistics-tabs button').filter({ hasText: 'Budget' }).count(), 0);
      assert.ok(!(await page.locator('#statistics-content').innerText()).includes('Årsbudget 2026'));
    }
    const labels = await page.locator('.statistics-tabs button').allTextContents();
    for (const label of labels) {
      const button = page.locator('.statistics-tabs button').filter({ hasText: label });
      await button.click();
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.ok((await page.locator('#statistics-content').innerText()).length > 80);
    }
    await page.locator('.statistics-tabs button').filter({ hasText: 'Över tid' }).click();
    for (const label of ['Användning', 'Sökningar', 'Nekade åtkomster']) {
      const button = page.locator('.statistics-series button').filter({ hasText: label });
      await button.click();
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
    }
    await page.locator('.statistics-data summary').click();
    assert.equal(await page.locator('.statistics-data tbody tr').count(), 8);
    await page.locator('.statistics-data summary').click();
    await page.screenshot({ path: `test-artifacts/${role}-desktop.png`, fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `test-artifacts/${role}-mobile.png`, fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'No page-wide mobile overflow');
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.ok(await page.locator('.focus-link').count() > 0);
    await page.locator('.focus-link').first().click();
    await page.locator('.statistics-tabs button[aria-pressed="true"]').waitFor();
    assert.deepEqual(errors, [], 'No client exceptions');
    await context.close();
    console.log(`${role}: all ${expectedViews} views, chart controls, recommended navigation and mobile layout passed`);
  }
} finally {
  await browser.close();
}
