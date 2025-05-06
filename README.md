# Barta
[🔗 Live Preview](https://bartatest.netlify.app/)

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

3. Configure the API URL by creating a `.env.local` file:
   ```
   # Copy from the example file
   cp .env.example .env.local
   
   # Edit the file to set your backend API URL
   # Default is already set to http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000`

## Environment Configuration

The frontend uses environment variables to configure various settings. You can customize these in your `.env.local` file:

- `NEXT_PUBLIC_API_URL`: The URL of your backend API (default: http://localhost:5000/api)
- `NEXT_PUBLIC_ENABLE_ANALYTICS`: Enable/disable analytics (default: false)
- `NEXT_PUBLIC_DEBUG_MODE`: Enable/disable debug mode (default: false)

## Features

- Simple authentication with just a username
- Generate personal anonymous message links
- Share links on social media or directly with friends
- Receive anonymous messages from anyone with the link
- View all received messages in a dashboard
- Delete unwanted messages

## Development Notes

- The backend API runs on port 5000
- The frontend development server runs on port 3000
- The frontend makes API calls to the URL specified in NEXT_PUBLIC_API_URL (defaults to `http://localhost:5000/api`)
