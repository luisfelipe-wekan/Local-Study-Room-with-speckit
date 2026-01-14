"""
The Knowledge Extractor - Utility Functions
PDF extraction, Gemini client, and helper functions.
"""

from pathlib import Path
from typing import List, Tuple

from pypdf import PdfReader

# Path to the documents folder (relative to project root)
DOCUMENTS_PATH = Path(__file__).parent.parent / "documents"


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
