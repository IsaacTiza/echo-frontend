# Echo Frontend

The frontend for Echo — an AI-powered study assistant built with React, Vite and Tailwind CSS.

## Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Animations:** Framer Motion
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Routing:** React Router v7
- **Font:** Onest Variable
- **Deployment:** Vercel

## Features

- Google OAuth authentication with persistent JWT session
- Mobile-first responsive design
- Dark and light theme toggle
- Upload notes as text, PDF, DOCX, TXT or image
- AI explanation with five tone options (Simple, Detailed, ELI5, Academic, Bullets)
- Interactive flashcard flip UI
- MCQ quiz with configurable question count
- Score results with targeted AI review of failed topics
- Download original note and AI explanation
- Note history grouped by date
- Daily AI credit tracker with midnight reset indicator

## Project Structure

```
echo-frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Bottom navigation bar
│   │   ├── ProtectedRoute.jsx   # Auth guard
│   │   ├── NoteCard.jsx         # Note list item
│   │   ├── FlashCard.jsx        # Flashcard component
│   │   ├── QuizCard.jsx         # Quiz question component
│   │   └── ModeCard.jsx         # Study mode card
│   ├── pages/
│   │   ├── Landing.jsx          # Auth landing page
│   │   ├── Dashboard.jsx        # Home with notes list
│   │   ├── NoteInput.jsx        # Create new note
│   │   ├── ModeSelect.jsx       # Choose study mode
│   │   ├── ExplainView.jsx      # AI explanation view
│   │   ├── StudySession.jsx     # Flashcards and quiz
│   │   ├── Results.jsx          # Quiz results and review
│   │   ├── History.jsx          # Note history
│   │   ├── Settings.jsx         # User settings
│   │   └── Account.jsx          # Account details
│   ├── store/
│   │   ├── authStore.js         # Auth state (Zustand)
│   │   ├── noteStore.js         # Notes state (Zustand)
│   │   └── themeStore.js        # Theme state (Zustand)
│   ├── lib/
│   │   └── api.js               # Axios instance with auth interceptor
│   └── hooks/
│       ├── useAuth.js           # Auth hook
│       └── useNotes.js          # Notes hook
├── public/
│   └── favicon.svg              # Echo logo
└── index.html                   # App entry point
```

## Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Google OAuth sign in |
| Dashboard | `/dashboard` | Notes overview and stats |
| New Note | `/notes/new` | Upload or type a note |
| Mode Select | `/notes/:id/mode` | Choose Understand or Study |
| Explain | `/notes/:id/explain` | AI explanation with tone selector |
| Study | `/notes/:id/study` | Flashcards or MCQ quiz |
| Results | `/notes/:id/results` | Score and failed topic review |
| History | `/history` | All notes grouped by date |
| Settings | `/settings` | Profile and AI credits |
| Account | `/account` | Account details |

## Environment Variables

```env
VITE_API_URL=your_backend_api_url
VITE_BACKEND_URL=your_backend_url
```

## Getting Started

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build
```

## Design System

| Token | Light | Dark |
|-------|-------|------|
| Background | `#FFFFFF` | `#1C1B19` |
| Card | `#FFFFFF` | `#2C2B28` |
| Muted | `#F5F5F4` | `#3C3B38` |
| Foreground | `#1C1B19` | `#FFFFFF` |
| Primary | `#F95E08` | `#F95E08` |
| Muted Foreground | `#78716C` | `#A8A29E` |

## Authentication Flow

1. User clicks Continue with Google
2. Redirected to Google OAuth
3. Backend issues JWT and redirects to `/dashboard?token=...`
4. Frontend captures token from URL and stores in localStorage
5. All API requests send token as `Authorization: Bearer <token>`
6. Token persists across sessions until user signs out

## Live Demo

[https://echo-frontend-silk.vercel.app](https://echo-frontend-silk.vercel.app)
