# Language Learning Web App Design Guidelines

## Design Approach: Reference-Based (Duolingo + Notion Hybrid)

**Primary References:** Duolingo's gamification + Notion's clean organization + Linear's typography
**Rationale:** Language learning demands both engagement (gamification) and clarity (information hierarchy). The app must feel playful yet professional, motivating daily use while maintaining educational credibility.

---

## Color System

### Dark Mode (Primary)
- **Background:** 220 20% 12% (deep blue-gray)
- **Surface:** 220 18% 16% (elevated cards)
- **Primary Brand:** 142 76% 36% (vibrant green - success/progress)
- **Accent:** 267 84% 65% (purple - premium features)
- **Success States:** 142 76% 36% (correct answers)
- **Error States:** 0 72% 51% (corrections needed)
- **Text Primary:** 220 20% 95%
- **Text Secondary:** 220 15% 70%

### Light Mode
- **Background:** 220 20% 98%
- **Surface:** 0 0% 100%
- **Primary Brand:** 142 71% 45%
- **Keep accent and state colors consistent**

### Semantic Colors
- **Speaking Mode:** 204 94% 55% (bright blue)
- **Reading Mode:** 267 84% 65% (purple)
- **Listening Mode:** 25 95% 53% (orange)
- **Writing Mode:** 142 76% 36% (green)

---

## Typography

**Primary Font:** 'Inter' (Google Fonts) - Clean, multilingual support
**Display Font:** 'Lexend' (Google Fonts) - High readability for learning content

### Scale
- **Hero/Page Titles:** text-4xl md:text-5xl font-bold (Lexend)
- **Section Headers:** text-2xl md:text-3xl font-semibold (Lexend)
- **Card Titles:** text-xl font-semibold (Inter)
- **Body Text:** text-base leading-relaxed (Inter)
- **Learning Content:** text-lg leading-loose (Inter) - larger for readability
- **Captions/Meta:** text-sm text-secondary (Inter)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24
- **Component Padding:** p-6 md:p-8
- **Section Spacing:** space-y-8 md:space-y-12
- **Card Gaps:** gap-6 md:gap-8
- **Container Max Width:** max-w-7xl

**Grid Systems:**
- **Language Selection:** grid-cols-2 md:grid-cols-5 (10 languages)
- **Skill Cards:** grid-cols-2 lg:grid-cols-4 (Speaking/Reading/Listening/Writing)
- **Progress Dashboard:** Two-column layout (main content + sidebar stats)

---

## Core Components

### Navigation
- **Persistent Sidebar (Desktop):** Fixed left sidebar with language selector, level indicator, streak counter, navigation to Speaking/Reading/Listening/Writing sections
- **Mobile:** Bottom navigation bar with 5 icons (Home, Practice, Review, Dictionary, Profile)
- **Language Switcher:** Dropdown with flag icons in top-right

### Learning Cards
- **Surface:** Rounded-2xl with subtle shadow, hover:scale-105 transition
- **Content Structure:** Icon (skill-colored) → Title → Progress bar → CTA button
- **Time Indicators:** Display "30 min" for Speaking, "10 min" for others

### Progress Visualization
- **Level Progress Bar:** Full-width gradient bar showing current level (1-10)
- **Daily Streak:** Flame icon with number, prominently displayed
- **Points Display:** Coin icon with animated counter
- **Skill Rings:** Circular progress indicators for each skill (Speaking 50%, etc.)

### Speaking Interface
- **Waveform Visualization:** Animated bars showing voice input levels
- **Pronunciation Score:** Large circular progress (0-100%) with color gradient (red → yellow → green)
- **Recording Controls:** Large circular record button (red when active), playback controls below
- **Key Sentences:** Cards with speaker icon, text in large font, and "Record" CTA

### Reading Interface
- **Content Area:** max-w-3xl centered, text-lg leading-loose
- **Interactive Words:** Underlined on hover, click opens inline dictionary tooltip
- **Vocabulary Sidebar:** Sticky sidebar showing saved words with translations
- **AI Translation Toggle:** Floating button (bottom-right) to show/hide translation

### Listening Interface
- **Audio Player:** Custom-styled with large play/pause, waveform progress bar
- **Sentence Cards:** Each sentence in individual card with repeat icon button
- **Speed Controls:** 0.75x, 1x, 1.25x, 1.5x buttons
- **Transcript Display:** Scrollable text with highlighting for current sentence

### Writing Interface
- **Prompt Card:** Top section with exercise instruction and example
- **Text Area:** Large, comfortable textarea with character count
- **AI Feedback Panel:** Side-by-side correction display with highlighted differences
- **Suggestion Tags:** Clickable grammar/vocabulary suggestions below

### Gamification Elements
- **Achievement Badges:** Grid of unlockable icons (bronze/silver/gold)
- **Level-Up Modal:** Full-screen celebration with confetti animation (use canvas)
- **Daily Rewards:** Calendar grid showing completed days (green checkmarks)
- **Leaderboard (Future):** Minimal integration, not primary focus

### Review System
- **Yesterday's Review (10 min):** Mandatory carousel on app start
- **Flashcard UI:** Flip animation, swipe gestures (next/previous)
- **Review Dashboard:** List of completed lessons with "Practice Again" CTAs

### Dictionary & Vocabulary
- **Search Bar:** Prominent with language-specific keyboard support
- **Word Cards:** Definition, pronunciation (audio icon), example sentence
- **Saved Words:** Organized by date added, filterable by skill type
- **Study Mode:** Flashcard interface for saved vocabulary

### Memo Feature
- **Floating Action Button:** Fixed bottom-right, opens note-taking drawer
- **Quick Notes:** Tagged by lesson date/skill type
- **Markdown Support:** Simple formatting for organized notes

---

## Images

### Hero Section (Dashboard/Home)
**Primary Hero Image:** Diverse group of people using devices for language learning, warm and inviting atmosphere
- **Placement:** Full-width hero (h-[400px] md:h-[500px]) with gradient overlay
- **Treatment:** Subtle blur on edges, overlay: from-primary/90 to-transparent

### Skill Section Icons
**Speaking:** Microphone/sound waves illustration
**Reading:** Book/newspaper with highlighted text
**Listening:** Headphones with audio visualization
**Writing:** Pen/pencil with paper

### Situation Practice Scenarios
**Contextual Images for Each Scenario:**
- Airport: Modern terminal with travelers
- Bank: Professional banking environment
- School: Classroom or library setting
- Restaurant: Dining scene with people conversing
- Cinema: Movie theater lobby

**Treatment:** Rounded corners (rounded-xl), used as card backgrounds with text overlays

---

## Interaction Patterns

### Microinteractions
- **Button Clicks:** Scale down (scale-95) with haptic feedback feel
- **Correct Answer:** Green pulse animation, success sound (via Web Audio)
- **Wrong Answer:** Red shake animation, gentle error sound
- **Points Earned:** Floating +10, +20 numbers with fade-out
- **Level Progress:** Smooth bar fill with easing (duration-500)

### Loading States
- **Content Loading:** Skeleton screens matching component structure
- **AI Processing:** Pulsing dots with "Analyzing..." text
- **Audio Loading:** Spinning audio wave icon

### Responsive Behavior
- **Desktop (lg+):** Sidebar navigation, two-column layouts, expanded content
- **Tablet (md):** Simplified navigation, single column with wide cards
- **Mobile:** Bottom nav, stacked content, gesture-based interactions

---

## Accessibility & Localization

- **RTL Support:** Ready for all 10 languages (Arabic future consideration)
- **Font Loading:** Include Google Fonts subsets for each language (CJK, Devanagari, etc.)
- **Color Contrast:** All text meets WCAA AA standards (4.5:1 minimum)
- **Keyboard Navigation:** Full support, visible focus states (ring-2 ring-primary)
- **Screen Reader:** Proper ARIA labels for all interactive elements
- **Audio Indicators:** Visual feedback for all audio cues (for accessibility)

---

## Animation Philosophy

**Minimal & Purposeful:**
- Use animations only for feedback (success/error states)
- Progress visualizations (bars, circles)
- Level-up celebrations (confetti via canvas)
- NO gratuitous scroll animations or parallax effects
- Respect prefers-reduced-motion