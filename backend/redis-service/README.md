# Redis Service - EmotionMap

This service provides a simple API for interacting with a Redis database. It can be used for caching, session management, rate limiting, or other tasks requiring fast key-value storage.

## Endpoints

### `PUT /values/{key}/{value}`
- **Description**: Stores or increments a simple numeric value associated with a key. If the key exists and holds a number, it's incremented by `value`. If it doesn't exist, it's set to `value`.
- **Path Parameters**:
  - `key` (string): The key for the numeric value.
  - `value` (integer): The integer value to set or increment by.
- **Response**:
  ```json
  {
    "message": "Number updated/incremented successfully",
    "key": "string",
    "new_value": "integer"
  }
  ```

### `GET /values/{key}`
- **Description**: Retrieve the numeric value stored at the given key.
- **Path Parameters**:
  - `key` (string): The key to retrieve the value from.
- **Response**:
  ```json
  {
    "key": "string",
    "value": "integer" // or null/error if key not found or not a number
  }
  ```

### `PUT /values/{key}/{field}/{value}`
- **Description**: Sets or increments a numeric value within a hashset field. If the hash or field doesn't exist, they are created.
- **Path Parameters**:
  - `key` (string): The key of the hashset.
  - `field` (string): The field within the hashset.
  - `value` (integer): The integer value to set or increment the field by.
- **Response**:
  ```json
  {
    "message": "Hashset field updated/incremented successfully",
    "key": "string",
    "field": "string",
    "new_value": "integer"
  }
  ```

### `GET /values/{key}/{field}`
- **Description**: Retrieve the value of a specific field in a hashset.
- **Path Parameters**:
  - `key` (string): The key of the hashset.
  - `field` (string): The field within the hashset to retrieve.
- **Response**:
  ```json
  {
    "key": "string",
    "field": "string",
    "value": "string" // Values in Redis hash fields are strings; convert as needed
                      // or null/error if key/field not found
  }
  ```

## Running the Service

1.  Navigate to the `redis-service` directory:
    ```bash
    cd backend/redis-service
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the service (default port 8002):
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8002 --reload
    ```
    Access API docs at `http://localhost:8002/docs`.

## Configuration

The service uses the following environment variables for configuration, typically defined in `config/config.py` or set in the environment:
- `REDIS_HOST`: The hostname of the Redis server (default: `localhost`).
- `REDIS_PORT`: The port of the Redis server (default: `6379`).
- `REDIS_DB`: The Redis database number (default: `0`).
- `REDIS_PASSWORD`: (Optional) Password for Redis authentication.