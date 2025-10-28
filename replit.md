# Language Learning Web Application

## Overview
This project is a gamified web application for language learning, drawing inspiration from Duolingo's engagement mechanics and Notion's organized interface. It aims to provide a comprehensive learning experience across speaking, reading, listening, and writing. Users can progress through levels, earn points, maintain streaks, and unlock achievements while practicing various languages in real-world scenarios. The platform integrates AI for advanced pronunciation and writing evaluation, offering a modern and interactive approach to language acquisition.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The frontend is built with React and TypeScript, utilizing Shadcn/ui and Tailwind CSS for a consistent and accessible user interface. It follows a component-based design, organizing elements by feature. State management is handled by TanStack Query for server state and caching, with Wouter providing lightweight client-side routing for public and protected routes. The design system combines aesthetics from Duolingo, Notion, and Linear, featuring semantic color coding for skills, responsive design, and custom interactive feedback.

### Backend
The backend is an Express.js server providing a RESTful API. It includes middleware for request logging, JSON parsing, and consistent error handling. Key API endpoints manage user progress, vocabulary, sentences, notes, review items, achievements, and AI-powered evaluation for pronunciation and writing.

### Data Storage
PostgreSQL is used as the database, accessed via Drizzle ORM for type-safe operations and schema migrations. The database schema includes tables for User Progress, Vocabulary, Key Sentences, Notes, Review Items, Achievements, and AI evaluation results. Session management is handled by `connect-pg-simple` for PostgreSQL-backed sessions.

### UI/UX Decisions
The application features a hybrid design inspired by Duolingo, Notion, and Linear. Semantic color coding is used for different language skills (e.g., blue for speaking, purple for reading). Typography includes Inter for body text and Lexend for headings. The design is responsive and mobile-first, incorporating custom elevation for interactive elements.

### Feature Specifications
- **Speaking Module**: Real-world conversation practice across 10 scenarios organized by category (Business, Travel, Daily Life, Social). Features include:
  - **Phase 2**: Realistic conversation practice with GPT-4o powered dialogue. Each scenario contains 3-7 steps with useful expressions (3 per step, each with 3 examples). Real-time AI feedback evaluates pronunciation, grammar, fluency, and appropriateness. TTS for expressions and examples, Web Speech API for voice input, progress tracking per step, and retry functionality.
- **Listening Module**: Offers short-form dictation with Levenshtein distance scoring and long-form content listening with paragraph-by-paragraph navigation, translation toggles, and playback speed control.
- **Vocabulary & Notebook**: Provides an interactive dictionary feature where words in content are clickable, offering definitions, phonetics, examples, and instant saving to a personal vocabulary notebook with filtering and status tracking.
- **Reading Module**: Supports reading passages across multiple difficulty levels and content types. It includes paragraph-by-paragraph translations, clickable words for vocabulary lookup, and comprehension questions (main idea, detail, inference, vocabulary) with automatic scoring and explanations.
- **Writing Module**: Comprehensive writing practice with AI-powered feedback. Features include:
  - **Phase 1**: Topic selection with filtering by difficulty (Lv.1-5) and category (email, essay, letter, review, story, opinion). Real-time word count tracking and basic AI evaluation using Gemini AI.
  - **Phase 2**: Advanced GPT-4 powered detailed feedback system including grammar error detection with corrections and explanations, improvement suggestions with examples, fully corrected content for comparison, strengths and areas for improvement analysis, and comprehensive scoring (0-100). Automated submission-to-feedback flow with instant redirection to detailed results. "My Writings" page for viewing all submitted work with scores and error counts.
- **Authentication**: Implemented using Supabase Auth, supporting email/password and Google OAuth. Features include secure password handling, session management with automatic token refresh, and Row-Level Security (RLS) for data protection.
- **API Key Management**: Securely handles Supabase and Google Gemini AI API keys via Replit Secrets. Includes server-side validation, client-side status monitoring, and clear user guidance for configuration and error handling.

## External Dependencies

- **AI Integration**: 
  - OpenAI GPT-4o for detailed writing feedback, speaking conversation practice, and evaluation
  - Google Gemini AI (@google/genai) for pronunciation and basic writing evaluation
- **Authentication**: Supabase Auth for user authentication and management.
- **Database**: PostgreSQL, Drizzle ORM, `connect-pg-simple` for session storage.
- **Frontend Frameworks**: React, TypeScript, Vite.
- **UI Libraries**: Shadcn/ui, Tailwind CSS, Radix UI (primitives), Lucide React (icons), React Day Picker, Embla Carousel, Recharts.
- **Routing**: Wouter.
- **State Management**: TanStack Query (React Query).
- **Development Tools**: Vite, ESBuild.
- **External APIs**: dictionaryapi.dev (as a fallback for vocabulary definitions).