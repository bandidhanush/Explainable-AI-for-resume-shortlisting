import requests
import os

# Assuming server is running on 8000
BASE_URL = "http://localhost:8000"

def test_backend():
    print("Testing Backend Logic...")
    
    # 1. Test Root
    try:
        r = requests.get(BASE_URL)
        print(f"Root: {r.json()}")
    except:
        print("Server not running? Skipping live request tests.")

    # 2. Test Model Logic directly (unit test style)
    from backend.model import CandidateScorer
    scorer = CandidateScorer()
    jd = "Looking for a Python Developer with experience in FastAPI and Machine Learning."
    resume = "I am a Python Developer. I know FastAPI and ML."
    
    print(f"JD: {jd}")
    print(f"Resume: {resume}")
    
    score = scorer.score(resume, jd)
    print(f"Score: {score}")
    
    explanation = scorer.explain(resume, jd)
    print(f"Explanation: {explanation}")

if __name__ == "__main__":
    test_backend()
