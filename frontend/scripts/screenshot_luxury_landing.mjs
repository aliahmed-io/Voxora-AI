import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Navigating to http://localhost:3004...");
  await page.goto("http://localhost:3004", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // 1. Hero Screenshot
  await page.screenshot({ path: "luxury_01_hero.png" });
  console.log("Captured luxury_01_hero.png");

  // 2. The Voxora Method
  const method = page.locator("#method");
  await method.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "luxury_02_method.png" });
  console.log("Captured luxury_02_method.png");

  // 3. The Laboratory
  const lab = page.locator("#laboratory");
  await lab.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  
  // Click "Enterprise Migration Delight" preset
  const delightBtn = page.locator("#laboratory button:has-text('Enterprise Migration Delight')");
  if (await delightBtn.count() > 0) {
    await delightBtn.click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: "luxury_03_laboratory.png" });
  console.log("Captured luxury_03_laboratory.png");

  // 4. Latent Topology
  const topology = page.locator("#topology");
  await topology.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Click "Support Resolution & SLA Speed"
  const supportBtn = page.locator("#topology button:has-text('Support Resolution & SLA Speed')");
  if (await supportBtn.count() > 0) {
    await supportBtn.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: "luxury_04_topology.png" });
  console.log("Captured luxury_04_topology.png");

  // 5. Defensibility Matrix
  const defensibility = page.locator("#defensibility");
  await defensibility.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "luxury_05_defensibility.png" });
  console.log("Captured luxury_05_defensibility.png");

  // 6. Datasets & CTA
  const datasets = page.locator("#datasets");
  await datasets.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "luxury_06_datasets.png" });
  console.log("Captured luxury_06_datasets.png");

  await browser.close();
  console.log("All luxury screenshots captured successfully.");
}

main().catch(console.error);
