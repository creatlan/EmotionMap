# ML Service

This service provides machine learning capabilities for emotion analysis and clustering.

## Endpoints

### `/analyze`
- **Method**: POST
- **Description**: Analyzes the emotion of a given text.
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

### `/clusters`
- **Method**: GET
- **Description**: Retrieves clusters of points based on their coordinates.
- **Query Parameters**:
  - `n` (integer): Number of clusters.
- **Response**:
  ```json
  [
    {
      "cluster": "integer",
      "center": { "lat": "float", "lng": "float" },
      "points": [ ... ],
      "mode": "string"
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