# EmotionMap

EmotionMap is a web application that allows users to analyze and visualize emotions on a map. Users can submit text, which is analyzed for emotional content, and the results are displayed as markers or clusters on a map. The application supports user authentication and personalized emotion tracking.

## Project Structure

```
EmotionMap/
├── backend/
│   ├── ml-service/         # Machine learning service for emotion analysis and clustering
│   │   └── requirements.txt
│   ├── mongodb-service/    # MongoDB wrapper service for managing points, users, and emotions data
│   │   └── requirements.txt
│   ├── redis-service/      # Redis service for caching and real-time data operations
│   │   └── requirements.txt
│   ├── data-analysis/      # Jupyter notebooks and datasets for data exploration
├── frontend/               # React-based frontend application
│   ├── public/             # Static assets
│   ├── src/                # React components and utilities
├── docker-compose.yml      # Docker Compose configuration
├── package.json            # Root package.json for potential workspace management
└── README.md
```

## Services

### 1. ML Service
- **Description**: Provides endpoints for emotion analysis from text and clustering of geographical points.
- **Technology**: Python, FastAPI, scikit-learn, transformers.
- **Endpoints**:
  - `POST /points`: Analyzes emotions in the provided text. Returns the determined label and score. (Note: This endpoint analyzes; data persistence is handled by the MongoDB service via frontend or direct call).
  - `POST /models/train`: Trains the Naive Bayes model with user-provided text and label, allowing for personalized model improvement.
  - `GET /clusters`: Retrieves clusters of emotion points, useful for visualizing trends on the map.
  - `GET /clusters/{username}`: Retrieves clusters specific to a user.
- **Dockerfile**: Located in `backend/ml-service/Dockerfile`.

### 2. MongoDB Service
- **Description**: Acts as a wrapper around MongoDB, providing RESTful APIs to manage points, users, and emotion definitions.
- **Technology**: Python, FastAPI, Pymongo.
- **Endpoints**:
  - Points Management:
    - `GET /points`: Retrieve all points.
    - `GET /points/{username}`: Retrieve points for a specific user.
    - `POST /points`: Add a new emotion point.
    - `PUT /points/`: Update an existing emotion point.
    - `DELETE /points/{_id}`: Delete a specific point.
  - User Management:
    - `POST /users/register`: Create a new user.
    - `POST /users/login`: Authenticate a user.
    - `GET /users/{username}`: Retrieve user details (requires authentication/authorization).
    - `DELETE /users/{username}`: Delete a user (requires authentication/authorization).
  - Emotions Management:
    - `GET /emotions/`: Retrieve all defined emotions and their associated colors.
    - `POST /emotions/`: Add a new emotion and its color (admin/internal use).
- **Dockerfile**: Located in `backend/mongodb-service/Dockerfile`.

### 3. Redis Service
- **Description**: Provides caching and real-time data operations, potentially for leaderboards, rate limiting, or session management.
- **Technology**: Python, FastAPI, Redis.
- **Endpoints**:
  - `PUT /values/{key}/{value}`: Increment a numeric value.
  - `PUT /values/{key}/{field}/{value}`: Increment a hashset field value.
  - `GET /values/{key}/{field}`: Retrieve a hashset field value.
  - `GET /values/{key}`: Retrieve a numeric value.
- **Dockerfile**: Located in `backend/redis-service/Dockerfile`.

### 4. Frontend
- **Description**: React-based web application for user interaction, data submission, and visualization of emotions on a map.
- **Technology**: React, Leaflet, Axios.
- **Features**:
  - User registration and login.
  - Submit text for emotion analysis.
  - Manually select emotion to train the model.
  - View personal and global emotion points as markers or clusters on an interactive map.
  - Edit and delete personal emotion points.
  - Dynamic light/dark theme.
- **Dockerfile**: Located in `frontend/Dockerfile`.

## Data Analysis for Pretraining

The `data-analysis` module contains scripts and datasets for preparing and pretraining the emotion analysis models. Follow these steps to use it:

1. **Prepare the Dataset**:
   - Ensure the `emotions_data.txt` file is present in the `data-analysis` directory. This file should contain a JSON array of objects with `text` and `label` fields.

2. **Filter and Upload Data to MongoDB**:
   - Run the `filling.py` script to filter the dataset and upload points to the MongoDB service.
     ```bash
     python backend/data-analysis/filling.py
     ```
   - This script filters the dataset to ensure a balanced distribution of labels and uploads the filtered points to the MongoDB service.

3. **Train the Model**:
   - The same script (`filling.py`) also sends the data to the ML service for training the Naive Bayes model.
   - Ensure the ML service is running before executing the script.

4. **Verify Results**:
   - Check the logs printed by the script to confirm successful data insertion and model training.

5. **Dependencies**:
   - The script requires the `requests` library. Install it using:
     ```bash
     pip install requests
     ```

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
   - ML Service: [http://localhost:8000](http://localhost:8000) (e.g., /docs for API)
   - MongoDB Service: [http://localhost:8001](http://localhost:8001) (e.g., /docs for API)
   - Redis Service: [http://localhost:8002](http://localhost:8002) (e.g., /docs for API)

## Development

### Backend (per service)
- Navigate to the service directory (e.g., `cd backend/ml-service`).
- Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- Run services locally (example for ML service):
  ```bash
  uvicorn main:app --reload --port 8000 
  ```
  (Adjust port and command for other services: mongodb-service on 8001, redis-service on 8002)
  ```bash
  uvicorn backend/mongodb-service/main:app --reload --port 8001
  uvicorn backend/redis-service/main:app --reload --port 8002
  ```

### Frontend
- Navigate to the frontend directory:
  ```bash
  cd frontend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start the development server:
  ```bash
  npm start
  ```

## License
This project is licensed under the MIT License.