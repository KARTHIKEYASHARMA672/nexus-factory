import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function verify() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  console.log('Navigating to http://localhost:4173/ ...');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

  // Ensure screenshots dir exists
  const ssDir = path.resolve('screenshots');
  if (!fs.existsSync(ssDir)) {
    fs.mkdirSync(ssDir, { recursive: true });
  }

  // 1. Screenshot Dashboard
  await page.screenshot({ path: path.join(ssDir, '01_command_center.png'), fullPage: false });
  console.log('Captured 01_command_center.png');

  // 2. Click Step Month Button 3 times
  const stepButton = page.locator('button:has-text("Step +1 Mo")');
  await stepButton.click();
  await page.waitForTimeout(300);
  await stepButton.click();
  await page.waitForTimeout(300);
  await stepButton.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(ssDir, '02_month4_stepped.png'), fullPage: false });
  console.log('Captured 02_month4_stepped.png after stepping to Month 4');

  // 3. Switch to War Room Tab
  await page.click('button:has-text("Executive War Room")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ssDir, '03_executive_war_room.png'), fullPage: false });
  console.log('Captured 03_executive_war_room.png');

  // 4. Switch to Market & Competitors Tab
  await page.click('button:has-text("Market & Competitors")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ssDir, '04_market_competitors.png'), fullPage: false });
  console.log('Captured 04_market_competitors.png');

  // 5. Switch to Financial Ledger Tab
  await page.click('button:has-text("Financial Ledger & P&L")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ssDir, '05_financial_ledger.png'), fullPage: false });
  console.log('Captured 05_financial_ledger.png');

  // 6. Switch to Marketing Lab Tab
  await page.click('button:has-text("Marketing Lab (A/B)")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ssDir, '06_marketing_lab.png'), fullPage: false });
  console.log('Captured 06_marketing_lab.png');

  // 7. Switch to Strategic Branches Tab
  await page.click('button:has-text("Strategic Branches")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ssDir, '07_strategic_branches.png'), fullPage: false });
  console.log('Captured 07_strategic_branches.png');

  // 8. Open Board Directive Modal
  await page.click('button:has-text("Board Directive")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ssDir, '08_board_directive_modal.png'), fullPage: false });
  console.log('Captured 08_board_directive_modal.png');

  await browser.close();

  console.log('Verification finished.');
  console.log('Console errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Errors found:', consoleErrors);
    process.exit(1);
  } else {
    console.log('ALL CHECKS PASSED: 0 CONSOLE ERRORS, 8 SCREENSHOTS CAPTURED!');
  }
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
