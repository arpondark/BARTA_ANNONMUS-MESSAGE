# NGL Clone

A full-stack web application similar to NGL (Not Gonna Lie) that allows users to:
- Create accounts with just a username
- Generate anonymous message links
- Share links with friends
- Receive and view anonymous messages in a dashboard

## Technology Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Express.js with MongoDB
- **Authentication**: JWT-based (without passwords)

## Project Structure

```
ngl-clone/
├── frontend/       # Next.js frontend
├── backend/        # Express.js backend
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd ngl-clone/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ngl-clone
   JWT_SECRET=your_jwt_secret_key_change_in_production
   ```

4. Make sure MongoDB is running on your system

5. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd ngl-clone/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

## Features

- Simple authentication with just a username
- Generate personal anonymous message links
- Share links on social media or directly with friends
- Receive anonymous messages from anyone with the link
- View all received messages in a dashboard

## Development Notes

- The backend API runs on port 5000
- The frontend development server runs on port 3000
- The frontend makes API calls to `http://localhost:5000` 