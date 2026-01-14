"""
The Knowledge Extractor - Utility Functions
PDF extraction, Gemini client, and helper functions.
"""

import json
import os
import re
from pathlib import Path
from typing import Any, List, Optional, Tuple

import google.generativeai as genai
from dotenv import load_dotenv
from pypdf import PdfReader

# Load environment variables from .env file
load_dotenv()

# Path to the documents folder (relative to project root)
DOCUMENTS_PATH = Path(__file__).parent.parent / "documents"

# Gemini configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.0-flash"  # Current Gemini 3 Flash equivalent

# Configure Gemini client
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Text truncation limit to stay within token limits
MAX_TEXT_CHARS = 15000


def get_gemini_model() -> Optional[genai.GenerativeModel]:
    """
    Get configured Gemini model instance.

    Returns:
        GenerativeModel instance if API key is configured, None otherwise
    """
    if not GEMINI_API_KEY:
        print("Warning: GEMINI_API_KEY not set in .env file")
        return None

    return genai.GenerativeModel(GEMINI_MODEL)


def extract_text_from_pdf(pdf_path: Path) -> str:
    """
    Extract all text content from a PDF file.

    Args:
        pdf_path: Path to the PDF file

    Returns:
        Combined text from all pages, or empty string if extraction fails
    """
    try:
        reader = PdfReader(pdf_path)
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        return "\n\n".join(text_parts)
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}")
        return ""


def get_pdf_files() -> List[Tuple[str, int]]:
    """
    Get list of PDF files in the documents folder.

    Returns:
        List of tuples containing (filename, file_size_bytes)
    """
    if not DOCUMENTS_PATH.exists():
        return []

    pdf_files = []
    for pdf_path in DOCUMENTS_PATH.glob("*.pdf"):
        pdf_files.append((pdf_path.name, pdf_path.stat().st_size))

    return sorted(pdf_files, key=lambda x: x[0])


def scan_all_pdfs() -> str:
    """
    Scan all PDFs in the documents folder and combine their text.

    Returns:
        Combined text from all PDFs, separated by document markers
    """
    if not DOCUMENTS_PATH.exists():
        return ""

    pdf_paths = list(DOCUMENTS_PATH.glob("*.pdf"))
    if not pdf_paths:
        return ""

    all_text_parts = []
    for pdf_path in sorted(pdf_paths):
        text = extract_text_from_pdf(pdf_path)
        if text:
            # Add document separator for clarity
            all_text_parts.append(f"--- Document: {pdf_path.name} ---\n{text}")

    return "\n\n".join(all_text_parts)


def parse_json_response(response_text: str) -> Optional[Any]:
    """
    Parse JSON from Gemini response, handling markdown code blocks.

    Gemini often wraps JSON in markdown code blocks like:
    ```json
    [...]
    ```

    This function extracts and parses the JSON regardless of formatting.

    Args:
        response_text: Raw text response from Gemini

    Returns:
        Parsed JSON data, or None if parsing fails
    """
    if not response_text:
        return None

    # Try to extract JSON from markdown code block
    json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", response_text)
    if json_match:
        json_str = json_match.group(1).strip()
    else:
        # Try parsing the raw response
        json_str = response_text.strip()

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON response: {e}")
        print(f"Response text: {response_text[:500]}...")
        return None


def truncate_text(text: str, max_chars: int = MAX_TEXT_CHARS) -> str:
    """
    Truncate text to stay within token limits while keeping coherent content.

    Args:
        text: Text to truncate
        max_chars: Maximum character count

    Returns:
        Truncated text with indicator if truncated
    """
    if len(text) <= max_chars:
        return text

    # Truncate at a sentence boundary if possible
    truncated = text[:max_chars]
    last_period = truncated.rfind(".")
    if last_period > max_chars * 0.8:  # Only use if reasonably close to limit
        truncated = truncated[: last_period + 1]

    return truncated + "\n\n[Content truncated for processing...]"
