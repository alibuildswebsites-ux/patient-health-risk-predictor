# Setup and Installation Guide

Follow these steps to run the machine learning pipeline, start the FastAPI backend, and launch the React dev environment.

## Prerequisites

- Python 3.8+
- Node.js 18+ and npm
- Git

## Step 1: Install ML Backend & Pipeline Setup

1. Navigate to the project directory.
2. Initialize a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the ML pipeline sequentially to ingest data, train classifiers, and fit K-Means:
   ```bash
   python preprocessing.py
   python supervised.py
   python unsupervised.py
   ```

## Step 2: Run FastAPI Backend Service

Start the backend API server on port 8000:
```bash
source .venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```
The endpoints will be available at `http://localhost:8000`.

## Step 3: Setup & Run React Frontend

1. Install frontend packages:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
The application will run on `http://localhost:5001`.
