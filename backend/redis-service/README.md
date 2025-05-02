# Redis Service

This service provides an API for interacting with a Redis database. It supports operations for incrementing numbers, managing hashsets, and retrieving values.

## Endpoints

### `PUT /increment_number/{key}/{value}`
- **Description**: Increments a numeric value stored at the given key by the specified value.
- **Parameters**:
  - `key` (string): The key of the number to increment.
  - `value` (integer): The amount to increment the number by.
- **Response**:
  ```json
  {
    "message": "Number incremented successfully"
  }
  ```

### `PUT /increment_hashset/{key}/{field}/{value}`
- **Description**: Increments a numeric value in a hashset field by the specified value.
- **Parameters**:
  - `key` (string): The key of the hashset.
  - `field` (string): The field within the hashset to increment.
  - `value` (integer): The amount to increment the field's value by.
- **Response**:
  ```json
  {
    "message": "Hashset incremented successfully"
  }
  ```

### `GET /get/{key}/{field}`
- **Description**: Retrieves the value of a specific field in a hashset.
- **Parameters**:
  - `key` (string): The key of the hashset.
  - `field` (string): The field within the hashset to retrieve.
- **Response**:
  ```json
  {
    "value": "<value>"
  }
  ```

### `GET /get/{key}`
- **Description**: Retrieves the integer value stored at the given key.
- **Parameters**:
  - `key` (string): The key to retrieve the value from.
- **Response**:
  ```json
  {
    "value": "<value>"
  }
  ```

## Running the Service

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the service:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8002
   ```

## Configuration

The service uses the following environment variables for configuration:
- `REDIS_HOST`: The hostname of the Redis server (default: `localhost`).
- `REDIS_PORT`: The port of the Redis server (default: `6379`).
- `REDIS_DB`: The Redis database number (default: `0`).