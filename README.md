# CE Tech

CE Tech is a full-stack web application for managing clients, employees, projects, and admin authentication. The project includes a React frontend and an Express + MongoDB backend.

## Features

- User registration and login
- Admin dashboard with summary cards
- Client management
- Employee management
- Project management
- Secure backend with JWT authentication
- Responsive UI built with React and Tailwind CSS

## Project Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  server.js
  seed.js

frontend/
  src/
    components/
    context/
    pages/
    services/
    utils/
  public/
  package.json
  vite.config.js
```

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs
- CORS and Helmet

## Prerequisites

Make sure you have the following installed:

- Node.js (v18 or above recommended)
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Environment Setup

Create a .env file inside the backend folder:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ce-tech
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_secret_key
```

> Replace the MongoDB URI with your own database connection string if needed.

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd CE_tech
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Running the Application

### Start the backend

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start the frontend

```bash
cd frontend
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## Seed the Database

To populate the database with sample users, clients, employees, and projects:

```bash
cd backend
node seed.js
```

## Default Login Credentials

After seeding the database, you can sign in with:

```text
Email: raj758@gmail.com
Password: rajkumar
```

## API Overview

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### Clients
- GET /api/clients
- POST /api/clients
- PUT /api/clients/:id
- DELETE /api/clients/:id

### Employees
- GET /api/employees
- POST /api/employees
- PUT /api/employees/:id
- DELETE /api/employees/:id

### Projects
- GET /api/projects
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id

## Notes

- The frontend expects the backend to be available at the URL configured in the backend environment.
- If you change the frontend API base URL, update the service files in the frontend accordingly.
- For production deployment, make sure to set secure environment variables and use a proper MongoDB hosting service.

## License

This project is licensed under the ISC License.
