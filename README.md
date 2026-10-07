# SkillSwap

A modern peer-to-peer platform for discovering, sharing, and learning skills.

## Project Overview

SkillSwap is a peer-to-peer skill sharing platform that enables users to discover new skills, learn from others' expertise, and share their own knowledge. The platform operates on a time-credit system where users earn credits by publishing skills and spend those credits to learn from others, creating a collaborative learning community.

**Problem it solves:** Traditional learning platforms often lack personal connection and practical, real-world skills taught by actual practitioners. SkillSwap bridges this gap by connecting people directly to share knowledge in a community-driven environment.

**How users can use it:**
- Browse skills across various categories (tech, arts, cooking, fitness, etc.)
- Learn practical skills through video lectures and tutorials
- Share your expertise by creating and publishing your own skill lessons
- Earn time credits for publishing skills that can be used to unlock other skills
- Connect with other learners and skill creators through messaging

**Why it is useful:** SkillSwap democratizes education by allowing anyone to both teach and learn, creating a sustainable ecosystem where knowledge is freely exchanged within the community.

## Key Features

- **Skill Discovery:** Browse and search through a growing library of user-created skills
- **Interactive Learning:** Video-based lectures with structured curriculum
- **Credit System:** Earn time credits for publishing skills, spend credits to learn
- **Skill Creation:** Easy tools to create and publish your own skill lessons
- **User Profiles:** Track your learning journey and published skills
- **Messaging:** Connect directly with skill creators and learners
- **Responsive Design:** Works seamlessly on desktop and mobile devices
- **Authentication:** Secure user authentication with Firebase

## Tech Stack

### Frontend
- **React 19** - JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router DOM** - Declarative routing for React applications
- **Lucide React** - Beautiful, consistent icon set

### Backend & Services
- **Firebase Authentication** - Secure user authentication and management
- **Cloud Firestore** - Real-time NoSQL database for skill and user data
- **Firebase Admin** - Server-side Firebase SDK for administrative functions

### UI Components
- **Material-UI (MUI) v7** - React component library for building accessible UIs

### Development Tools
- **ESLint** - JavaScript linting utility for code quality
- **PostCSS & Autoprefixer** - CSS processing for cross-browser compatibility

## How It Works

1. **Explore Skills:** Browse the skill library or search for specific skills you want to learn
2. **Learn a Skill:** Select a skill, check if you have enough time credits, and unlock the lessons
3. **Learn & Practice:** Watch video lectures, follow tutorials, and practice the skill
4. **Share Knowledge:** Create your own skill lessons using the skill creation tool
5. **Publish & Earn:** Publish your skill to earn time credits that others can use to learn from you
6. **Connect:** Use the messaging system to ask questions, share feedback, and connect with other learners

## Demo

You can try the live demo at: https://skillswaapp.vercel.app

## Installation

To run SkillSwap locally for development or contribution:

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

4. **Set up environment variables:**
   Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_API_KEY=your_firebase_api_key
   VITE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_PROJECT_ID=your_firebase_project_id
   VITE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_APP_ID=your_firebase_app_id
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Visit `http://localhost:5173` to view the application

## Environment Variables

The following environment variables are required for Firebase integration:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_KEY` | Firebase API key | `AIzaSyABCDEF1234567890` |
| `VITE_AUTH_DOMAIN` | Firebase authentication domain | `skillswap.firebaseapp.com` |
| `VITE_PROJECT_ID` | Firebase project ID | `skillswap` |
| `VITE_STORAGE_BUCKET` | Firebase storage bucket | `skillswap.appspot.com` |
| `VITE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `1234567890` |
| `VITE_APP_ID` | Firebase app ID | `1:1234567890:web:abcdef123456` |

> **Important:** Never commit your actual `.env` file to version control. The `.gitignore` file is configured to exclude `.env` files for security.

## Project Structure

```
skillswap/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, icons, and media files
│   ├── components/         # Reusable React components
│   ├── data/               # Skill data and mock data
│   ├── pages/              # Application pages/routes
│   ├── firebaseClient.js   # Firebase initialization and configuration
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── styles/             # CSS and styling files
├── .vercel/                # Vercel deployment configuration
├── .gitignore              # Git ignore rules
├── eslint.config.js        # ESLint configuration
├── index.html              # Main HTML template
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

## Future Improvements

These are planned enhancements for future versions of SkillSwap:

- **Skill Categories:** Improved categorization and tagging system for better discovery
- **Progress Tracking:** Visual progress bars and completion tracking for skills
- **Skill Ratings & Reviews:** Allow users to rate and review skills they've learned
- **Live Sessions:** Option to schedule and host live skill-sharing sessions
- **Mobile App:** Native mobile applications for iOS and Android
- **Offline Access:** Download skills for offline learning
- **Gamification:** Badges, achievements, and leaderboards to encourage participation
- **Advanced Search:** Filters by difficulty level, duration, and skill type
- **Multi-language Support:** Internationalization for global accessibility

## Contributing

We welcome contributions to SkillSwap! To contribute:

1. **Fork the repository** on GitHub
2. **Create a new branch** for your feature or bug fix
3. **Make your changes** following the existing code style
4. **Test your changes** thoroughly
5. **Submit a pull request** with a clear description of your changes

Please ensure your code follows the existing ESLint conventions and includes appropriate tests where applicable.

## License

This project is currently licensed under the ISC license. See the [LICENSE](LICENSE) file for details.

## Author

**Vivek Damar**
- GitHub: [https://github.com/vivekstackk](https://github.com/vivekstackk)
- Project: SkillSwap - Peer-to-Peer Skill Sharing Platform

Built with ❤️ for curious learners and passionate teachers everywhere.