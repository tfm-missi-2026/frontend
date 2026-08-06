const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await page.goto('http://localhost:4200/signin', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'marcos.pacheco@institucion.gob.pe');
  await page.fill('input[type="password"]', 'Spsrt.2026');
  await page.click('button[type="submit"]');
  await page.waitForSelector('aside', { timeout: 10000 });
  await page.waitForTimeout(1500);

  // Screenshot del sidebar
  const aside = await page.$('aside');
  await aside.screenshot({ path: 'debug-final-sidebar.png' });

  // Screenshot del borde derecho del sidebar (donde estaban los chars)
  await page.screenshot({ path: 'debug-final-edge.png', clip: { x: 240, y: 0, width: 100, height: 800 } });

  // Verificar elementos que tocan el borde derecho
  const edge = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    const rect = aside.getBoundingClientRect();
    const results = [];
    for (const el of aside.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (Math.abs(r.right - rect.right) < 8 && r.width > 0 && r.height > 0 && r.height < 80) {
        results.push({
          tag: el.tagName,
          class: el.className?.toString().slice(0, 60),
          y: Math.round(r.top),
          h: Math.round(r.height),
          text: el.textContent?.trim().slice(0, 30) ?? '',
        });
      }
    }
    return results;
  });
  console.log('Elementos en el borde derecho:', JSON.stringify(edge, null, 2));

  await browser.close();
})();
