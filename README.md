# Quizitude
This project is a web application called Quizitude with a focus on a clean user interface and robust Al powered question extraction, allowing users to convert PDFs into flashcards.

⭐️ Goals:
- Streamline Study Process: Provide an efficient way to turn study material into interactive flashcards.
- Intelligent Question Identification: Develop AI models that accurately extract various question types from PDFs.
- Friendly Experience: Design a modern and intuitive interface for easy flashcard creation and studying.

Tech Stack:
- Frontend: React JS, Vite
- Backend: Supabase (Backend-as-a-Service)
- Database: Supabase (PostgreSQL)
- AI/ML: LLMs from OpenRouter
- Deployment: Vercel


## Table of Contents
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Running Tests](#running-tests)
- [Building for Production](#building-for-production)
- [Previewing the Build](#previewing-the-build)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Getting Started
These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites
Make sure you have the following installed:

- Node.js (v16.x or higher)
- Yarn (v1.x or higher)

To install Yarn, run:

npm install -g yarn

## Installation
Clone the repository:
- `git clone <repository-url>`
- `cd <project-folder>`

Install dependencies:
`yarn install`

## Running the App
To run the app, use:
`yarn run dev`
Starts the development server. Your app will be accessible at [http://localhost:3000](http://localhost:3000).

## Running Tests
To run tests, use:
`yarn run test`
Make sure your test files are located in the test directory and match the test naming convention.

## Building for Production
To create an optimized production build, run:
`yarn run build`
The production build will be available in the `dist/` directory.

## Previewing the Build
To preview the production build, run:
`yarn run preview`
This will serve the production build at [http://localhost:5000](http://localhost:5000).

## Project Structure
Key directories:
```
├── src/               # Main source code
│   ├── api/           # API-related files and integrations
│   │   └── llm.js     # File for large language model interactions
│   ├── assets/        # Static assets like images, fonts
│   ├── components/    # Reusable components
│   ├── context/       # React context providers for global state
│   ├── hooks/         # Custom React hooks for supabase calls
│   ├── pages/         # Application pages
│   ├── services/      # Service modules for handling supabase logic
│   ├── utils/         # Supabase setup and utilities
│   └── App.jsx        # Main application component
│   └── main.jsx        # Application entry point
├── tests/             # Unit and integration tests
└── dist/              # Built production files
```

## Contributing
This a private project, so contributions will be limited.

## License
This project license is to be determined.
