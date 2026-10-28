"""
Text preprocessing and normalization pipeline for customer review sentiment analysis.
Preserves meaningful negation cues (not, never, no, cannot, etc.) to prevent polarity inversion.
"""

import re
import unicodedata
from typing import List, Optional

# Contract mappings with explicit negation preservation
CONTRACTIONS = {
    r"\bcan'?t\b": "cannot",
    r"\bwon'?t\b": "will not",
    r"\bshan'?t\b": "shall not",
    r"\bisn'?t\b": "is not",
    r"\baren'?t\b": "are not",
    r"\bwasn'?t\b": "was not",
    r"\bweren'?t\b": "were not",
    r"\bdoesn'?t\b": "does not",
    r"\bdidn'?t\b": "did not",
    r"\bdon'?t\b": "do not",
    r"\bhasn'?t\b": "has not",
    r"\bhaven'?t\b": "have not",
    r"\bhadn'?t\b": "had not",
    r"\bshouldn'?t\b": "should not",
    r"\bwouldn'?t\b": "would not",
    r"\bcouldn'?t\b": "could not",
    r"n't\b": " not",
    r"\b're\b": " are",
    r"\b's\b": " is",
    r"\b'd\b": " would",
    r"\b'll\b": " will",
    r"\b've\b": " have",
    r"\b'm\b": " am",
}

# Negation words that must NOT be removed as stopwords
PRESERVED_NEGATIONS = {
    "not", "no", "never", "neither", "nor", "none", "nobody",
    "nothing", "nowhere", "hardly", "barely", "scarcely",
    "cannot", "without", "against"
}

# Standard English stop words excluding negations
BASE_STOPWORDS = {
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your",
    "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she",
    "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
    "theirs", "themselves", "what", "which", "who", "whom", "this", "that",
    "these", "those", "am", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
    "the", "and", "but", "if", "or", "because", "as", "until", "while", "of",
    "at", "by", "for", "with", "about", "between", "into", "through", "during",
    "before", "after", "above", "below", "to", "from", "up", "down", "in",
    "out", "on", "off", "over", "under", "again", "further", "then", "once",
    "here", "there", "when", "where", "why", "how", "all", "any", "both",
    "each", "few", "more", "most", "other", "some", "such", "only", "own",
    "same", "so", "than", "too", "very", "s", "t", "can", "will", "just",
    "should", "now"
}

# Filter out negations from stopwords
CUSTOM_STOPWORDS = BASE_STOPWORDS - PRESERVED_NEGATIONS


def clean_text(text: Optional[str]) -> str:
    """
    Cleans raw review text while preserving negation semantics.
    1. Null check & string cast.
    2. Unicode normalization (NFKD).
    3. URL, email, and HTML tag removal.
    4. Contraction expansion (especially n't -> not).
    5. Lowercasing.
    6. Non-alphanumeric strip (keeping spaces and apostrophes).
    7. Whitespace collapse.
    """
    if text is None:
        return ""
    
    # Cast to str
    text = str(text)
    
    # Unicode normalize
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("utf-8")
    
    # Remove URLs and email addresses
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    text = re.sub(r"\S+@\S+", " ", text)
    
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)
    
    # Expand contractions with special care for negations
    for pattern, replacement in CONTRACTIONS.items():
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
        
    # Lowercase
    text = text.lower()
    
    # Replace non-letters/numbers with space, except keep spaces
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    
    # Collapse multiple whitespaces
    text = re.sub(r"\s+", " ", text).strip()
    
    return text


def tokenize_preserving_negations(text: str) -> List[str]:
    """
    Splits text into tokens, binds negations with subsequent token
    (e.g., 'not good' -> 'not_good') when adjacent, to enforce semantic polarity.
    """
    words = text.split()
    processed_tokens: List[str] = []
    skip_next = False
    
    for i, word in enumerate(words):
        if skip_next:
            skip_next = False
            continue
            
        if word in PRESERVED_NEGATIONS and i + 1 < len(words):
            next_word = words[i + 1]
            # Bind negation with target adjective/verb
            processed_tokens.append(f"{word}_{next_word}")
            skip_next = True
        else:
            if word not in CUSTOM_STOPWORDS:
                processed_tokens.append(word)
                
    return processed_tokens
