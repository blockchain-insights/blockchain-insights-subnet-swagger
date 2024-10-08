# POC For Rendering Graph Component In Swagger UI

This project demonstrates a full-stack setup where FastAPI serves an OpenAPI (Swagger) backend, and React consumes the OpenAPI schema to display a Swagger UI, including custom visualizations like graph views with React Flow.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Requirements](#requirements)
3. [Setting up the FastAPI Backend (server)](#setting-up-the-fastapi-backend-server)
4. [Setting up the React Frontend (client)](#setting-up-the-react-frontend-client)
5. [Running the Projects](#running-the-projects)
6. [Notes](#notes)

---

## Project Structure

This project consists of two main directories:

- **server** (Backend - FastAPI)
- **client** (Frontend - React)

### Directory Structure:

```plaintext
blockchain-insights-subnet-swagger/
│
├── server/      # FastAPI backend with OpenAPI support
│   ├── main.py              # FastAPI main file
│   ├── requirements.txt     # Python dependencies
│   └── ...
│
└── client/        # React frontend with Swagger UI and custom graph plugin
    ├── src/                 # React components
    ├── package.json         # JavaScript dependencies
    └── ...
```

## Requirements

Before starting, ensure you have the following installed:

- **Python 3.7+** (for FastAPI)
- **Node.js** (for React)
- **npm** or **yarn** (for managing frontend dependencies)

---

## Setting up the FastAPI Backend (server)

1. **Navigate to the `server` directory**:

   ```bash
   cd server
   ```

2. **Create a virtual environment** (recommended):

   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:

   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```

4. **Install the required dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

5. **Run the FastAPI server**:

   ```bash
   uvicorn main:app --reload
   ```

   The FastAPI server will start running at `http://localhost:8000`.

   - Swagger UI (backend) is accessible at `http://localhost:8000/docs`.
   - OpenAPI schema is accessible at `http://localhost:8000/openapi.json`.

---

## Setting up the React Frontend (client)

1. **Navigate to the `client` directory**:

   ```bash
   cd ../client
   ```

2. **Install the required dependencies**:

   ```bash
   npm install
   ```

3. **Start the React development server**:

   ```bash
   npm start
   ```

   The React app will start at `http://localhost:3000`.

   The React frontend fetches the OpenAPI schema from FastAPI and displays it using Swagger UI. You can view API documentation and custom graph visualizations.

---

## Running the Projects

To run both the FastAPI backend and the React frontend together, follow these steps:

1. **Start the FastAPI Backend**:

   - Open a terminal and run the following command:

   ```bash
   cd server
   uvicorn main:app --reload
   ```

   This will start the FastAPI server at `http://localhost:8000`.

2. **Start the React Frontend**:

   - Open another terminal, navigate to the `client` directory, and run:

   ```bash
   cd client
   npm start
   ```

   This will start the React app at `http://localhost:3000`.

3. **Access the Application**:

   - Open a browser and go to `http://localhost:3000`.
   - The React app will display the Swagger UI, including the custom graph visualizations based on the API responses from FastAPI.

---

## Notes

- Ensure that the FastAPI backend (`http://localhost:8000`) is running before trying to access the React frontend.
- The custom graph view is available for certain response types (such as `graph`), which can be visualized using React Flow in the Swagger UI.
- If you modify the FastAPI backend or the React frontend, you may need to restart the respective servers for the changes to take effect.

---

Feel free to reach out with any issues or questions. Happy coding!
