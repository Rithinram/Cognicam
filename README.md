# Cognicam - AI-Powered Smart City Video Analytics

Cognicam is a comprehensive smart city video analytics platform designed to integrate AI perception models with a rule-based engine. It provides real-time insights into traffic density, safety violations, and compliance statistics, allowing city administrators to make data-driven decisions for safer and smarter urban environments.

## 🚀 Features

-   **Real-time Analytics Dashboard:** Visualize traffic trends, compliance scores, and active alerts in real-time.
-   **Video Analysis:** Upload and process traffic footage for automated incident detection (simulated in this prototype).
-   **Incident Logging:** Automated detection and logging of violations such as:
    -   Red Light Crossings
    -   Speeding / Sudden Braking
    -   Loitering in sensitive zones
-   **Geospatial Visualization:** Interactive maps displaying camera locations, routes, and incident hotspots using Leaflet.
-   **Report Generation:** Export detailed analytics reports in PDF format for official documentation.

## 🛠️ Tech Stack

### Frontend
-   **Framework:** React 19 (via Vite)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS (inferred), Lucide React (Icons)
-   **Routing:** React Router DOM
-   **Visualization:** Recharts (Charts), React Leaflet (Maps)
-   **Utilities:** jsPDF (Reports), html2canvas

### Backend
-   **Framework:** FastAPI
-   **Language:** Python 3.x
-   **Validation:** Pydantic
-   **Logic:** Rule-based inference engine (`engine.py`)

## 📂 Project Structure

```
pegasus/
├── frontend/                # React Frontend Application
│   ├── src/
│   │   ├── components/      # Reusable UI Components
│   │   ├── pages/           # Application Route Pages
│   │   ├── App.tsx          # Main App Component
│   │   └── ...
│   ├── backend/             # Python FastAPI Backend
│   │   ├── main.py          # API Entry Point & Endpoints
│   │   └── engine.py        # Rule-Based Intelligence Engine
│   └── package.json         # Frontend Dependencies
└── README.md                # Project Documentation
```

## 🏁 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites
-   **Node.js** (v18 or higher)
-   **Python** (v3.8 or higher)
-   **npm** or **yarn**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Rithinram/Cognicam.git
    cd civiclogic
    ```

2.  **Frontend Setup**
    Navigate to the frontend directory and install dependencies:
    ```bash
    cd frontend
    npm install
    ```

3.  **Backend Setup**
    Navigate to the backend directory:
    ```bash
    cd frontend/backend
    ```
    
    Create and activate a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

    Install required Python packages:
    ```bash
    pip install fastapi uvicorn
    ```

## ⚡ Running the Application

### 1. Start the Backend Server
In the `frontend/backend` directory (with venv activated if used):
```bash
uvicorn main:app --reload
```
The backend API will start at `http://localhost:8000`.

### 2. Start the Frontend Application
Open a new terminal, navigate to the `frontend` directory, and run:
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

## 📡 API Endpoints (Preview)

-   `POST /api/v1/upload-video`: Upload video for analysis.
-   `GET /api/v1/results/{job_id}`: Retrieve analysis results.
-   `GET /api/v1/incidents`: Get a log of detected incidents.
-   `GET /api/v1/compliance`: Fetch city compliance scores and trends.

## 📄 License

This project is licensed under the MIT License.
