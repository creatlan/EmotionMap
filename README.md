# EmotionMap

EmotionMap is a web application that allows users to analyze and visualize emotions on a map. Users can submit text, which is analyzed for emotional content, and the results are displayed as markers or clusters on a map.

## Project Structure

```
EmotionMap/
├── backend/
│   ├── ml-service/         # Machine learning service for emotion analysis and clustering
│   ├── mongodb-service/    # MongoDB wrapper service for managing points data
│   ├── requirements.txt    # Shared Python dependencies
│   ├── data/               # Sample data for testing
├── frontend/               # React-based frontend application
│   ├── public/             # Static assets
│   ├── src/                # React components and utilities
├── docker-compose.yml      # Docker Compose configuration
```

## Services

### 1. ML Service
- **Description**: Provides endpoints for emotion analysis and clustering.
- **Technology**: Python, FastAPI, scikit-learn, transformers.
- **Endpoints**:
  - `/analyze`: Analyze emotions in text.
  - `/clusters`: Retrieve clusters of points.
- **Dockerfile**: Located in `backend/ml-service/Dockerfile`.

### 2. MongoDB Service
- **Description**: Acts as a wrapper around MongoDB, providing endpoints to manage and retrieve points data.
- **Technology**: Python, FastAPI, pymongo.
- **Endpoints**:
  - `/points`: Retrieve all points.
  - `/points/{username}`: Retrieve points for a specific user.
  - `/point`: Add a new point.
- **Dockerfile**: Located in `backend/mongodb-service/Dockerfile`.

### 3. Frontend
- **Description**: React-based web application for visualizing emotions on a map.
- **Technology**: React, Leaflet.
- **Features**:
  - Submit text for emotion analysis.
  - View results as markers or clusters on a map.
- **Dockerfile**: Located in `frontend/Dockerfile`.

## Running the Project

### Prerequisites
- Docker and Docker Compose installed.

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd EmotionMap
   ```
2. Start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - ML Service: [http://localhost:8000](http://localhost:8000)
   - MongoDB Service: [http://localhost:8001](http://localhost:8001)

## Development

### Backend
- Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- Run services locally:
  ```bash
  uvicorn backend/ml-service/main:app --reload --port 8000
  python backend/mongodb-service/main.py
  ```

### Frontend
- Install dependencies:
  ```bash
  cd frontend
  npm install
  ```
- Start the development server:
  ```bash
  npm start
  ```

## License
This project is licensed under the MIT License.