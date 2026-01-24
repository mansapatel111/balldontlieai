# Ball Don't Lie - Brainrot Sports Commentator

"Ball Don't Lie" is a React application that transforms ordinary sports clips into humorous, meme-filled commentary. Select your personality, choose a voice, and let the AI roast the gameplay.

## Features

- **Upload & Preview**: Upload your own gameplay clips.
- **Personality Selector**: Choose from different "vibes" (Ruthless, Hype, Analytical, Savage).
- **Voice Selector**: Pick the perfect AI voice narrator (Adam, Charlie, Bella, Drake).
- **Immersive UI**: Cybernetic grid background with interactive shader effects.
- **Commentary Showcase**: "Hall of Flame" featuring top community roasts.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Framer Motion
- **UI Components**: Shadcn UI, Lucide Icons
- **3D/Graphics**: Three.js (for the interactive grid background)
- **Audio**: use-sound for interactive UI sound effects

## Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually installed with Node.js)

### Installation

1.  **Clone the repository** (if you downloaded as zip, extract it):
    ```bash
    git clone <your-repo-url>
    cd ball-dont-lie
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Running the Application

To start the development server:

```bash
npm run dev:client
```

This will launch the application at `http://localhost:5000` (or another available port).

### Building for Production

To create a production-ready build:

```bash
npm run build
```

This generates the static files in the `dist` directory.

## Project Structure

- `client/src`: Main React application code
  - `components`: Reusable UI components (VibeSelector, VoiceSelector, etc.)
  - `pages`: Application pages (Home, Studio)
  - `lib`: Utility functions and constants
- `client/public`: Static assets (images, sounds)

## License

MIT
