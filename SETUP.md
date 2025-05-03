# NGL Clone Setup Instructions

This document provides step-by-step instructions to set up and run the NGL Clone application.

## Prerequisites

1. Node.js (v14 or higher)
2. MongoDB (local or Atlas cloud instance)
3. Git (optional, for cloning the repository)

## Setting Up MongoDB

### Option 1: Local MongoDB

1. Install MongoDB Community Edition from the [official website](https://www.mongodb.com/try/download/community).
2. Start the MongoDB service according to your operating system instructions.

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster and database.
3. Get your connection string and update the `.env` file in the backend folder.

## Starting the Backend

1. Navigate to the backend directory:
   ```
   cd ngl-clone/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create or update the `.env` file with your MongoDB connection details:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ngl-clone
   JWT_SECRET=your_secret_key_change_this_in_production
   ```

   If using MongoDB Atlas, your connection string will look something like:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/ngl-clone?retryWrites=true&w=majority
   ```

4. Start the development server:
   ```
   npm run dev
   ```

   The backend server should now be running on http://localhost:5000

## Starting the Frontend

1. Open a new terminal window and navigate to the frontend directory:
   ```
   cd ngl-clone/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

   The frontend should now be running on http://localhost:3000

## Using the Application

1. Open your browser and go to http://localhost:3000
2. Register a new account with just a username
3. Once logged in, you'll be redirected to your dashboard
4. Copy your anonymous message link and share it with friends
5. Check your dashboard to see messages as they arrive

## Troubleshooting

- If the backend fails to start, check if MongoDB is running
- If you see CORS errors, ensure that the frontend is making requests to the correct backend URL
- If changes to .env files don't take effect, restart the corresponding server

## Deployment Notes

For deployment to production:

1. Use a stronger JWT secret in `.env`
2. Set up proper MongoDB authentication
3. Consider using environment variables for sensitive configuration
4. For the frontend, build using `npm run build` and serve the static files 