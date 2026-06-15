

```markdown
# AI Receptionist Project 🤖📞

An intelligent, FastAPI-powered AI Receptionist backend designed to automate call handling, routing, and customer interactions seamlessly.

---

## 🚀 Features

* **FastAPI Backend:** High-performance, asynchronous web API.
* **Intelligent Routing:** Smooth handling of incoming receptionist requests.
* **Easy Deployment:** Scripts provided for quick local configuration and execution.

---

## 🛠️ Getting Started

### Prerequisites

Make sure you have Python 3.10+ installed on your system. You can verify your installation by running:

```bash
python --version

```

### Installation

1. **Clone the repository:**
```bash
git clone [https://github.com/HimanshiGoyal2005/ai-receptionist-project.git](https://github.com/HimanshiGoyal2005/ai-receptionist-project.git)
cd ai-receptionist-project

```


2. **Set up a virtual environment (Recommended):**
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

```


3. **Install dependencies:**
*(Ensure you have a `requirements.txt` file in your root folder)*
```bash
pip install -r requirements.txt

```



---

## 🏃‍♂️ Running the Backend

You can start the FastAPI application using either of the following methods from the **project root directory**:

### Method 1: Using PowerShell Script (Windows)

```powershell
./run_backend.ps1

```

### Method 2: Running Uvicorn Directly

```bash
python -m uvicorn main:app --reload --port 8000

```

> 💡 **Note on Project Structure:** Running the command from the root directory avoids the common `ModuleNotFoundError: No module named 'app'` error that typically occurs if you try to execute from within an inner `app` directory using `app.main:app`.

---

## 🌐 API Documentation

Once the backend is running, you can access the interactive API docs at:

* **Swagger UI:** [http://localhost:8000/docs](https://www.google.com/search?q=http://localhost:8000/docs)
* **ReDoc:** [http://localhost:8000/redoc](https://www.google.com/search?q=http://localhost:8000/redoc)

---

