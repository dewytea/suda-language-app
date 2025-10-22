# Language Learning Web Application

## Overview

A gamified language learning web application inspired by Duolingo's engagement mechanics and Notion's clean organization. The platform provides comprehensive language learning through four core skills: speaking, reading, listening, and writing. Users progress through levels, earn points, maintain streaks, and unlock achievements while practicing real-world scenarios across multiple languages.

**Tech Stack:**
- Frontend: React, TypeScript, Vite, TanStack Query, Wouter (routing)
- UI: Shadcn/ui components, Tailwind CSS
- Backend: Express.js, Node.js
- Database: PostgreSQL with Drizzle ORM
- Authentication: Supabase Auth (email/password, Google OAuth)
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
- Public routes: Login (/login), Signup (/signup), Password Reset (/reset-password)
- Protected routes: Dashboard, Speaking, Reading, Listening, Writing, Review, Achievements, Settings
- Route protection via ProtectedRoute component (redirects to /login if not authenticated)
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

## Authentication System

**Supabase Authentication**
- Email/password authentication with secure password requirements (minimum 8 characters)
- Google OAuth integration for social login
- Password reset via email with magic link
- Session management with automatic token refresh
- Row-Level Security (RLS) policies for data access control

**Authentication Flow**
1. **Signup**: Email, password, name, native language, learning languages
2. **Login**: Email/password or Google OAuth
3. **Session**: Persistent sessions with automatic refresh
4. **Protected Routes**: All app pages require authentication
5. **Logout**: Clear session and redirect to login

**User Profile Management**
- Profiles table in Supabase extends auth.users
- Stores: full_name, native_language, learning_languages, level, XP, streak
- Auto-created on user signup via database trigger
- Users can only access their own profile data (RLS policies)

**Security Features**
- Row-Level Security (RLS) on all user data
- Secure password hashing (handled by Supabase Auth)
- JWT tokens for session management
- HTTPS-only communication
- Environment variables for sensitive credentials

## API Key Management

**Supabase Credentials**
- Supabase URL stored as `VITE_SUPABASE_URL` (public)
- Supabase anon key stored as `VITE_SUPABASE_ANON_KEY` (public)
- Keys configured in Replit Secrets
- Client-side initialization with auto-refresh enabled

**Google Gemini AI**
- API key stored securely in Replit Secrets as `GEMINI_API_KEY`
- Server-side API key validation with health check endpoint (`/api/health/gemini`)
- Client-side API key status monitoring via Settings page
- User-friendly error messages for API key issues
- Automatic API key validation on server startup

**Settings Page**
- Real-time API key status check
- Instructions for obtaining and configuring API key
- Direct link to Google AI Studio for key generation
- Visual indicators for API key health (configured/not configured, working/error)
- Security information display for user confidence

**Error Handling**
- Graceful degradation when API key is missing or invalid
- Clear error messages directing users to Settings page
- API service availability check before making AI requests
- Korean-language error messages for user accessibility

## Listening Module

**Overview**
The Listening module provides two distinct learning modes: short-form dictation practice and long-form content listening with paragraph-by-paragraph navigation.

**Content Types**

*Short-Form Dictation (Levels 1-3)*
- Categories: 일상 (daily life), 여행 (travel), 비즈니스 (business)
- Duration: 2-6 seconds per sentence
- Interactive dictation with Levenshtein distance scoring
- Real-time accuracy feedback with highlighted differences
- Progress tracking with score and accuracy metrics

*Long-Form Content (Levels 4-5)*
- Categories: AI/테크, 명언, 역사, 문학, 환경/과학
- Duration: 45-60 seconds (30s-3min range)
- Word count: 56-85 words per lesson
- Paragraph-by-paragraph navigation and playback
- Per-paragraph translation toggle
- No dictation requirement (pure listening comprehension)

**Audio Playback Features**

*AudioPlayerAdvanced Component*
- Web Speech API integration for text-to-speech
- Playback speed control: 0.5x, 0.75x, 1.0x, 1.25x, 1.5x
- Visual progress bar
- Play/pause/restart controls
- Exposed imperative handle (play, pause, restart) via forwardRef
- Browser compatibility fallback messaging

*LongContentPlayer Component*
- Individual paragraph playback with dedicated play buttons
- Full content playback mode
- Per-paragraph translation toggle (show/hide)
- Full translation display at bottom
- Visual highlighting of currently playing paragraph
- Seamless transition between paragraph and full playback

**Data Schema**
- `contentType`: 'sentence' | 'long' - distinguishes dictation vs listening-only lessons
- `paragraphs`: Array of {text, translation} objects for long content
- `wordCount`: Total word count for long content
- `estimatedDuration`: Expected listening duration in seconds

**UI/UX Design**
- Long content cards display purple gradient (vs green/blue for dictation)
- "긴 컨텐츠" badge for quick identification
- Word count and duration metadata displayed prominently
- Completion button (no scoring) for long content vs dictation submission for short content

**Recent Updates (October 2025)**
- Added long-form listening content feature with 5 sample lessons
- Implemented AudioPlayerAdvanced with playback speed control
- Created paragraph-by-paragraph navigation system
- Expanded category taxonomy to include advanced topics
- Maintained strict NO-EMOJI policy (lucide-react icons only)

## Vocabulary Dictionary & Personal Notebook

**Overview**
The Vocabulary system provides an interactive English dictionary with clickable words throughout the app's long-form listening content. Users can look up definitions, hear pronunciations, and save words to their personal vocabulary notebook for later review.

**Core Features**

*ClickableText Component*
- Interactive word detection: Every word in long-form listening paragraphs is clickable
- Instant word popup with comprehensive information:
  - Word definition (from local database or external API fallback)
  - Phonetic notation (IPA)
  - Part of speech (noun, verb, adjective, etc.)
  - Example sentence demonstrating usage
- Web Speech API integration for native pronunciation playback
- One-click save to personal vocabulary notebook
- Visual feedback when word is already saved (bookmark icon changes)
- Fallback to external dictionary API (dictionaryapi.dev) when word not in local database

*Vocabulary Database*
- Pre-seeded with 60+ common English words across 5 difficulty levels
- VocabularyWord schema: word, definition, phonetic, partOfSpeech, exampleSentence, difficultyLevel, frequencyRank
- UserVocabulary schema: userId, wordId, learned status, timesReviewed, lastReviewedAt, notes

*Personal Vocabulary Page (/learn/vocabulary)*
- Three-tab filtering system:
  - "전체" (All): Shows all saved words
  - "학습중" (Learning): Words marked as in-progress
  - "외움" (Learned): Words marked as memorized
- Statistics dashboard:
  - Total saved words count
  - Learning words count (orange)
  - Learned words count (green)
- Per-word actions:
  - Toggle learned status (학습중 ↔ 외움)
  - Delete from vocabulary
  - Play pronunciation (Volume2 button)
- Word card display:
  - Word with phonetic notation
  - Part of speech badge
  - Definition and example sentence
  - Optional user notes field

**Integration Points**
- LongContentPlayer: All paragraphs render through ClickableText component
- Sidebar navigation: "내 단어장" link with BookText icon
- Query invalidation: Vocabulary changes update across all components instantly

**API Endpoints**
- GET `/api/vocabulary/word?word={word}` - Fetch word definition from database
- GET `/api/vocabulary/saved?word={word}` - Check if user saved a word
- POST `/api/vocabulary/save` - Save word to user's vocabulary (body: {wordId})
- GET `/api/vocabulary/user` - Fetch all user's saved vocabulary
- POST `/api/vocabulary/update` - Update word status (body: {id, learned, notes})
- DELETE `/api/vocabulary/delete/:wordId` - Remove word from vocabulary

**Technical Implementation**
- Storage: MemStorage with 8 vocabulary-specific methods
- External API: dictionaryapi.dev as fallback for words not in local database
- Audio: Web Speech API (speechSynthesis) for pronunciation playback
- State management: TanStack Query for server state, React Query cache invalidation
- Type safety: Zod schemas with drizzle-zod for validation
- Testing: All interactive elements include data-testid attributes

**UX Design Principles**
- Frictionless word lookup: Single click reveals full definition
- Progressive disclosure: Popup doesn't obstruct content
- Instant feedback: Toast notifications for save/delete actions
- Status visualization: Color-coded badges for learning progress
- Accessibility: Keyboard-friendly, screen-reader compatible

**Recent Updates (October 2025)**
- Implemented ClickableText component with word popup and dictionary integration
- Created Vocabulary page with filtering and CRUD operations
- Integrated vocabulary system into LongContentPlayer for seamless learning
- Added 60+ pre-seeded English words across 5 difficulty levels
- Maintained strict NO-EMOJI policy (lucide-react icons only)