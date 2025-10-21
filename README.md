# 🚀 InstaHang Microservices

This project consists of two main components:

1. 🧠 **Hugging Face Model Microservice (FastAPI)** — runs the AI model that performs personality and text analysis.  
2. 💻 **InstaHang Backend (Node.js)** — the main backend server that communicates with the model microservice.

---

## ⚙️ Prerequisites

Before you start, make sure you have:

- 🐍 **Python 3.10+**
- 📦 **pip**
- 🟢 **Node.js 18+**
- 💡 **npm**

---

## 🧩 Project Structure

microservice_InstaHang-main/
├── backend/ # Node.js backend
├── hf_model_server.py # FastAPI Hugging Face microservice
└── README.md

yaml
Copy code

---

## 🪜 Steps to Run the Project

### **Step 1️⃣ — Start the Hugging Face Model Microservice**

> ⚠️ Start this **first**, because the backend depends on it.

1. Open a terminal and go to the project root:
   ```bash
   cd microservice_InstaHang-main
(Optional) Create and activate a virtual environment:

bash
Copy code
python3 -m venv venv
source venv/bin/activate   # macOS / Linux
venv\Scripts\activate      # Windows
Install dependencies:

bash
Copy code
pip install fastapi uvicorn transformers torch
Start the microservice:

bash
Copy code
uvicorn hf_model_server:app --host 0.0.0.0 --port 8001
It will be available at:

arduino
Copy code
http://localhost:8001
Keep this terminal open and running.

Step 2️⃣ — Start the Backend Server
Open a new terminal window.

Navigate to the backend directory:

bash
Copy code
cd microservice_InstaHang-main/backend
Install dependencies:

bash
Copy code
npm install
Start the backend server:

bash
Copy code
npm run dev
The backend will be available at:

arduino
Copy code
http://localhost:3001
✅ Notes
Always start the model microservice (port 8001) before the backend (port 3001).

Run both in separate terminals.

Stop any service with Ctrl + C.

Make sure ports 8001 and 3001 are not already in use.

🧠 Example Run Sequence
bash
Copy code
# Terminal 1 — Model Microservice
cd microservice_InstaHang-main
uvicorn hf_model_server:app --host 0.0.0.0 --port 8001

# Terminal 2 — Backend
cd microservice_InstaHang-main/backend
npm install
npm run dev
💡 Done!
Your microservice system is now live 🎉

Model Microservice → http://localhost:8001

Backend Server → http://localhost:3001
