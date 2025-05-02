# MongoDB Service

This service acts as a wrapper around MongoDB, providing endpoints to manage and retrieve points data.

## Endpoints

### `GET /points/{username}`
- **Description**: Retrieve all points for a specific user.
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

### `GET /points`
- **Description**: Retrieve all points in the database.
- **Response**:
  ```json
  [ ... ]
  ```

### `POST /points`
- **Description**: Add a new point to the database.
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

### `DELETE /points/{_id}`
- **Description**: Delete a specific point by its ID.
- **Response**:
  ```json
  {
    "status": "ok"
  }
  ```

### `GET /users/{username}`
- **Description**: Retrieve user details.
- **Response**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### `POST /users/{username}`
- **Description**: Create a new user.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### `DELETE /users/{username}`
- **Description**: Delete a user by their username.
- **Response**:
  ```json
  {
    "status": "ok"
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