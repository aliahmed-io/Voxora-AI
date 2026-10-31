import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function main() {
  const docsDir = path.resolve("..", "docs", "images");
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Capture Landing Page Hero
  console.log("Navigating to Landing Page...");
  await page.goto("http://localhost:3004/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const landingPath = path.join(docsDir, "01_landing_hero.png");
  await page.screenshot({ path: landingPath });
  console.log(`Saved: ${landingPath}`);

  // 2. Capture Executive Dashboard
  console.log("Navigating to Executive Dashboard...");
  await page.goto("http://localhost:3004/dashboard", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const dashPath = path.join(docsDir, "02_executive_dashboard.png");
  await page.screenshot({ path: dashPath });
  console.log(`Saved: ${dashPath}`);

  // 3. Capture Model Tournament & Diagnostic Laboratory
  console.log("Navigating to Model Tournament & Attributions...");
  await page.goto("http://localhost:3004/model", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const modelPath = path.join(docsDir, "03_model_tournament.png");
  await page.screenshot({ path: modelPath });
  console.log(`Saved: ${modelPath}`);

  await browser.close();
  console.log("All 3 README images captured successfully.");
}

main().catch(console.error);
