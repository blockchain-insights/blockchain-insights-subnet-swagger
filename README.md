## Table of Contents

1. [Project Structure](#project-structure)
2. [Requirements](#requirements)
3. [Setting up the React Frontend (client)](#setting-up-the-react-frontend-client)
4. [Running the Projects](#running-the-projects)
5. [Notes](#notes)

---

## Project Structure

```plaintext
blockchain-insights-subnet-swagger/
│
└── client/        # React frontend with Swagger UI and custom graph plugin
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

To run both the React frontend together, follow these steps:

1. **Start the React Frontend**:

   - Open another terminal, navigate to the `client` directory, and run:

   ```bash
   cd client
   npm start
   ```

   This will start the React app at `http://localhost:3000`.

2. **Access the Application**:

   - Open a browser and go to `http://localhost:3000`.
   - The React app will display the Swagger UI, including the custom graph visualizations based on the API responses from FastAPI.

---

## Notes

- Ensure that the FastAPI backend (`http://localhost:8000`) is running before trying to access the React frontend.
- The custom graph view is available for certain response types (such as `graph`), which can be visualized using React Flow in the Swagger UI.

---

Feel free to reach out with any issues or questions. Happy coding!
