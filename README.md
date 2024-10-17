## Table of Contents

1. [Project Structure](#project-structure)
2. [Requirements](#requirements)
3. [Setting up the Project](#setting-up-the-project)
4. [Running the Projects](#running-the-projects)

---

## Project Structure

```plaintext
blockchain-insights-subnet-swagger/
   ├── public/              # Public assets
   ├── src/                 # React components
   ├── package.json         # JavaScript dependencies
   └── ...
```

## Requirements

Before starting, ensure you have the following installed:

- **Node.js** (for React)
- **npm** or **yarn** (for managing frontend dependencies)

---

## Setting up the Project

1. **Install the required dependencies**:

   ```bash
   npm install
   ```

2. **Set up the environment variable**:

   Create a `.env` file in the root directory and add the following:

   ```
   REACT_APP_API_BASE_URL=https://your-base-url
   ```

   This sets the base URL for the API requests.

3. **Start the React development server**:

   ```bash
   npm start
   ```

   The React app will start at `http://localhost:3000`.

   The React frontend fetches the OpenAPI schema from FastAPI using the base URL defined in the environment variable and displays it using Swagger UI. You can view API documentation and custom graph visualizations.

---

## Running the Projects

1. **Start the React Frontend**:

   - Open terminal and run:

   ```bash
   npm start
   ```

   This will start the React app at `http://localhost:3000`.

2. **Access the Application**:

   - Open a browser and go to `http://localhost:3000`.
   - The React app will display the Swagger UI, including the custom graph visualizations based on the API responses from FastAPI.

---
