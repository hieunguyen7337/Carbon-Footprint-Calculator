# Carbon Footprint Calculator

This project is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to help users track and manage their carbon emissions. It allows authenticated users to log various activities, such as travel and utility usage, and provides a way to view, update, and delete these entries.

## Project Setup Instructions

To run this project locally, follow these steps:

### 1\. Prerequisites

  - **Node.js**: Ensure you have Node.js and npm installed.
  - **MongoDB**: You need a running MongoDB instance. This can be a local installation or a cloud-based service like MongoDB Atlas.

### 2\. Clone the Repository

```sh
git clone https://github.com/hieunguyen7337/Carbon-Footprint-Calculator.git
cd Carbon-Footprint-Calculator
```

### 3\. Install Dependencies

This project uses a monorepo-style structure, so you can install all dependencies at once from the root directory.

```sh
npm run install-all
```

This command will install dependencies for the root, `backend`, and `frontend` directories.

### 4\. Configure Environment Variables

Create a `.env` file in the **`backend`** directory. This file should contain your MongoDB connection string and a secret for JWT authentication.

**`backend/.env`**

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

> **Note:** Replace `your_mongodb_connection_string` with your actual MongoDB URI and `your_jwt_secret` with a strong, random string.

### 5\. Run the Application

From the root directory, you can start both the backend and frontend with a single command.

  - **Development Mode**: Runs both servers with `nodemon` for the backend, enabling live reloading.
    ```sh
    npm run dev
    ```
  - **Production Mode**: Runs the backend with `node` and the frontend in development mode.
    ```sh
    npm start
    ```

Once the application is running, the frontend will be accessible at `http://localhost:3000` and the backend API will be running on `http://localhost:5001`.

## Public URL of the Project

**Public URL**: `http://13.236.136.12/`

## Access Credentials

A project-specific username and password will be provided if required for dashboard access. For local development, you can register a new user through the application's registration page.
