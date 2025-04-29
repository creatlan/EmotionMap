# MongoDB Service

This service acts as a wrapper around MongoDB, providing endpoints to manage and retrieve points data.

## Endpoints

### `/points/{username}`
- **Method**: GET
- **Description**: Retrieves all points for a specific user.
- **Response**:
  ```json
  [
    {
      "username": "string",
      "text": "string",
      "coords": { "lat": "float", "lng": "float" },
      "label": "string",
      "score": "float",
      "timestamp": "string"
    }
  ]
  ```

### `/points`
- **Method**: GET
- **Description**: Retrieves all points in the database.
- **Response**:
  ```json
  [ ... ]
  ```

### `/point`
- **Method**: POST
- **Description**: Adds a new point to the database.
- **Request Body**:
  ```json
  {
    "username": "string",
    "text": "string",
    "coords": { "lat": "float", "lng": "float" },
    "label": "string",
    "score": "float",
    "timestamp": "string"
  }
  ```

### `/point/{_id}`
- **Method**: DELETE
- **Description**: Deletes a specific point by its ID.
- **Response**:
  ```json
  {
    "success": true
  }
  ```

### `/user/{username}`
- **Method**: GET
- **Description**: Retrieves user details.
- **Response**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### `/user/{username}`
- **Method**: POST
- **Description**: Creates a new user.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### `/user/{username}`
- **Method**: DELETE
- **Description**: Deletes a user by their username.
- **Response**:
  ```json
  {
    "success": true
  }
  ```

## Running the Service

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the service:
   ```bash
   python main.py
   ```