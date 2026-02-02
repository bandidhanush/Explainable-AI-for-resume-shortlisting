from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

def create_test_resumes():
    """Create 3 test resume PDFs with different profiles"""
    
    resumes = [
        {
            "filename": "john_doe_senior_engineer.pdf",
            "content": """
JOHN DOE
Senior Software Engineer

SUMMARY:
Highly experienced software engineer with 8+ years in full-stack development.
Expert in Python, React, and Machine Learning. Strong background in AI/ML systems.

EXPERIENCE:
Senior Software Engineer | Tech Corp | 2019-Present
- Led development of ML-powered recommendation system using Python and TensorFlow
- Built scalable web applications with React and FastAPI
- Mentored junior developers and conducted code reviews

Software Engineer | StartupXYZ | 2016-2019
- Developed RESTful APIs using Python and Flask
- Implemented frontend features with React and JavaScript
- Worked with PostgreSQL and MongoDB databases

SKILLS:
- Programming: Python, JavaScript, TypeScript, Java
- Frameworks: React, FastAPI, Flask, Node.js
- ML/AI: TensorFlow, PyTorch, scikit-learn, LIME
- Databases: PostgreSQL, MongoDB, Redis
- Tools: Git, Docker, Kubernetes, AWS

EDUCATION:
M.S. Computer Science | Stanford University | 2016
B.S. Computer Science | UC Berkeley | 2014
            """
        },
        {
            "filename": "sarah_smith_data_scientist.pdf",
            "content": """
SARAH SMITH
Data Scientist

SUMMARY:
Data scientist with 5 years of experience in machine learning and statistical analysis.
Proficient in Python, R, and data visualization. Strong analytical and problem-solving skills.

EXPERIENCE:
Data Scientist | Analytics Inc | 2020-Present
- Developed predictive models using Python and scikit-learn
- Created data visualizations and dashboards with Tableau
- Performed statistical analysis and A/B testing

Junior Data Scientist | DataCo | 2018-2020
- Built machine learning models for customer segmentation
- Analyzed large datasets using Python and SQL
- Collaborated with engineering teams on data pipelines

SKILLS:
- Programming: Python, R, SQL
- ML/AI: scikit-learn, TensorFlow, Keras
- Data Viz: Tableau, matplotlib, seaborn
- Statistics: Hypothesis testing, regression analysis
- Tools: Jupyter, Git, AWS

EDUCATION:
M.S. Statistics | MIT | 2018
B.S. Mathematics | UCLA | 2016
            """
        },
        {
            "filename": "mike_johnson_frontend_dev.pdf",
            "content": """
MIKE JOHNSON
Frontend Developer

SUMMARY:
Creative frontend developer with 4 years of experience building responsive web applications.
Specialized in React, Vue.js, and modern CSS frameworks. Passionate about UX/UI design.

EXPERIENCE:
Frontend Developer | WebStudio | 2021-Present
- Built responsive web applications using React and TypeScript
- Implemented state management with Redux and Context API
- Collaborated with designers to create pixel-perfect UIs

Junior Frontend Developer | DesignCo | 2019-2021
- Developed interactive user interfaces with Vue.js
- Worked with REST APIs and GraphQL
- Optimized web performance and accessibility

SKILLS:
- Frontend: React, Vue.js, JavaScript, TypeScript, HTML5, CSS3
- Styling: Tailwind CSS, Sass, styled-components
- Tools: Webpack, Vite, Git, Figma
- Testing: Jest, React Testing Library
- Basic: Node.js, Express

EDUCATION:
B.S. Web Development | NYU | 2019
            """
        }
    ]
    
    for resume in resumes:
        filepath = f"/Users/dhanushbandi/Desktop/XAI2/{resume['filename']}"
        c = canvas.Canvas(filepath, pagesize=letter)
        
        # Set font
        c.setFont("Helvetica", 10)
        
        # Write content line by line
        y_position = 750
        for line in resume['content'].strip().split('\n'):
            if y_position < 50:  # Start new page if needed
                c.showPage()
                c.setFont("Helvetica", 10)
                y_position = 750
            
            c.drawString(50, y_position, line.strip())
            y_position -= 15
        
        c.save()
        print(f"Created: {filepath}")

if __name__ == "__main__":
    create_test_resumes()
    print("\nTest resumes created successfully!")
