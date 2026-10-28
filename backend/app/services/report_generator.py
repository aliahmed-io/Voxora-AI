"""
Executive PDF Report Generator for Voxora AI using ReportLab.
Produces a publication-quality, branded customer intelligence report.
"""

import io
import json
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether
)

# Brand Color Palette
PRIMARY_VIOLET = colors.HexColor("#6D4AFF")
SOFT_LAVENDER = colors.HexColor("#B6A4FF")
BACKGROUND_LAV = colors.HexColor("#F5F2FF")
INK_DARK = colors.HexColor("#161327")
INK_MUTED = colors.HexColor("#625D7E")
AMBER_ACCENT = colors.HexColor("#FFB86B")
SUCCESS_EMERALD = colors.HexColor("#10B981")
DANGER_ROSE = colors.HexColor("#F43F5E")


def generate_pdf_report(dataset_name: str, summary_stats: dict, eval_metrics: dict = None) -> io.BytesIO:
    """
    Renders a comprehensive, styled PDF analysis report in an in-memory buffer.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    title_style = ParagraphStyle(
        "VoxoraTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        textColor=PRIMARY_VIOLET
    )
    subtitle_style = ParagraphStyle(
        "VoxoraSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        leading=16,
        textColor=INK_MUTED
    )
    section_h1 = ParagraphStyle(
        "VoxoraH1",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=INK_DARK,
        spaceBefore=14,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        "VoxoraBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=INK_DARK
    )
    callout_style = ParagraphStyle(
        "VoxoraCallout",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=9,
        leading=13,
        textColor=INK_MUTED
    )

    story = []

    # 1. Header Banner
    story.append(Paragraph("VOXORA AI", title_style))
    story.append(Paragraph(f"Executive Customer Feedback Intelligence Report &bull; Dataset: {dataset_name}", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY_VIOLET, spaceBefore=8, spaceAfter=14))

    # 2. Executive KPI Summary Cards Table
    score = summary_stats.get("sentiment_score", 0)
    total_revs = summary_stats.get("total_reviews", 0)
    dist = summary_stats.get("distribution", {})
    pcts = summary_stats.get("percentages", {})

    pos_pct = pcts.get("positive", 0.0)
    neu_pct = pcts.get("neutral", 0.0)
    neg_pct = pcts.get("negative", 0.0)

    kpi_data = [
        [
            Paragraph("<b>CUSTOMER SENTIMENT SCORE</b>", subtitle_style),
            Paragraph("<b>TOTAL REVIEWS</b>", subtitle_style),
            Paragraph("<b>SENTIMENT HEALTH</b>", subtitle_style)
        ],
        [
            Paragraph(f"<font size=20 color='#6D4AFF'><b>{score} / 100</b></font>", body_style),
            Paragraph(f"<font size=20 color='#161327'><b>{total_revs:,}</b></font>", body_style),
            Paragraph(f"<font color='#10B981'><b>{pos_pct}% Pos</b></font> &bull; "
                      f"<font color='#F59E0B'><b>{neu_pct}% Neu</b></font> &bull; "
                      f"<font color='#F43F5E'><b>{neg_pct}% Neg</b></font>", body_style)
        ]
    ]

    kpi_table = Table(kpi_data, colWidths=[180, 150, 200])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BACKGROUND_LAV),
        ('BOX', (0, 0), (-1, -1), 1, SOFT_LAVENDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, SOFT_LAVENDER),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(kpi_table)
    story.append(Spacer(1, 14))

    # 3. Topic Intelligence Breakdown Table
    story.append(Paragraph("1. Discovered Feedback Topics (NMF Modeling)", section_h1))
    story.append(Paragraph("Topic clustering isolated five latent business themes from review vocabulary:", body_style))
    story.append(Spacer(1, 6))

    topics = summary_stats.get("topics", [])
    topic_table_data = [
        ["Topic Cluster", "Volume", "% Share", "Pos", "Neu", "Neg", "Dominant Keywords"]
    ]

    for t in topics:
        s_dist = t.get("sentiment_distribution", {})
        kws = ", ".join(t.get("top_keywords", [])[:4])
        topic_table_data.append([
            t["name"],
            f"{t['review_count']:,}",
            f"{t['percentage']}%",
            str(s_dist.get("positive", 0)),
            str(s_dist.get("neutral", 0)),
            str(s_dist.get("negative", 0)),
            kws
        ])

    topic_table = Table(topic_table_data, colWidths=[130, 45, 45, 35, 35, 35, 205])
    topic_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_VIOLET),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2DCF8")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BACKGROUND_LAV]),
    ]))
    story.append(topic_table)
    story.append(Spacer(1, 14))

    # 4. Primary Customer Dissatisfaction Drivers
    story.append(Paragraph("2. Top Customer Friction Points & Complaints", section_h1))
    complaints = summary_stats.get("top_complaints", [])
    if complaints:
        comp_data = [["Friction Area", "Negative Count", "% of All Negative", "Primary Trigger Terms"]]
        for c in complaints:
            comp_data.append([
                c["category"],
                f"{c['negative_count']:,}",
                f"{c['negative_percentage']}%",
                ", ".join(c.get("primary_issues", [])[:4])
            ])
        comp_table = Table(comp_data, colWidths=[160, 80, 100, 190])
        comp_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#2B234A")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2DCF8")),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FFF7F8")]),
        ]))
        story.append(comp_table)
    else:
        story.append(Paragraph("No severe complaint clusters recorded in this dataset partition.", body_style))

    story.append(Spacer(1, 14))

    # 5. Academic Model Evaluation & Rigor
    story.append(Paragraph("3. Machine Learning Methodology & Evaluation", section_h1))
    if eval_metrics and "champion" in eval_metrics:
        champ = eval_metrics["champion"]
        test_m = champ.get("test_metrics", {})
        story.append(Paragraph(
            f"<b>Champion Model:</b> {champ.get('model_name')}<br/>"
            f"<b>Test Set Accuracy:</b> {test_m.get('accuracy', 0) * 100:.2f}% &bull; "
            f"<b>Test Macro F1:</b> {test_m.get('macro_f1', 0):.4f} &bull; "
            f"<b>Inference Latency:</b> {test_m.get('inference_latency_us', 0)} &micro;s/review",
            body_style
        ))
        story.append(Spacer(1, 4))
        story.append(Paragraph(
            "<b>Feature Representation:</b> TF-IDF (1, 2) n-grams with negation protection (preserving 'not', 'never', 'cannot').<br/>"
            "<b>Validation Protocol:</b> Stratified Train (70%), Validation (15%), untouched Test (15%).",
            callout_style
        ))
    else:
        story.append(Paragraph("Evaluated using stratified Train/Val/Test benchmarking with TF-IDF sublinear scaling and Calibrated Linear SVM.", body_style))

    story.append(Spacer(1, 14))

    # 6. Governance & Limitations
    story.append(Paragraph("4. Known Model Limitations & Analytical Disclaimers", section_h1))
    story.append(Paragraph(
        "&bull; <b>Statistical Attribution:</b> Token influence represents linear feature weights and must not be interpreted as causal claims.<br/>"
        "&bull; <b>Contextual Distance:</b> Bag-of-words modeling does not capture long-range discourse dependencies across remote paragraphs.<br/>"
        "&bull; <b>Sarcasm Detection:</b> Indirect figurative sarcasm without explicit lexical cues may experience decreased classification certainty.",
        body_style
    ))

    # Build document
    doc.build(story)
    buffer.seek(0)
    return buffer
