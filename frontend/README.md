# Barta Frontend

The frontend for Barta, a messaging platform inspired by NGL that allows users to receive anonymous messages with beautiful card templates.

## Features

- **User Authentication**: Simple username-based authentication system
- **Anonymous Messaging**: Generate and share links for receiving anonymous messages
- **Message Management**:
  - View all received messages in your inbox
  - Mark messages as read
  - Delete unwanted messages
  - Export messages as images
- **Card Templates**: 20+ beautiful card designs for messages
- **Real-time Notifications**: Get notified with sound when you receive new messages
- **Bilingual Support**: Available in both English and Bengali
- **Dark Mode**: Full dark mode support throughout the application
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Setup Instructions

### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

2. Configure environment variables:
   ```
   # Copy the example .env file
   cp .env.example .env.local
   
   # Edit .env.local to set your configuration
   ```

3. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and visit `http://localhost:3000`

## Environment Configuration

The application uses environment variables for configuration. Create a `.env.local` file with the following options:

```
# API Configuration - Required
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional Configuration
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_DEBUG_MODE=false
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:5000/api |
| NEXT_PUBLIC_ENABLE_ANALYTICS | Enable/disable analytics | false |
| NEXT_PUBLIC_DEBUG_MODE | Enable/disable debug mode | false |

## Project Structure

```
frontend/
├── app/            # App router pages and layout
├── components/     # Reusable UI components
├── context/        # React context providers
├── pages/          # Legacy pages router
├── public/         # Static assets
├── styles/         # Global CSS and styling
```

## Key Components

- **MessageList**: Displays received messages with options to save as image, mark as read, and delete
- **MessageExport**: Provides functionality to export messages as images
- **CardTemplates**: Contains all the card templates and styling for messages
- **DeveloperProfile**: Shows information about the developer with contact links

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint to check for code issues

## Browser Support

The application supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request 