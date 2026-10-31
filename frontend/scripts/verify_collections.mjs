import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Navigating to http://localhost:3004/dashboard...");
  await page.goto("http://localhost:3004/dashboard", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "verify_dash_seed.png" });
  console.log("Captured verify_dash_seed.png");

  // Check dataset selector text
  const dsButton = page.locator("header button:has-text('Voxora'), header button:has-text('raw_')");
  if (await dsButton.count() > 0) {
    console.log("Active dataset in header:", await dsButton.first().innerText());
  }

  // Check collections in sidebar
  const collectionLinks = page.locator("aside a[href*='reviews?topic=']");
  const count = await collectionLinks.count();
  console.log(`Found ${count} collection links in sidebar.`);

  if (count > 0) {
    const firstCol = collectionLinks.first();
    const colName = await firstCol.innerText();
    console.log("Clicking collection:", colName.replace(/\n/g, " "));
    await firstCol.click();
    console.log("URL after navigation:", page.url());
    await page.screenshot({ path: "verify_collection_page.png" });
    console.log("Captured verify_collection_page.png");
  }

  // Test switching dataset to 'Voxora Enterprise SaaS Feedback'
  console.log("Navigating back to dashboard to switch dataset...");
  await page.goto("http://localhost:3004/dashboard", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const dsMenuBtn = page.locator("header button:has-text('raw_'), header button:has-text('Voxora')").first();
  await dsMenuBtn.click();
  await page.waitForTimeout(500);
  const voxoraItem = page.locator("button:has-text('Voxora Enterprise SaaS Feedback')").first();
  if (await voxoraItem.count() > 0) {
    console.log("Selecting Voxora Enterprise SaaS Feedback (986 rows)...");
    await voxoraItem.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "verify_voxora_saas_dash.png" });
    console.log("Captured verify_voxora_saas_dash.png");
  }

  await browser.close();
  console.log("Verification completed successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
