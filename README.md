# SkillSwap

A peer-to-peer skill sharing platform prototype with mock skill data and Firebase integration.

## Preview

SkillSwap is a frontend prototype demonstrating a skill sharing interface. Since there are no suitable screenshots in the repository that represent actual user-generated content (all skills are mock data), here's a live demo section instead.

**Live Demo**: The deployed version is currently not accessible. To run locally, follow the installation instructions below.

**GitHub Repository**: https://github.com/vivekstackk/skillswap

## Overview

SkillSwap is a React-based frontend prototype for a peer-to-peer skill sharing platform. The application demonstrates the UI/UX concept of a platform where users can browse skills, view skill details, and navigate through different sections of the app.

**Note**: This prototype uses hardcoded mock skill data and does not persist user data or skills to a real database. The Firebase configuration is present but connected to a placeholder project.

### What SkillSwap Is
A frontend prototype showcasing the interface for a skill sharing platform built with React, Vite, and Firebase.

### Problem It Addresses
Provides a demonstration of how a skill sharing platform's user interface could be structured and styled.

### How the Platform Works
The prototype allows users to:
- Browse through predefined skill categories
- View detailed information about each skill (instructor, description, lecture videos)
- Navigate between different pages (Home, Profile, Browse Skills, etc.)
- Access mock skill data for demonstration purposes

### Designed For
Developers and designers interested in seeing a React-based skill sharing interface prototype.

## Key Features

Based on actual implementation in the source code:

- **Skill Browsing**: View a grid of skill cards with mock data
- **Skill Details**: View detailed information about individual skills including lecture videos
- **Navigation**: Client-side routing between different pages
- **User Authentication**: Firebase Google authentication integration (UI only)
- **Responsive Design**: Mobile-responsive layout using Tailwind CSS
- **Modern UI**: Built with Material-UI components and custom styling
- **Mock Data**: 25 predefined skills for demonstration purposes

## How It Works

1. **Explore Skills**: Browse the skill grid on the Browse Skills page
2. **View Skill Details**: Click on any skill to see detailed information and lecture videos
3. **Navigate**: Use the navigation bar to access different sections (Home, Profile, etc.)
4. **Authentication**: Click login to see the Firebase Google auth flow (demo mode)
5. **Responsive Layout**: Resize the browser to see the mobile-friendly interface

## Technology Stack

### Frontend
- **React 19** - JavaScript library for building user interfaces
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon set
- **Material-UI (MUI)** - Component library for UI elements

### Backend / Services
- **Firebase Authentication** - Auth service integration (demo mode)
- **Firebase Firestore** - Database service configured (not actively used for persistence)
- **Firebase Storage** - Storage service configured (not actively used)

### Development Tools
- **ESLint** - Code linting
- **PostCSS & Autoprefixer** - CSS processing
- **Vite Plugin React** - React integration for Vite

## Architecture

The application follows a standard React single-page application architecture:

```
React / Vite
↓
SkillSwap Frontend
↓
Firebase Services (Configured but not actively used for data persistence)
├── Authentication
├── Firestore
└── Storage
```

## Project Structure

```
skillswap/
├── public/                 # Static assets
│   ├── favicon.png
│   └── skills/             # Skill demonstration images
├── src/
│   ├── assets/             # Additional static assets
│   ├── components/         # Reusable components (Navbar, BackToHome)
│   ├── data/               # Mock skills data (skillsData.js)
│   ├── pages/              # Application pages (Home, Profile, BrowseSkills, etc.)
│   ├── firebaseClient.js   # Firebase initialization
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # Application entry point
│   ├── index.css           # Global styles
│   └── hero-split.css      # Component-specific styles
├── .gitignore              # Git ignore rules
├── eslint.config.js        # ESLint configuration
├── index.html              # Main HTML template
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

## Live Demo

The deployed version is currently not accessible. To experience SkillSwap locally:

## Installation

To run SkillSwap locally for development:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vivekstackk/skillswap.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd skillswap
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Visit `http://localhost:5173` to view the application

## Environment Variables

The Firebase configuration is already included in the source code (`src/firebaseClient.js`) for demonstration purposes. In a real production environment, you would need to:

1. Create a Firebase project at https://console.firebase.google.com/
2. Replace the configuration in `src/firebaseClient.js` with your actual Firebase credentials
3. Never commit actual Firebase credentials to version control

The following Firebase configuration values are required:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

> **Important**: The current Firebase configuration in the repository uses a placeholder project and is for demonstration purposes only.

## Roadmap

This is a prototype implementation. Future enhancements that would be needed for a fully functional platform:

- **Real Database Integration**: Connect to Firebase Firestore to store and retrieve actual skills and user data
- **User-Generated Content**: Allow users to create and publish their own skills
- **Persistent Authentication**: Implement proper user session management
- **Credit System**: Implement the time-credit system mentioned in the original concept
- **Messaging System**: Implement real-time communication between users
- **Skill Upload**: Allow users to upload lecture videos and skill materials
- **Search & Filtering**: Implement advanced search and filtering capabilities
- **User Profiles**: Implement persistent user profiles with learning history
- **Responsive Enhancements**: Further optimize mobile experience

These features are planned but not currently implemented in this prototype.

## Contributing

To contribute to SkillSwap:

1. **Fork** the repository on GitHub
2. **Create a new branch** for your feature or bug fix
3. **Make your changes** following the existing code style
4. **Test your changes** thoroughly
5. **Open a pull request** with a clear description of your changes

Please ensure your code follows the existing ESLint conventions.

## License

This project is licensed under the ISC license - see the [LICENSE](https://github.com/vivekstackk/skillswap/blob/main/LICENSE) file for details.

## Author

**Vivek Damar**
- GitHub: [https://github.com/vivekstackk](https://github.com/vivekstackk)
- Project: SkillSwap - Skill Sharing Platform Prototype

Built as a learning project to demonstrate React/Vite/Firebase integration.