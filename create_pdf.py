from reportlab.pdfgen import canvas
import os

def create_dummy_pdf():
    output_path = os.path.abspath("dummy_resume.pdf")
    c = canvas.Canvas(output_path)
    c.drawString(100, 750, "John Doe")
    c.drawString(100, 730, "Software Engineer")
    c.drawString(100, 700, "Experience:")
    c.drawString(100, 680, "- 5 years of experience in Python and JavaScript.")
    c.drawString(100, 660, "- Built scalable web applications using React and FastAPI.")
    c.drawString(100, 640, "- Expertise in machine learning and AI.")
    c.drawString(100, 600, "Education:")
    c.drawString(100, 580, "- B.S. in Computer Science, University of Tech.")
    c.save()
    print(f"Created {output_path}")

if __name__ == "__main__":
    create_dummy_pdf()
