const puppeteer = require('puppeteer-core');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:3000';

const USERS = [
  { name: 'rider', phone: '9000000010', pass: 'user123', routes: ['/dashboard','/ride-now','/ride-now/options','/ride-now/searching','/ride-now/confirm','/plan-commute','/plan-commute/matches','/plan-commute/confirm','/rides','/wallet','/wallet/transactions','/active-trip','/notifications','/profile','/profile/places','/safety','/safety/report','/schedules'] },
  { name: 'prodriver', phone: '9000000100', pass: 'user123', routes: ['/dashboard','/ride-now','/driver/online','/driver/requests','/driver/earnings','/driver/vehicles','/driver/offer-seat','/driver/offers','/driver/active','/rides','/wallet','/notifications','/profile'] },
  { name: 'both', phone: '9000000300', pass: 'user123', routes: ['/dashboard','/ride-now','/driver/online','/driver/earnings','/driver/requests','/plan-commute','/rides','/wallet','/notifications','/profile'] },
  { name: 'admin', phone: '9000000001', pass: 'admin123', routes: ['/dashboard','/admin','/admin/users','/admin/verification','/admin/disputes','/notifications','/profile'] },
];

async function login(page, phone, pass) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 20000 });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x => /password/i.test(x.textContent));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 300));
  const phoneInput = await page.$('input[type="tel"]');
  await phoneInput.click({ clickCount: 3 });
  await phoneInput.type(phone, { delay: 20 });
  const pwd = await page.$('input[type="password"]');
  await pwd.click({ clickCount: 3 });
  await pwd.type(pass, { delay: 20 });
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x => /sign\s*in/i.test(x.textContent) && !x.disabled);
    if (b) b.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1500));
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  for (const user of USERS) {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();

    const errors = [];
    const failedReqs = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
    page.on('response', r => { if (r.status() >= 400) failedReqs.push(`${r.status()} ${r.url().replace(BASE,'')}`); });

    console.log(`\n======== ${user.name} ========`);
    await login(page, user.phone, user.pass);
    if (page.url().includes('/login')) { console.log('LOGIN FAILED'); await ctx.close(); continue; }

    const auth = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('yaatra-auth') || '{}');
      return s?.state?.user;
    });
    console.log(`Auth: ${auth?.name} / role=${auth?.role}`);

    for (const route of user.routes) {
      errors.length = 0; failedReqs.length = 0;
      try {
        await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(r => setTimeout(r, 1500));
        const info = await page.evaluate(() => {
          const text = document.body.innerText;
          const issues = [];
          if (/undefined/.test(text)) issues.push('contains "undefined"');
          if (/NaN/.test(text)) issues.push('contains "NaN"');
          if (/\[object/.test(text)) issues.push('contains "[object"');
          if (/null/.test(text)) issues.push('contains "null"');
          const h1 = document.querySelector('h1')?.textContent || '(no h1)';
          const redirected = location.pathname;
          return { h1, issues, redirected };
        });
        const flags = [
          info.issues.length ? ` ⚠ ${info.issues.join(', ')}` : '',
          info.redirected !== route ? ` → REDIRECTED to ${info.redirected}` : '',
          errors.length ? ` ✗ console: ${errors.slice(0,2).join('; ')}` : '',
          failedReqs.length ? ` ✗ http: ${failedReqs.slice(0,3).join(', ')}` : '',
        ].join('');
        console.log(`${route} → h1="${info.h1}"${flags}`);
      } catch (e) {
        console.log(`${route} → ERROR: ${e.message.slice(0,100)}`);
      }
    }
    await ctx.close();
  }
  await browser.close();
}
main().catch(e => { console.error(e); process.exit(1); });
