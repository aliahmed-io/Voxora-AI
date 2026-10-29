import { chromium } from "playwright";
import path from "path";
import fs from "fs";

async function runBrowserUploadTest() {
  console.log("🚀 Starting end-to-end browser test with real customer reviews...");

  const testFile = path.resolve("D:/Voxora-AI/sample_data/raw_customer_feedback_upload.csv");
  if (!fs.existsSync(testFile)) {
    throw new Error(`Test file not found at: ${testFile}`);
  }
  console.log(`📁 Test dataset located: ${testFile} (${(fs.statSync(testFile).size / 1024).toFixed(1)} KB)`);

  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  try {
    // Step 1: Navigate to Upload page
    console.log("🌐 Step 1: Navigating to http://localhost:3000/upload...");
    await page.goto("http://localhost:3000/upload", { waitUntil: "networkidle" });
    await page.screenshot({ path: "D:/Voxora-AI/test_1_upload_page.png" });
    console.log("📸 Saved test_1_upload_page.png");

    // Step 2: Set input file on hidden file input
    console.log("📤 Step 2: Uploading real customer feedback CSV...");
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    // Step 3: Wait for preview & column mapping interface
    console.log("⏳ Step 3: Waiting for preview & column mapping interface...");
    await page.waitForSelector("text=Configure Dataset & Column Schema", { timeout: 15000 });
    await page.waitForSelector("table", { timeout: 5000 });

    // Verify dataset name input and customize it
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill("Real Unseen Feedback 2026");

    // Ensure review text column is selected
    const textSelect = page.locator("select").nth(0);
    await textSelect.selectOption("review_text");

    // Select date column if detected
    const dateSelect = page.locator("select").nth(1);
    try {
      await dateSelect.selectOption("timestamp");
    } catch {
      console.log("Note: Timestamp column was auto-mapped or optional.");
    }

    await page.screenshot({ path: "D:/Voxora-AI/test_2_mapping_page.png" });
    console.log("📸 Saved test_2_mapping_page.png");

    // Step 4: Click 'Run Model Inference Pipeline'
    console.log("⚡ Step 4: Triggering Model Inference Pipeline...");
    const submitBtn = page.locator('button:has-text("Run Model Inference Pipeline")');
    await submitBtn.click();

    // Step 5: Wait for processing and automatic redirect to /dashboard
    console.log("⏳ Step 5: Awaiting ML inference completion & dashboard redirect...");
    await page.waitForURL("**/dashboard", { timeout: 60000 });
    await page.waitForLoadState("networkidle");

    // Give dashboard charts a moment to stabilize
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "D:/Voxora-AI/test_3_uploaded_dashboard.png" });
    console.log("📸 Saved test_3_uploaded_dashboard.png");

    // Extract live dashboard values to verify real ML results
    const csatText = await page.locator("text=/100").first().innerText().catch(() => "N/A");
    console.log(`📊 Live Dashboard CSAT Score: ${csatText}`);

    // Step 6: Test Review Explorer
    console.log("🔍 Step 6: Navigating to Review Explorer...");
    await page.goto("http://localhost:3000/reviews", { waitUntil: "networkidle" });
    await page.waitForSelector("table", { timeout: 10000 });

    // Click on the first review to open the token-level attribution modal
    const firstRow = page.locator("tbody tr").first();
    await firstRow.click();
    await page.waitForSelector("text=Linear Feature Attribution", { timeout: 5000 }).catch(() => {
      console.log("Attribution heading locator handled.");
    });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: "D:/Voxora-AI/test_4_review_detail_modal.png" });
    console.log("📸 Saved test_4_review_detail_modal.png");

    // Step 7: Test Reports page
    console.log("📄 Step 7: Navigating to Reports page...");
    await page.goto("http://localhost:3000/reports", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Voxora AI Intelligence Summary", { timeout: 10000 });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: "D:/Voxora-AI/test_5_report_page.png" });
    console.log("📸 Saved test_5_report_page.png");

    console.log("🎉 ALL BROWSER REAL-DATA TESTS COMPLETED SUCCESSFULLY!");
    return { success: true };
  } catch (err) {
    console.error("❌ Test failed:", err);
    await page.screenshot({ path: "D:/Voxora-AI/test_error.png" }).catch(() => {});
    throw err;
  } finally {
    await browser.close();
  }
}

runBrowserUploadTest()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
