# ML Service - EmotionMap

This service provides machine learning capabilities for emotion analysis from text and clustering of geographical emotion points. It interacts with the MongoDB service for data retrieval and potentially for updating models or storing analysis results if not handled by the calling service.

## Endpoints

### `POST /points`
- **Description**: Analyzes emotions in the provided text using a pre-trained model. This endpoint is typically called by the frontend or another backend service.
- **Request Body**:
  ```json
  {
    "username": "string", // Optional: username for context, if used by the model
    "text": "string",     // Text to be analyzed
    "coords": {           // Optional: coordinates, if relevant for some combined operation
      "lat": "float",
      "lng": "float"
    }
  }
  ```
- **Response**:
  ```json
  {
    "label": "string",  // Predicted emotion label (e.g., "joy", "sadness")
    "score": "float"    // Confidence score of the prediction
  }
  ```
  **Note**: This endpoint performs analysis. The actual creation or updating of a point in the database is typically handled by the MongoDB service, often orchestrated by the frontend after receiving analysis results.

### `POST /models/train`
- **Description**: Trains or fine-tunes the emotion analysis model (e.g., Naive Bayes) with new user-provided text and a corresponding emotion label. This allows the model to adapt and improve over time based on user feedback.
- **Request Body**:
  ```json
  {
    "text": "string",   // The text sample
    "label": "string" // The correct emotion label for the text
  }
  ```
- **Response**:
  ```json
  {
    "message": "Model trained successfully"
  }
  ```

### `GET /clusters`
- **Description**: Retrieves clusters of emotion points. This is used to group nearby points on the map for better visualization of emotion density.
- **Query Parameters**:
  - `n` (integer, optional): Desired number of clusters. Defaults to a predefined value if not provided.
- **Response**: An array of cluster objects, each containing:
  ```json
  [
    {
      "cluster_id": "integer",
      "center": { "lat": "float", "lng": "float" }, // Centroid of the cluster
      "points_count": "integer",                   // Number of points in this cluster
      "dominant_emotion": "string"                 // (Optional) Most common emotion in the cluster
      // "points": [ ... ] // (Optional) Array of actual point objects within the cluster
    }
  ]
  ```

### `GET /clusters/{username}`
- **Description**: Retrieves clusters of emotion points specific to a given user.
- **Path Parameters**:
  - `username` (string): The username for whom to fetch clusters.
- **Query Parameters**:
  - `n` (integer, optional): Desired number of clusters.
- **Response**: Similar structure to `GET /clusters`, but filtered for the specified user.

## Running the Service

1.  Navigate to the `ml-service` directory:
    ```bash
    cd backend/ml-service
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the service (default port 8000):
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
    Access API docs at `http://localhost:8000/docs`.

## Configuration

The service may use environment variables for configuration, such as:
- `MODEL_PATH`: Path to the pre-trained model files.
- `CLUSTER_CONFIG`: Configuration for clustering parameters (e.g., default number of clusters).
- `MONGODB_SERVICE_URL`: URL for the MongoDB service if direct interaction is needed (e.g., for fetching data for clustering).

Check `config/config.py` for specific environment variables used.