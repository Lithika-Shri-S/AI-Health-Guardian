from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from services.ai_engine import symptom_checker
from services.alert_system import send_emergency_alert

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "AI Health Guardian API is running"})

@app.route('/api/symptom-checker', methods=['POST'])
def check_symptoms():
    data = request.json
    symptoms = data.get('symptoms', '')
    
    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400
        
    analysis = symptom_checker(symptoms)
    return jsonify({"analysis": analysis})

@app.route('/api/emergency', methods=['POST'])
def handle_emergency():
    data = request.json
    patient_id = data.get('patient_id', 'Unknown')
    vitals = data.get('vitals', {})
    
    # Mocking severity detection for now
    heart_rate = vitals.get('heart_rate', 70)
    if heart_rate > 120 or heart_rate < 50:
        severity = "CRITICAL"
        message = f"Patient {patient_id} has critical heart rate: {heart_rate} bpm."
        alert_status = send_emergency_alert(message)
        return jsonify({"alert": alert_status, "severity": severity, "message": message})
        
    return jsonify({"severity": "NORMAL", "message": "Vitals are within normal range."})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
