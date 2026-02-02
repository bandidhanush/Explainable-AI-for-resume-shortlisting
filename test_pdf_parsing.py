import os
import sys

# Add the current directory to sys.path so we can import backend
sys.path.append(os.getcwd())

from backend.utils import parse_pdf

file_path = "dummy_resume.pdf"
if os.path.exists(file_path):
    with open(file_path, "rb") as f:
        text = parse_pdf(f)
        print(f"--- Text from {file_path} ---")
        print(f"'{text}'")
        print("-----------------------------")
else:
    print(f"{file_path} does not exist.")
