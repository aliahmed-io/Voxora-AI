import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("1. Navigating to http://localhost:3004/dashboard...");
  await page.goto("http://localhost:3004/dashboard", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Check header dataset button
  const dsButton = page.locator("header button:has-text('Voxora'), header button:has-text('raw_')").first();
  const dsText = await dsButton.innerText();
  console.log("Current header active dataset:", dsText.replace(/\n/g, " "));

  await page.screenshot({ path: "verify_final_dash.png" });
  console.log("Captured verify_final_dash.png");

  // Check sidebar collections
  const collectionLinks = page.locator("aside a[href*='reviews?topic=']");
  const count = await collectionLinks.count();
  console.log(`2. Found ${count} collections in sidebar.`);

  if (count > 0) {
    const firstCol = collectionLinks.first();
    const colName = await firstCol.innerText();
    console.log("Clicking first collection:", colName.replace(/\n/g, " "));
    await firstCol.click();
    await page.waitForTimeout(2000);

    console.log("URL after clicking collection:", page.url());
    await page.screenshot({ path: "verify_final_reviews_filtered.png" });
    console.log("Captured verify_final_reviews_filtered.png");

    // Click second collection
    if (count > 1) {
      const secondCol = page.locator("aside a[href*='reviews?topic=']").nth(1);
      const col2Name = await secondCol.innerText();
      console.log("Clicking second collection:", col2Name.replace(/\n/g, " "));
      await secondCol.click();
      await page.waitForTimeout(2000);
      console.log("URL after clicking second collection:", page.url());
      await page.screenshot({ path: "verify_final_collection_switch.png" });
      console.log("Captured verify_final_collection_switch.png");
    }
  }

  // Test switching dataset to raw_customer_feedback_upload
  console.log("3. Testing switching dataset in Navbar dropdown...");
  const headerBtn = page.locator("header button:has-text('Voxora'), header button:has-text('raw_')").first();
  await headerBtn.click();
  await page.waitForTimeout(500);

  const rawItem = page.locator("button:has-text('raw_customer_feedback_upload')").first();
  if (await rawItem.count() > 0) {
    await rawItem.click();
    await page.waitForTimeout(2000);
    console.log("Switched to raw_customer_feedback_upload!");
    await page.screenshot({ path: "verify_final_dataset_switch.png" });
    console.log("Captured verify_final_dataset_switch.png");
  }

  await browser.close();
  console.log("All verifications completed successfully!");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
