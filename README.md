# AI Health Guardian

An intelligent, full-stack health monitoring and assistance system that leverages AI to provide real-time insights, alerts, and preventive healthcare recommendations.

---

## Overview

AI Health Guardian is designed to bridge the gap between continuous health monitoring and actionable insights. It combines a Python-based backend with an interactive frontend to analyze health data, detect anomalies, and notify users proactively.

---

## Features

- **AI-Based Health Analysis**
  - Detects abnormal patterns in health data
  - Provides predictive insights and recommendations

- **Real-Time Alert System**
  - Triggers alerts for critical health conditions
  - Notification-ready backend design

- **Full-Stack Web Application**
  - Clean and responsive frontend UI
  - Backend APIs for processing and logic

- **User Authentication (Frontend Ready)**
  - Login & Signup UI implemented
  - Easily extendable to backend authentication

-  **Extensible Architecture**
  - Modular services for AI and alerts
  - Easy integration with IoT devices (e.g., ESP32, sensors)

---

## Project Structure

```
AI-Health-Guardian/
│
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt      # Backend dependencies
│   ├── services/
│   │   ├── ai_engine.py      # AI logic & health analysis
│   │   └── alert_system.py   # Alert triggering system
│   │
│   └── templates/
│       └── index.html        # Backend-rendered UI (optional)
│
├── frontend/
│   ├── index.html            # Main dashboard
│   ├── login.html            # Login page
│   ├── signup.html           # Signup page
│   ├── app.js                # Main frontend logic
│   ├── auth.js               # Authentication handling
│   └── style.css             # Styling
│
└── README.md
```

---

## Tech Stack

### Backend
- Python
- Flask

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### AI & Logic
- Custom rule-based / extendable ML logic (in `ai_engine.py`)

---

## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/AI-Health-Guardian.git
cd AI-Health-Guardian
```

### Setup Backend

```bash
cd backend
pip install -r requirements.txt
```

Run the server:

```bash
python app.py
```

Backend runs at:
```
http://127.0.0.1:5000
```

---

### Run Frontend

Simply open:

```
frontend/index.html
```

Or use Live Server (recommended for development).

---

## API Overview (Basic)

| Endpoint | Method | Description |
|--------|--------|------------|
| `/` | GET | Home route |
| `/analyze` | POST | Analyze health data |
| `/alert` | POST | Trigger alert |

---

## How It Works

1. User inputs health data (manually or via sensors)
2. Data is sent to backend (`app.py`)
3. `ai_engine.py` processes and evaluates conditions
4. If abnormal patterns are detected:
   - `alert_system.py` triggers alerts
5. Results are returned and displayed on UI

---

## Future Enhancements

- Mobile App Integration
- Cloud deployment (AWS / Firebase)
- Advanced ML models for prediction
- IoT sensor integration (ESP32, wearables)
- Push notifications (SMS / Email)
- Database integration (MongoDB / PostgreSQL)

---

## Example Use Cases

- Remote patient monitoring
- Elderly health tracking
- Fitness & wellness assistant
- Early detection of critical conditions

---

## Contributing

Contributions are welcome!

```bash
# Fork the repo
# Create a new branch
git checkout -b feature-name

# Commit changes
git commit -m "Add feature"

# Push
git push origin feature-name
```

---


