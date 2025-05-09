# Frontend - EmotionMap

This is the frontend application for the EmotionMap project. It is built using React and provides a user interface for submitting text for emotion analysis, managing emotion entries, and visualizing the results on an interactive map.

## Features

- User registration and login system.
- Submit text for automatic emotion analysis via the ML service.
- Option to manually select an emotion for a text entry, which also helps train the backend model.
- View personal and global emotion points on an interactive map (Leaflet).
- Emotion points can be displayed individually or as clusters.
- Create, view, edit, and delete personal emotion entries.
- Responsive design with a toggle for light/dark theme.
- Toast notifications for user feedback.

## Project Structure

```
frontend/
├── public/             # Static assets (index.html, manifest.json, icons)
├── src/                # React application source code
│   ├── assets/         # SVG icons and other static assets used by components
│   ├── auth/           # Authentication context and API calls
│   ├── components/     # Reusable UI components (e.g., Header, Markers)
│   ├── screens/        # Page-level components (e.g., HomeScreen, LoginScreen, AboutScreen)
│   ├── utils/          # Utility functions (e.g., color generation)
│   ├── App.js          # Main application component with routing
│   ├── EmotionForm.js  # Form for submitting/editing emotion entries
│   ├── EmotionsContext.js # Context for managing emotion definitions (types, colors)
│   ├── index.js        # Entry point of the React application
│   └── MapComponent.js # Core map rendering and interaction logic
├── .gitignore
├── Dockerfile          # For containerizing the frontend
├── package.json        # Project dependencies and scripts
└── README.md
```

## Available Scripts

In the `frontend` project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.
Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them.

## Development

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```

## Deployment

1.  Build the application:
    ```bash
    npm run build
    ```
2.  Deploy the contents of the `build` folder to your hosting provider or serve it using a static web server.
    The `Dockerfile` included in this directory can be used to build a Docker image for deployment.
