"""
Unit tests for text preprocessor and negation preservation.
"""

from app.ml.preprocessor import clean_text, tokenize_preserving_negations


def test_clean_text_basic():
    raw = "  Hello World! Visit https://example.com for MORE info.  "
    cleaned = clean_text(raw)
    assert "https" not in cleaned
    assert "example.com" not in cleaned
    assert cleaned == "hello world visit for more info"


def test_negation_preservation_contractions():
    raw = "I can't recommend this product. It won't work and isn't reliable."
    cleaned = clean_text(raw)
    assert "cannot" in cleaned
    assert "not" in cleaned
    assert "not work" in cleaned
    assert "not reliable" in cleaned


def test_tokenize_preserving_negations():
    text = "this is not good and never recommended"
    tokens = tokenize_preserving_negations(text)
    assert "not_good" in tokens
    assert "never_recommended" in tokens
