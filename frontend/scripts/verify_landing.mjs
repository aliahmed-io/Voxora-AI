import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Navigating to http://localhost:3004...");
  await page.goto("http://localhost:3004", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // 1. Hero Screenshot
  await page.screenshot({ path: "verify_landing_hero.png" });
  console.log("Captured verify_landing_hero.png");

  // 2. Click Tab 2 (Token Microscope) in Hero Showcase
  const tokenTab = page.locator("button:has-text('Token Heatmap')");
  if (await tokenTab.count() > 0) {
    await tokenTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "verify_landing_token_tab.png" });
    console.log("Captured verify_landing_token_tab.png");
  }

  // 3. Scroll to Sandbox section and test live inference
  const sandbox = page.locator("#sandbox");
  await sandbox.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Click the "Outage & Churn" preset chip in sandbox
  const outageChip = page.locator("#sandbox button:has-text('Outage & Churn')");
  if (await outageChip.count() > 0) {
    await outageChip.click();
    await page.waitForTimeout(2000);
    console.log("Clicked Outage & Churn preset in sandbox.");
  }
  await page.screenshot({ path: "verify_landing_sandbox.png" });
  console.log("Captured verify_landing_sandbox.png");

  // 4. Scroll to Pillars section
  const pillars = page.locator("#pillars");
  await pillars.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "verify_landing_pillars.png" });
  console.log("Captured verify_landing_pillars.png");

  // 5. Scroll to Benchmark comparison matrix
  const benchmark = page.locator("#benchmark");
  await benchmark.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "verify_landing_benchmark.png" });
  console.log("Captured verify_landing_benchmark.png");

  // 6. Scroll to Footer / Executive CTA
  const personas = page.locator("#personas");
  await personas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "verify_landing_personas_cta.png" });
  console.log("Captured verify_landing_personas_cta.png");

  await browser.close();
  console.log("Landing page visual verification finished successfully.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
