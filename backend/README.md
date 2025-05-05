# Barta Backend API

This is the backend API for the NGL Clone application, a platform for anonymous messaging.

## Base URL

```
/api
```

## Authentication

Authentication is handled using JWT (JSON Web Token). For protected routes, include the token in the request header:

```
Authorization: Bearer YOUR_TOKEN
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register a new user
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "username": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "token": "jwt_token",
    "username": "string"
  }
  ```
- **Status Codes**:
  - `201`: User created successfully
  - `400`: Username is required/Username is already taken
  - `500`: Registration failed

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "username": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "token": "jwt_token",
    "username": "string"
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `400`: Username is required/User not found
  - `500`: Login failed

### Message Routes (`/api/messages`)

#### Get all messages for authenticated user
- **URL**: `/api/messages`
- **Method**: `GET`
- **Authentication**: Required
- **Response**: Array of message objects
  ```json
  [
    {
      "_id": "string",
      "recipient": "user_id",
      "content": "string",
      "read": boolean,
      "createdAt": "date"
    }
  ]
  ```
- **Status Codes**:
  - `200`: Success
  - `401`: Unauthorized
  - `500`: Failed to fetch messages

#### Get unread message count
- **URL**: `/api/messages/unread`
- **Method**: `GET`
- **Authentication**: Required
- **Response**: 
  ```json
  {
    "count": number
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `401`: Unauthorized
  - `500`: Failed to fetch unread count

#### Mark messages as read
- **URL**: `/api/messages/mark-read`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "messageIds": ["string", "string"]
  }
  ```
- **Response**: 
  ```json
  {
    "success": true
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `400`: Message IDs are required
  - `401`: Unauthorized
  - `500`: Failed to mark messages as read

#### Delete a message
- **URL**: `/api/messages/:messageId`
- **Method**: `DELETE`
- **Authentication**: Required
- **URL Parameters**: `messageId` - ID of the message to delete
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Message deleted successfully"
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `401`: Unauthorized
  - `404`: Message not found
  - `500`: Failed to delete message

#### Send a message to a user
- **URL**: `/api/messages`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "username": "string",
    "content": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Message sent successfully"
  }
  ```
- **Status Codes**:
  - `201`: Message sent successfully
  - `400`: Username and message content are required/Message is too long
  - `404`: Recipient not found
  - `500`: Failed to send message

### Profile Routes (`/api/profile`)

#### Get current user profile
- **URL**: `/api/profile`
- **Method**: `GET`
- **Authentication**: Required
- **Response**: 
  ```json
  {
    "id": "string",
    "username": "string",
    "profilePicture": "string",
    "bio": "string",
    "allowNotifications": boolean,
    "createdAt": "date"
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `401`: Unauthorized
  - `500`: Failed to fetch profile

#### Update profile
- **URL**: `/api/profile`
- **Method**: `PUT`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "bio": "string",
    "allowNotifications": boolean
  }
  ```
- **Response**: Updated user object
  ```json
  {
    "id": "string",
    "username": "string",
    "profilePicture": "string",
    "bio": "string",
    "allowNotifications": boolean
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `401`: Unauthorized
  - `500`: Failed to update profile

#### Upload profile picture
- **URL**: `/api/profile/upload-photo`
- **Method**: `POST`
- **Authentication**: Required
- **Content-Type**: `multipart/form-data`
- **Request Body**: Form data with field `profilePicture` containing the image file
- **Response**: 
  ```json
  {
    "id": "string",
    "username": "string",
    "profilePicture": "string"
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `401`: Unauthorized
  - `500`: Failed to upload profile picture

## Error Handling

All endpoints may return a JSON error object in the following format:

```json
{
  "message": "Error message"
}
```

## File Storage

Uploaded profile pictures are stored in the `/uploads` directory and can be accessed through the `/uploads/:filename` URL. 