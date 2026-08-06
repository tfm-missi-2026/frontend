// Debug más específico: capturar SOLO el sidebar y hacer zoom en el borde derecho
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2, // más resolución
  });
  const page = await context.newPage();

  await page.goto('http://localhost:4200/signin', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'marcos.pacheco@institucion.gob.pe');
  await page.fill('input[type="password"]', 'Spsrt.2026');
  await page.click('button[type="submit"]');
  await page.waitForSelector('aside', { timeout: 10000 });
  await page.waitForTimeout(1500);

  // Screenshot solo del aside
  const aside = await page.$('aside');
  await aside.screenshot({ path: 'debug-sidebar-only.png' });

  // Screenshot con zoom del borde derecho (x=200 a x=320, y=0 a y=800)
  await page.screenshot({ path: 'debug-sidebar-edge.png', clip: { x: 200, y: 0, width: 130, height: 800 } });

  // Identificar EXACTAMENTE qué elemento está en x=275-285, y=130-330
  const edgeElements = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    if (!aside) return [];
    const rect = aside.getBoundingClientRect();
    const results = [];
    const all = aside.querySelectorAll('*');
    for (const el of all) {
      const r = el.getBoundingClientRect();
      // Elementos cuyo right está cerca del borde derecho del aside
      if (Math.abs(r.right - rect.right) < 15 && r.width > 0 && r.height > 0 && r.height < 100) {
        const text = el.textContent?.trim().slice(0, 30) ?? '';
        results.push({
          tag: el.tagName,
          class: el.className?.toString().slice(0, 80),
          x: Math.round(r.left),
          y: Math.round(r.top),
          width: Math.round(r.width),
          height: Math.round(r.height),
          text,
          html: el.outerHTML.slice(0, 200),
        });
      }
    }
    return results.sort((a, b) => a.y - b.y);
  });
  console.log('ELEMENTOS CERCA DEL BORDE DERECHO:');
  console.log(JSON.stringify(edgeElements, null, 2));

  await browser.close();
})();
