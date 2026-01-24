# Ball Don't Lie 🏀🎙️

**Ball Don't Lie** is a "brainrot" sports commentator app that transforms ordinary sports clips into hilarious, over-the-top commentary. It leverages a cyberpunk aesthetic and interactive 3D elements to create an immersive, high-energy experience.

![Project Status](https://img.shields.io/badge/status-prototype-orange)
![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20Three.js%20%7C%20Tailwind-blue)

## 🌟 Features

- **Video Input**: Upload or select sports clips for analysis.
- **Vibe Selector**: Choose the personality of your commentator (e.g., "The Hater," "The Glazer," "The Stat Nerd").
- **Voice Customization**: Select from various AI-styled voices.
- **Live Commentary Simulation**: Watch as the AI "watches" your clip and generates real-time, context-aware roast/hype commentary.
- **Immersive UI**:
  - **Cybernetic Grid Shader**: A retro-futuristic 3D background effect.
  - **Dotted Surface**: A dynamic, reacting particle field background.
  - **Glassmorphism**: Sleek, translucent UI elements.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**:
  - [Framer Motion](https://www.framer.com/motion/) for UI transitions.
  - [Three.js](https://threejs.org/) (@react-three/fiber) for 3D shaders and effects.
- **Routing**: [wouter](https://github.com/molefrog/wouter)
- **UI Components**: Custom components built with Radix UI primitives and Tailwind.

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    The app will be available at `http://0.0.0.0:5000`.

## 📂 Project Structure

```
client/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Basic building blocks (buttons, cards)
│   │   ├── cybernetic-grid-shader.tsx # 3D Background
│   │   └── dotted-surface.tsx         # Particle Background
│   ├── pages/           # Application pages (Home, Studio)
│   ├── lib/             # Utilities and helper functions
│   └── main.tsx         # Entry point
└── index.html           # HTML template
```

## 🎨 Design System

The app follows a **Cyberpunk / Dark Mode** aesthetic:
- **Colors**: Deep blacks (`#000000`), neon accents, and semi-transparent whites.
- **Typography**: `Space Grotesk` for headers, `Inter` for body text.
- **Visuals**: Scanlines, grids, particle effects, and glowing elements.

## 📝 License

This project is a rapid prototype created on Replit.
