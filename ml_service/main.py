from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

class AppointmentData(BaseModel):
    patient_id: int
    doctor_id: int
    age: int
    previous_no_shows: int
    distance_km: float

@app.get("/")
def read_root():
    return {"message": "Hospital AI ML Service is running!"}

@app.post("/predict-no-show")
def predict_no_show(data: AppointmentData):
    # Mock ML Logic: Probability calculation
    # In a real app, this would use a pre-trained model (e.g., Scikit-learn or XGBoost)
    base_prob = 0.05
    history_penalty = data.previous_no_shows * 0.15
    distance_penalty = data.distance_km * 0.01
    age_factor = 0.02 if data.age > 65 else 0
    
    probability = min(0.95, base_prob + history_penalty + distance_penalty + age_factor)
    
    return {
        "patient_id": data.patient_id,
        "no_show_probability": round(probability, 2),
        "risk_level": "High" if probability > 0.5 else ("Medium" if probability > 0.2 else "Low"),
        "recommendation": "Send extra reminder" if probability > 0.2 else "Normal follow-up"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
