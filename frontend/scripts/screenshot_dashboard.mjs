import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. Dashboard screenshot
  console.log("Navigating to http://localhost:3000/dashboard...");
  await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // Capture the two middle cards (TimeSeries & Radar)
  const trajectoryCard = page.locator("text=Sentiment Trajectory").locator("xpath=ancestor::div[contains(@class, 'rounded-3xl')][1]");
  if (await trajectoryCard.count() > 0) {
    await trajectoryCard.first().screenshot({ path: "trajectory_card.png" });
    console.log("Captured trajectory_card.png");
  }

  const radarCard = page.locator("text=Topic Resonance Vector").locator("xpath=ancestor::div[contains(@class, 'rounded-3xl')][1]");
  if (await radarCard.count() > 0) {
    await radarCard.first().screenshot({ path: "radar_card.png" });
    console.log("Captured radar_card.png");
  }

  await page.screenshot({ path: "dash_full_view.png" });
  console.log("Captured dash_full_view.png");

  // 2. Model Evaluation page screenshot
  console.log("Navigating to http://localhost:3000/model...");
  await page.goto("http://localhost:3000/model", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const championBanner = page.locator("text=Tournament Champion Model").locator("xpath=ancestor::div[contains(@class, 'rounded-3xl')][1]");
  if (await championBanner.count() > 0) {
    await championBanner.first().screenshot({ path: "champion_banner.png" });
    console.log("Captured champion_banner.png");
  }
  await page.screenshot({ path: "model_page_full.png" });
  console.log("Captured model_page_full.png");

  // 3. Reviews page screenshot
  console.log("Navigating to http://localhost:3000/reviews...");
  await page.goto("http://localhost:3000/reviews", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "reviews_page_full.png" });
  console.log("Captured reviews_page_full.png");

  await browser.close();
  console.log("All screenshots captured successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
