# Language Learning Web Application

## Overview

A gamified language learning web application inspired by Duolingo's engagement mechanics and Notion's clean organization. The platform provides comprehensive language learning through four core skills: speaking, reading, listening, and writing. Users progress through levels, earn points, maintain streaks, and unlock achievements while practicing real-world scenarios across multiple languages.

**Tech Stack:**
- Frontend: React, TypeScript, Vite, TanStack Query, Wouter (routing)
- UI: Shadcn/ui components, Tailwind CSS
- Backend: Express.js, Node.js
- Database: PostgreSQL with Drizzle ORM
- AI Integration: Google Gemini AI for pronunciation and writing evaluation
- Styling: Custom theme system with dark/light modes

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component-Based Design**
- Built with React and TypeScript for type safety
- Uses Shadcn/ui component library for consistent, accessible UI components
- Custom components organized by feature (skill cards, scenario cards, achievement badges, etc.)
- Implements a theme provider for dark/light mode support with localStorage persistence

**State Management**
- TanStack Query (React Query) for server state management and caching
- Local React state for UI-specific concerns
- Centralized query client configuration with automatic error handling
- Query invalidation strategy for data consistency

**Routing**
- Wouter for lightweight client-side routing
- Main routes: Dashboard, Speaking, Reading, Listening, Writing, Review, Achievements
- Custom 404 page handling

**Design System**
- Hybrid Duolingo + Notion + Linear aesthetic
- Semantic color coding for skills (speaking: blue, reading: purple, listening: orange, writing: green)
- Typography: Inter for body text, Lexend for headings
- Responsive design with mobile-first approach
- Custom elevation system (hover-elevate, active-elevate-2) for interactive feedback

### Backend Architecture

**Express Server**
- RESTful API design pattern
- Middleware for request logging and JSON parsing
- Error handling middleware for consistent error responses
- Development-only Vite integration for HMR

**API Endpoints Structure**
- `/api/progress/:language` - User progress tracking (GET, PATCH)
- `/api/vocabulary` - Vocabulary management (GET, POST, DELETE)
- `/api/sentences` - Key sentences (GET, POST, PATCH)
- `/api/notes` - User notes (GET, POST)
- `/api/review` - Spaced repetition review items (GET, POST, PATCH)
- `/api/achievements` - Achievement tracking (GET, PATCH)
- `/api/pronunciation/evaluate` - AI-powered pronunciation scoring (POST)
- `/api/writing/evaluate` - AI-powered writing feedback (POST)

**Storage Layer**
- Interface-based storage abstraction (IStorage) for database operations
- Supports multiple entity types: UserProgress, Vocabulary, KeySentence, Note, ReviewItem, Achievement, PronunciationResult, WritingResult
- Promise-based async operations throughout

### Data Storage Solutions

**Drizzle ORM**
- Type-safe database operations
- Schema definitions with Zod validation
- Migration support via drizzle-kit
- PostgreSQL dialect configuration

**Database Schema**
- User Progress: language-specific progress tracking with skill breakdowns
- Vocabulary: word definitions, translations, examples per language
- Key Sentences: scenario-based sentences with memorization tracking
- Notes: user-created notes linked to skills and languages
- Review Items: spaced repetition system with next review dates
- Achievements: gamification badges with unlock status
- Results: pronunciation and writing evaluation history

**Session Management**
- connect-pg-simple for PostgreSQL-backed sessions
- Supports user authentication persistence

### External Dependencies

**Google Gemini AI Integration**
- Used for pronunciation evaluation (analyzing user speech recordings)
- Writing feedback generation (grammar, vocabulary, spelling corrections)
- Integrated via @google/genai package
- API key configuration through environment variables

**Third-Party UI Libraries**
- Radix UI primitives for accessible, unstyled components
- Lucide React for consistent iconography
- React Day Picker for calendar components
- Embla Carousel for carousel functionality
- Recharts for potential data visualization

**Development Tools**
- Vite for fast development and optimized production builds
- ESBuild for server-side bundling
- TypeScript for type checking across the stack
- Replit-specific plugins for development environment integration

**Design Rationale**
The architecture separates concerns cleanly: React handles UI presentation, TanStack Query manages server state synchronization, Express provides API endpoints, Drizzle ORM abstracts database operations, and Gemini AI enhances learning through intelligent feedback. This allows each layer to be developed, tested, and scaled independently while maintaining clear contracts through TypeScript interfaces.