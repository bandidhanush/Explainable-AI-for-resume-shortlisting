from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import io

from .utils import parse_pdf, clean_text
from .model import CandidateScorer

app = FastAPI(title="Explainable Candidate Scoring API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Scorer Instance (In a real app, might need per-request or caching)
scorer = CandidateScorer()

class ScoreRequest(BaseModel):
    resume_text: str
    jd_text: str

class ExplainRequest(BaseModel):
    resume_text: str
    jd_text: str

class CandidateData(BaseModel):
    name: str
    resume_text: str

class BatchAnalyzeRequest(BaseModel):
    candidates: List[CandidateData]
    jd_text: str

@app.get("/")
def read_root():
    return {"message": "API is running"}

@app.post("/parse_resume")
async def parse_resume(file: UploadFile = File(...)):
    if file.filename.endswith(".pdf"):
        content = await file.read()
        text = parse_pdf(io.BytesIO(content))
    else:
        # Assume text file
        content = await file.read()
        text = content.decode("utf-8")
    
    cleaned_text = clean_text(text)
    return {"filename": file.filename, "text": cleaned_text}

@app.post("/score")
def get_score(req: ScoreRequest):
    try:
        # Re-fit model for this specific JD context (Demo purpose logic)
        # In production, we might have a pre-trained generic model or fine-tune.
        # Here we fit on the fly to ensure "Explainability" makes sense for the specific JD.
        # Note: This is computationally expensive if done every time, but okay for a demo.
        # To optimize, we could check if JD changed.
        
        score = scorer.score(req.resume_text, req.jd_text)
        return {"score": score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain")
def get_explanation(req: ExplainRequest):
    try:
        explanation = scorer.explain(req.resume_text, req.jd_text)
        # explanation is a list of (word, weight) tuples
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch_analyze")
def batch_analyze(req: BatchAnalyzeRequest):
    """
    Analyze multiple candidates at once.
    Returns individual scores and explanations for each candidate.
    """
    try:
        results = []
        
        for candidate in req.candidates:
            # Score the candidate
            score = scorer.score(candidate.resume_text, req.jd_text)
            
            # Get explanation
            explanation = scorer.explain(candidate.resume_text, req.jd_text)
            
            # Generate Narrative Verdict
            verdict = scorer.generate_verdict(score, explanation)

            results.append({
                "name": candidate.name,
                "score": score,
                "explanation": explanation,
                "verdict": verdict
            })
        
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
