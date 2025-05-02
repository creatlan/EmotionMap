# ML Service

This service provides machine learning capabilities for emotion analysis and clustering.

## Endpoints

### `POST /points`
- **Description**: Analyze emotions in text and add a new point to the MongoDB service.
- **Request Body**:
  ```json
  {
    "username": "string",
    "text": "string",
    "coords": { "lat": "float", "lng": "float" }
  }
  ```
- **Response**:
  ```json
  {
    "label": "string",
    "score": "float"
  }
  ```

### `POST /models/train`
- **Description**: Train the Naive Bayes model with provided text and label.
- **Request Body**:
  ```json
  {
    "text": "string",
    "label": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Model trained successfully"
  }
  ```

### `GET /clusters`
- **Description**: Retrieve clusters of points based on their coordinates.
- **Query Parameters**:
  - `n` (integer): Number of clusters.
- **Response**:
  ```json
  [
    {
      "cluster": "integer",
      "center": { "lat": "float", "lng": "float" },
      "points": [ ... ]
    }
  ]
  ```

## Running the Service

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the service:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Configuration

The service uses the following environment variables for configuration:
- `MODEL_PATH`: Path to the pre-trained model.
- `CLUSTER_CONFIG`: Configuration for clustering parameters.