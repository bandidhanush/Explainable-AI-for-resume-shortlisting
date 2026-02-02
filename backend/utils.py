import re
from pypdf import PdfReader

def parse_pdf(file_file):
    """
    Extracts text from a PDF file object.
    """
    try:
        reader = PdfReader(file_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def clean_text(text):
    """
    Basic text cleaning: remove extra whitespace, newlines, etc.
    """
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text
