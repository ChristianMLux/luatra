# Luatra Monorepo

Project Luatra is a comprehensive ecosystem of AI Agents managed via a central Hub.
This monorepo uses [TurboRepo](https://turbo.build/repo) to manage the following applications and packages.

## 🚀 Apps

-   **Hub (`apps/hub`)** - `http://localhost:3000`
    -   The central administrative dashboard for user and project management.
-   **Finatra (`apps/finatra`)** - `http://localhost:3001`
    -   The Financial Agent interface & automated tooling generation (Chat & Visualization).
-   **Joatra (`apps/joatra`)** - `http://localhost:3002`
    -   Job Application Tracker Agents.
-   **Chronatra (`apps/chronatra`)** - `http://localhost:3003`
    -   Time Tracking & Focus Timer functionality.
-   **Agent Backend (`apps/agent-backend`)**
    -   Python FastAPI backend (the brain of the agents).

## 📦 Shared Packages

-   **`@repo/core`**: shared business logic, including:
    -   **Authentication**: Firebase + Cookie-based Shared Auth (SSO).
    -   **Firebase Config**: Centralized initialization.
-   **`@repo/ui`**: Shared Design System (Neo-Victorian Aesthetic).
    -   Includes `Button`, `Card`, `Modal`, `Badge`, etc.
    -   Shared Tailwind Preset & Global CSS.
-   **`@repo/typescript-config`**: Shared `tsconfig.json`s used throughout the monorepo.
-   **`@repo/eslint-config`**: Shared `eslint` configurations.

## 🛠️ Setup & Development

### 1. Install Dependencies
```sh
pnpm install
```

### 2. Configure Environment
Create a `.env.local` file in `apps/hub`, `apps/finatra`, `apps/joatra`, and `apps/chronatra` with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
...
NEXT_PUBLIC_API_URL=http://localhost:8000 (Optional, for backend)
```
*Note: Since they share the same Firebase project, you can use the same keys for all.*

### 3. Run Development Server
This will start all Next.js apps in parallel:
```sh
pnpm dev
```

## 🔐 Architecture Notes
-   **Shared Authentication**: The apps use a hybrid approach. `Hub` manages the primary Firebase Session. It writes a `site-auth` cookie for `localhost`, which `Finatra` and `Joatra` consume to maintain a seamless "Logged In" state across ports.
