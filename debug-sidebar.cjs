// Debug script: renderiza la página con Playwright y extrae el HTML del sidebar
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  // Login automático via mock user
  await page.goto('http://localhost:4200/signin', { waitUntil: 'networkidle' });

  // Rellenar credenciales del usuario mock
  await page.fill('input[type="email"]', 'marcos.pacheco@institucion.gob.pe');
  await page.fill('input[type="password"]', 'Spsrt.2026');
  await page.click('button[type="submit"]');

  // Esperar a que el sidebar renderice
  await page.waitForSelector('aside', { timeout: 10000 });
  await page.waitForTimeout(1500);

  // Screenshot para inspección visual
  await page.screenshot({ path: 'debug-sidebar.png', fullPage: false });

  // Extraer el HTML del sidebar
  const sidebarHtml = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    return aside ? aside.outerHTML : 'NO ASIDE FOUND';
  });
  require('fs').writeFileSync('debug-sidebar.html', sidebarHtml);

  // Buscar elementos en el borde derecho del sidebar (x > 240 para sidebar de 290px)
  const edgeElements = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    if (!aside) return [];
    const rect = aside.getBoundingClientRect();
    const results = [];
    // Buscar todos los elementos cuyo bounding rect toque el borde derecho
    const all = aside.querySelectorAll('*');
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (r.right > rect.right - 1 && r.width > 0 && r.height > 0) {
        const text = el.textContent?.trim().slice(0, 50) ?? '';
        results.push({
          tag: el.tagName,
          class: el.className?.toString().slice(0, 80),
          right: Math.round(r.right - rect.right),
          width: Math.round(r.width),
          height: Math.round(r.height),
          text,
        });
      }
    }
    return results;
  });
  console.log('ELEMENTOS EN EL BORDE DERECHO:');
  console.log(JSON.stringify(edgeElements, null, 2));

  // Listar SVGs que se renderizan dentro del sidebar
  const svgs = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    if (!aside) return [];
    const svgs = aside.querySelectorAll('svg');
    return Array.from(svgs).map(s => ({
      width: s.getAttribute('width'),
      height: s.getAttribute('height'),
      viewBox: s.getAttribute('viewBox'),
      parentClass: s.parentElement?.className?.toString().slice(0, 60),
      bbox: s.getBoundingClientRect(),
    }));
  });
  console.log('\nSVGs EN EL SIDEBAR:');
  console.log(JSON.stringify(svgs, null, 2));

  await browser.close();
  console.log('\nScreenshot saved: debug-sidebar.png');
  console.log('HTML saved: debug-sidebar.html');
})();
