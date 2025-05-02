# EmotionMap

EmotionMap is a web application that allows users to analyze and visualize emotions on a map. Users can submit text, which is analyzed for emotional content, and the results are displayed as markers or clusters on a map.

## Project Structure

```
EmotionMap/
├── backend/
│   ├── ml-service/         # Machine learning service for emotion analysis and clustering
│   ├── mongodb-service/    # MongoDB wrapper service for managing points data
│   ├── redis-service/      # Redis service for caching and real-time data operations
│   ├── requirements.txt    # Shared Python dependencies
│   ├── data-analysis/      # Jupyter notebooks and datasets for data exploration
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
  - `POST /points`: Analyze emotions in text and add a new point.
  - `POST /models/train`: Train the Naive Bayes model.
  - `GET /clusters`: Retrieve clusters of points.
- **Dockerfile**: Located in `backend/ml-service/Dockerfile`.

### 2. MongoDB Service
- **Description**: Acts as a wrapper around MongoDB, providing endpoints to manage and retrieve points data.
- **Technology**: Python, FastAPI, pymongo.
- **Endpoints**:
  - `GET /points`: Retrieve all points.
  - `GET /points/{username}`: Retrieve points for a specific user.
  - `POST /points`: Add a new point.
  - `DELETE /points/{_id}`: Delete a specific point.
  - `GET /users/{username}`: Retrieve user details.
  - `POST /users/{username}`: Create a new user.
  - `DELETE /users/{username}`: Delete a user.
- **Dockerfile**: Located in `backend/mongodb-service/Dockerfile`.

### 3. Redis Service
- **Description**: Provides caching and real-time data operations.
- **Technology**: Python, FastAPI, Redis.
- **Endpoints**:
  - `PUT /values/{key}/{value}`: Increment a numeric value.
  - `PUT /values/{key}/{field}/{value}`: Increment a hashset field value.
  - `GET /values/{key}/{field}`: Retrieve a hashset field value.
  - `GET /values/{key}`: Retrieve a numeric value.
- **Dockerfile**: Located in `backend/redis-service/Dockerfile`.

### 4. Frontend
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
   - Redis Service: [http://localhost:8002](http://localhost:8002)

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
  uvicorn backend/redis-service/main:app --reload --port 8002
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