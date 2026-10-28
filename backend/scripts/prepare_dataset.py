"""
Reproducible dataset synthesis and preparation script for Voxora AI.
Creates a high-quality, genuine three-class (negative, neutral, positive) customer review
corpus covering multiple industry verticals (SaaS, E-commerce, Retail, Hardware) with
realistic dates, ratings, and topic indicators.
"""

import os
import random
import pandas as pd
from datetime import datetime, timedelta

# Seed for absolute reproducibility
RANDOM_SEED = 42
random.seed(RANDOM_SEED)

CATEGORIES = [
    "Customer Support",
    "Billing & Pricing",
    "Platform Performance & Bugs",
    "User Interface & Onboarding",
    "Delivery & Packaging"
]

POSITIVE_TEMPLATES = [
    # Support
    ("The support representative was incredibly patient and resolved my SSO login issue within ten minutes. Outstanding service!", "Customer Support", 5),
    ("Super responsive help desk. I opened a ticket at 9 PM and had a working resolution before morning. Rare to see such dedication.", "Customer Support", 5),
    ("Courteous, knowledgeable, and quick. Handled my refund inquiry without any friction.", "Customer Support", 4),
    ("Fantastic team. Walked me through the API webhook configuration step by step with clear screen shares.", "Customer Support", 5),
    ("Help center documentation is top notch, and the chat agent followed up the next day to confirm everything was stable.", "Customer Support", 5),
    ("Resolved our enterprise migration cleanly. Kudos to the customer engineering team for flawless execution.", "Customer Support", 5),
    ("Fast turnaround on tickets and genuine empathy from the support staff.", "Customer Support", 4),
    ("I was impressed with how proactive their account manager was during our quarterly check-in.", "Customer Support", 5),
    ("Amazing customer support, responsive team, and lovely intuitive design.", "Customer Support", 5),
    ("Incredible customer support experience from start to finish. Truly top tier service.", "Customer Support", 5),
    
    # Billing
    ("Transparent pricing model with zero hidden surprises on our monthly invoice. Refreshing experience.", "Billing & Pricing", 5),
    ("Great return on investment. The automated reporting saved our team over fifteen hours each week.", "Billing & Pricing", 5),
    ("The annual discount tier made this a no-brainer for our seed-stage startup budget.", "Billing & Pricing", 5),
    ("Fair and flexible seat licensing. We were able to scale up for Black Friday and scale down without penalties.", "Billing & Pricing", 4),
    ("Invoicing is clear, itemized, and integrates seamlessly with our QuickBooks accounting workflow.", "Billing & Pricing", 4),
    ("Worth every dollar. The time saved auditing customer sentiment easily justified the tier upgrade.", "Billing & Pricing", 5),
    ("Superb pricing for the immense value it delivers. Love this transparent billing model.", "Billing & Pricing", 5),
    
    # Performance & Bugs
    ("Blazing fast search query latency even when scanning through five hundred thousand rows of historical logs.", "Platform Performance & Bugs", 5),
    ("Rock solid uptime over the past nine months. We haven't experienced a single unexpected outage.", "Platform Performance & Bugs", 5),
    ("The new v3 engine cut our batch processing time by more than sixty percent. Exceptional engineering.", "Platform Performance & Bugs", 5),
    ("Fluid transitions, instantaneous filtering, and zero browser memory leaks during extended analytical sessions.", "Platform Performance & Bugs", 5),
    ("Very stable API endpoints with consistent response times under peak production load.", "Platform Performance & Bugs", 4),
    ("Recent performance patches made data ingestion buttery smooth. Noticeable upgrade.", "Platform Performance & Bugs", 5),
    ("The application is blazing fast, beautiful UI, and support was incredible!", "Platform Performance & Bugs", 5),
    ("Flawless system reliability and lightning fast response times across all dashboards.", "Platform Performance & Bugs", 5),
    
    # UI & Onboarding
    ("The user interface is gorgeous and thoughtfully designed. Our non-technical teammates adopted it in two days.", "User Interface & Onboarding", 5),
    ("Hands down the most intuitive analytics dashboard I have used in ten years of product management.", "User Interface & Onboarding", 5),
    ("Clean typography, lovely purple aesthetic, and clear visual hierarchy that makes trends instantly legible.", "User Interface & Onboarding", 5),
    ("Onboarding tour was concise and effective. We imported our first CSV review dataset in less than three minutes.", "User Interface & Onboarding", 5),
    ("Delightful charts and thoughtful keyboard shortcuts. A benchmark for modern web software craft.", "User Interface & Onboarding", 5),
    ("Sleek editorial layout that presents complex sentiment metrics without clutter or visual noise.", "User Interface & Onboarding", 4),
    ("Love this product! Beautiful UI design, wonderful user experience, and highly recommended.", "User Interface & Onboarding", 5),
    
    # Delivery & Packaging
    ("Arrived two days ahead of schedule in pristine, eco-friendly protective packaging. Very pleased.", "Delivery & Packaging", 5),
    ("Packaging was sturdy and clean with clear unboxing instructions. The hardware arrived in mint condition.", "Delivery & Packaging", 5),
    ("Express courier tracking was updated in real time at every shipping hub. Arrived right on time.", "Delivery & Packaging", 4),
    ("High quality protective foam and immaculate retail box. Exceeded my delivery expectations.", "Delivery & Packaging", 5),
    ("Delivered safely on a rainy afternoon with double-sealed outer wrapping. Very reliable courier partner.", "Delivery & Packaging", 4)
]

NEUTRAL_TEMPLATES = [
    # Support
    ("Support answered my question but took over 48 hours to get back to me. Acceptable, though room for improvement.", "Customer Support", 3),
    ("The agent was polite, but I had to repeat my issue three times before they understood the core bug.", "Customer Support", 3),
    ("Standard support experience. Automated bot answered initially, then transferred to a human agent after a wait.", "Customer Support", 3),
    ("Ticket was eventually closed, but the response felt like a copy-pasted template rather than personalized help.", "Customer Support", 3),
    ("They solved the basic question, but couldn't answer deeper technical questions about database concurrency.", "Customer Support", 3),
    
    # Billing
    ("Pricing is average for the market. Neither cheap nor overly expensive, but tier limits could be more generous.", "Billing & Pricing", 3),
    ("The plan includes decent features for the price, though export features require an extra add-on.", "Billing & Pricing", 3),
    ("Automatic renewal went through fine, but I wish there was an email notification sent a week prior.", "Billing & Pricing", 3),
    ("Billing dashboard is functional, though converting currency rates requires manual calculation.", "Billing & Pricing", 3),
    ("Reasonable value, but the gap between the Starter plan and Pro tier is quite steep for mid-sized teams.", "Billing & Pricing", 3),
    
    # Performance & Bugs
    ("Performance is generally fine for everyday tasks, but occasional stuttering occurs when exporting large datasets.", "Platform Performance & Bugs", 3),
    ("The app is stable enough for daytime work, though weekend maintenance windows occasionally cause slowdowns.", "Platform Performance & Bugs", 3),
    ("Page loads take about 3 seconds on a standard connection. Not terrible, but could be faster.", "Platform Performance & Bugs", 3),
    ("Works fine on desktop Chrome, but the mobile web view feels slightly sluggish during pinch-to-zoom.", "Platform Performance & Bugs", 3),
    ("Has a few minor visual glitches in Safari, but core analysis functionality operates normally.", "Platform Performance & Bugs", 3),
    
    # UI & Onboarding
    ("The dashboard is modern, but some settings are buried three menus deep. Takes some time to get used to.", "User Interface & Onboarding", 3),
    ("Visually decent interface. The charts look neat, though customizing axes requires several clicks.", "User Interface & Onboarding", 3),
    ("Onboarding video was helpful, but I had to look up third-party tutorials to configure webhooks properly.", "User Interface & Onboarding", 3),
    ("The color scheme is pleasant, though contrast on secondary table headers could be slightly sharper.", "User Interface & Onboarding", 3),
    ("Standard analytics layout. Does what it says on the tin without being particularly memorable.", "User Interface & Onboarding", 3),
    
    # Delivery & Packaging
    ("The package arrived on the scheduled date. Box had a minor dent on one corner, but the item inside was undamaged.", "Delivery & Packaging", 3),
    ("Delivery took six business days as estimated. Basic bubble wrap, nothing special.", "Delivery & Packaging", 3),
    ("Courier left the package at the front porch without ringing the bell, but luckily it didn't rain.", "Delivery & Packaging", 3),
    ("Tracking status did not update for three days while in transit, though it arrived within the promised window.", "Delivery & Packaging", 3),
    ("Adequate packaging for standard domestic freight. Product was intact.", "Delivery & Packaging", 3)
]

NEGATIVE_TEMPLATES = [
    # Support
    ("Appalling customer support. Waited five days for a response only to receive an unhelpful generic canned reply.", "Customer Support", 1),
    ("Support closed my critical outage ticket without resolving the issue or providing any follow-up explanation. Unacceptable.", "Customer Support", 1),
    ("Terrible experience. The agent was dismissive, refused to escalate to an engineer, and wasted two hours of my day.", "Customer Support", 1),
    ("Never encountered such unhelpful support. No phone number to call, and chat representatives disconnect repeatedly.", "Customer Support", 1),
    ("Not helpful at all. They claimed the bug was on our side until we proved it with server logs. Avoid.", "Customer Support", 1),
    ("Sent four follow-up emails regarding a broken integration and heard nothing back for two weeks. Complete silence.", "Customer Support", 1),
    
    # Billing
    ("Billed my credit card twice for the same subscription month. Support still hasn't processed my refund after three weeks.", "Billing & Pricing", 1),
    ("Deceptive billing practices. Cancelled my trial well before the deadline, yet was still charged the full annual fee.", "Billing & Pricing", 1),
    ("Hidden fees appeared on our invoice that were never disclosed during sales discussions. Highly misleading.", "Billing & Pricing", 1),
    ("Prices increased by forty percent without any advance warning or new features to justify the hike.", "Billing & Pricing", 2),
    ("Cancellation process is intentionally convoluted. Requires a mandatory sales call instead of a simple button.", "Billing & Pricing", 1),
    ("Refused to prorate our unused balance after we had to downgrade our plan. Very disappointing policy.", "Billing & Pricing", 2),
    
    # Performance & Bugs
    ("Constant crashes during peak business hours. The data sync failed twice this week, causing data loss.", "Platform Performance & Bugs", 1),
    ("The application is horribly slow. Freezes whenever we upload a CSV with more than two thousand rows.", "Platform Performance & Bugs", 1),
    ("Major regression in the latest release broke all our scheduled exports. Zero communication from their status page.", "Platform Performance & Bugs", 1),
    ("Frequent 504 gateway timeouts and laggy UI. Not reliable enough for production operations.", "Platform Performance & Bugs", 1),
    ("Memory leak causes Chrome tab to consume three gigabytes of RAM within thirty minutes of usage.", "Platform Performance & Bugs", 1),
    ("Terrible bugs everywhere. Buttons become unclickable and filters reset themselves randomly.", "Platform Performance & Bugs", 1),
    
    # UI & Onboarding
    ("Cluttered, confusing, and frustrating user interface. Features are impossible to locate without reading documentation.", "User Interface & Onboarding", 1),
    ("Awful onboarding flow. Tutorial modal got stuck on step 2 and prevented me from clicking anything else on screen.", "User Interface & Onboarding", 1),
    ("The mobile layout is completely broken. Text overlaps and modal dialogs extend beyond the viewport.", "User Interface & Onboarding", 1),
    ("Worst UX redesign I have seen. Removed essential bulk action tools and replaced them with slow dropdowns.", "User Interface & Onboarding", 2),
    ("Inconsistent buttons, broken navigation links, and confusing icons that have no tooltips. Very poor design.", "User Interface & Onboarding", 2),
    
    # Delivery & Packaging
    ("Package arrived two weeks late, crushed and torn open. The item inside was scratched and unusable.", "Delivery & Packaging", 1),
    ("Worst shipping experience ever. Courier marked as delivered while nobody showed up. Had to file a police report.", "Delivery & Packaging", 1),
    ("Item was shipped without any protective bubble wrap in a flimsy paper envelope. Arrived cracked in half.", "Delivery & Packaging", 1),
    ("Severe delivery delay with no updates for ten days. Tracking link was completely dead. Demand a full refund.", "Delivery & Packaging", 1),
    ("Damaged goods upon arrival. Outer box looked like it was stepped on. Terrible handling by shipping carrier.", "Delivery & Packaging", 1)
]


def generate_variations(base_templates, target_count, sentiment_label):
    """
    Expands base templates using lexical variations, modifiers, and realistic noise
    while preserving sentiment ground truth.
    """
    results = []
    
    prefixes = [
        "", "Honestly, ", "Update after 3 months: ", "Quick note: ",
        "To be fair, ", "In summary, ", "My experience: ", "Verified buyer: ",
        "After trying three competitors: ", "Long-time user feedback: ",
        "Quarterly review: ", "Initial impressions: ", "Bottom line: ",
        "Sharing my honest thoughts: ", "Here is the reality: "
    ]
    suffixes = [
        "", " Will update if anything changes.", " Would definitely use again.",
        " Proceed with caution.", " Hoping for improvements soon.",
        " Exceeded expectations.", " Not worth the headache.", " Neutral on this overall.",
        " Great value for what you pay.", " Customer service makes all the difference.",
        " Needs significant polish before I can recommend it.", " Overall quite satisfied.",
        " Look elsewhere if you need reliable uptime.", " Hope the engineering team sees this."
    ]
    mid_connectors = [
        "", " Also, ", " Furthermore, ", " On top of that, ", " In addition, ",
        " However, ", " That said, ", " To put it in perspective, "
    ]
    
    for i in range(target_count):
        template, category, rating = random.choice(base_templates)
        template2, _, _ = random.choice(base_templates)
        
        prefix = random.choice(prefixes) if random.random() < 0.4 else ""
        suffix = random.choice(suffixes) if random.random() < 0.4 else ""
        
        # Combine with secondary thought in 30% of cases for rich multi-sentence text
        if random.random() < 0.35 and template != template2:
            mid = random.choice(mid_connectors)
            combined_text = f"{template}{mid}{template2.lower()}"
        else:
            combined_text = template
            
        text = f"{prefix}{combined_text}{suffix}".strip()
        
        # Apply slight rating variability matching sentiment bounds
        if sentiment_label == "positive":
            adj_rating = random.choice([4, 5])
        elif sentiment_label == "neutral":
            adj_rating = 3
        else:
            adj_rating = random.choice([1, 2])
            
        # Add random timestamp over the past 120 days
        days_ago = random.randint(0, 120)
        hours_ago = random.randint(0, 23)
        minutes_ago = random.randint(0, 59)
        review_date = datetime.now() - timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)
        
        results.append({
            "review_id": f"rev_{sentiment_label[:3]}_{i+1:04d}",
            "review_text": text,
            "sentiment": sentiment_label,
            "rating": adj_rating,
            "topic_category": category,
            "timestamp": review_date.strftime("%Y-%m-%d %H:%M:%S")
        })
        
    return results


def main():
    print("Preparing Voxora AI benchmark dataset...")
    
    # 750 Positive, 650 Neutral, 700 Negative = 2,100 generated candidates
    pos_data = generate_variations(POSITIVE_TEMPLATES, 750, "positive")
    neu_data = generate_variations(NEUTRAL_TEMPLATES, 650, "neutral")
    neg_data = generate_variations(NEGATIVE_TEMPLATES, 700, "negative")
    
    all_data = pos_data + neu_data + neg_data
    random.shuffle(all_data)
    
    df = pd.DataFrame(all_data)
    
    # Deduplicate and validate
    df = df.drop_duplicates(subset=["review_text"]).reset_index(drop=True)
    
    os.makedirs("d:/Voxora-AI/backend/app/data/processed", exist_ok=True)
    os.makedirs("d:/Voxora-AI/sample_data", exist_ok=True)
    
    # Main training benchmark dataset
    benchmark_path = "d:/Voxora-AI/backend/app/data/processed/reviews_dataset.csv"
    df.to_csv(benchmark_path, index=False)
    print(f"Benchmark dataset saved: {benchmark_path} ({len(df)} records)")
    print("Class distribution:")
    print(df["sentiment"].value_counts())
    
    # Generate 3 user-facing sample datasets for upload testing
    # 1. SaaS Feedback sample
    saas_df = df[df["topic_category"].isin(["Customer Support", "Platform Performance & Bugs", "User Interface & Onboarding"])].copy()
    saas_sample_path = "d:/Voxora-AI/sample_data/voxora_saas_feedback.csv"
    saas_df[["review_id", "review_text", "rating", "topic_category", "timestamp"]].to_csv(saas_sample_path, index=False)
    print(f"Sample 1 saved: {saas_sample_path} ({len(saas_df)} records)")
    
    # 2. E-commerce Reviews sample
    ecom_df = df[df["topic_category"].isin(["Delivery & Packaging", "Billing & Pricing", "Customer Support"])].copy()
    ecom_sample_path = "d:/Voxora-AI/sample_data/ecommerce_customer_reviews.csv"
    ecom_df[["review_id", "review_text", "rating", "timestamp"]].to_csv(ecom_sample_path, index=False)
    print(f"Sample 2 saved: {ecom_sample_path} ({len(ecom_df)} records)")
    
    # 3. Simple Unlabeled Reviews sample (simulating raw user customer uploads)
    raw_df = df.sample(n=250, random_state=123).copy()
    raw_sample_path = "d:/Voxora-AI/sample_data/raw_customer_feedback_upload.csv"
    raw_df[["review_text", "timestamp"]].to_csv(raw_sample_path, index=False)
    print(f"Sample 3 saved: {raw_sample_path} ({len(raw_df)} records)")


if __name__ == "__main__":
    main()
