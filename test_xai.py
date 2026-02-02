import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

from backend.model import CandidateScorer

def test_xai():
    scorer = CandidateScorer()
    
    jd_text = "Looking for a Software Engineer with experience in Python, React, and Machine Learning. Must know FastAPI and JavaScript."
    
    resume_text = """
    John Doe
    Software Engineer
    Experience:
    - 5 years of experience in Python and JavaScript.
    - Built scalable web applications using React and FastAPI.
    - Expertise in machine learning and AI.
    Education:
    - B.S. in Computer Science, University of Tech.
    """
    
    print("--- Testing Scoring ---")
    score = scorer.score(resume_text, jd_text)
    print(f"Score: {score}")
    
    print("\n--- Testing Explanation ---")
    explanation = scorer.explain(resume_text, jd_text)
    print("Explanation (Top Features):")
    for feature, weight in explanation:
        print(f"  {feature}: {weight}")

if __name__ == "__main__":
    test_xai()
