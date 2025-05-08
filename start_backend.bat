@echo off
set MONGODB_SERVICE_HOST=localhost
set REDIS_SERVICE_HOST=localhost

echo MongoDB...
start "MongoDB Service" cmd /k "cd backend\mongodb-service && uvicorn main:app --host 0.0.0.0 --port 8001"

timeout /t 2 > nul

echo Redis...
start "Redis Service" cmd /k "cd backend\redis-service && uvicorn main:app --host 0.0.0.0 --port 8002"

timeout /t 2 > nul

echo ML...
start "ML Service" cmd /k "cd backend\ml-service && uvicorn main:app --host 0.0.0.0 --port 8000"

echo done
pause
