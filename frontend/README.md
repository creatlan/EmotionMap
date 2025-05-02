# Frontend

This is the frontend application for the EmotionMap project. It is built using React and provides a user interface for submitting text for emotion analysis and visualizing the results on a map.

## Features

- Submit text for emotion analysis.
- View results as markers or clusters on a map.
- User authentication and profile management.

## Project Structure

```
frontend/
├── public/             # Static assets
├── src/                # React components and utilities
│   ├── assets/         # Images and icons
│   ├── components/     # Reusable UI components
│   ├── screens/        # Page-level components
│   ├── utils/          # Utility functions
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy the contents of the `build` folder to your hosting provider.
