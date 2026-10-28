"""
Unit tests for SentimentClassifier, TopicModeler, and ModelExplainer.
"""

from app.ml.classifier import SentimentClassifier
from app.ml.topic_model import TopicModeler
from app.ml.explainer import ModelExplainer


def test_sentiment_inference():
    clf = SentimentClassifier()
    preds = clf.predict([
        "The application is blazing fast, beautiful UI, and support was incredible!",
        "Complete disaster. Billed me twice and crashed during presentation."
    ])

    assert len(preds) == 2
    assert preds[0]["predicted_sentiment"] == "positive"
    assert preds[0]["confidence"] > 0.5
    assert preds[0]["polarity"] > 0

    assert preds[1]["predicted_sentiment"] == "negative"
    assert preds[1]["confidence"] > 0.5
    assert preds[1]["polarity"] < 0


def test_topic_inference():
    tm = TopicModeler()
    topics = tm.infer([
        "Support representative was very helpful.",
        "Overcharged on my monthly billing invoice."
    ])
    assert len(topics) == 2
    assert "Customer Support" in topics[0]["topic_name"]
    assert "topic_confidence" in topics[0]


def test_model_explainer():
    explainer = ModelExplainer()
    res = explainer.explain_review("The system is broken and customer support was completely unhelpful.")
    assert "influential_terms" in res
    assert len(res["influential_terms"]) > 0
    assert "disclaimer" in res
    # At least one negative term should be present
    negative_terms = [t["term"] for t in res["influential_terms"] if t["polarity"] == "negative"]
    assert len(negative_terms) > 0
