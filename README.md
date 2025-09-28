# Rick and Morty Visualizer

A modern, responsive web application for exploring Rick and Morty characters with advanced filtering, favorites management, and multiple view modes.

## ✨ Features

- **Character Browsing**: Browse all Rick and Morty characters with pagination or infinite scroll
- **Advanced Filtering**: Filter by name, status, and sort alphabetically
- **Multiple View Modes**: Switch between grid and table views
- **Favorites System**: Save and manage your favorite characters
- **Dark/Light Theme**: Toggle between dark and light themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Bulk Actions**: Select multiple characters and add them to favorites at once

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier
- **Package Manager**: pnpm
- **Deployment**: Vercel

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:antoniojh10/rick-and-morty-visualizer.git
   cd rick-and-morty-visualizer
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development Workflow

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors automatically
pnpm format           # Format code with Prettier
pnpm format:check     # Check if code is formatted
pnpm type-check       # Run TypeScript type checking

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode

# All Checks
pnpm check-all        # Run lint + format + type-check + tests
```

### Pre-commit Hooks

This project uses Husky and lint-staged to automatically:

- Lint and fix code issues
- Format code with Prettier
- Run type checking

### Code Organization

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── characters/         # Character-specific components
│   └── layout/            # Layout components
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── services/              # API services
├── styles/                # Global styles and themes
├── types/                 # TypeScript type definitions
└── test/                  # Test utilities and setup
```

## 🧪 Testing

The project includes comprehensive test coverage:

- **Unit Tests**: Component and hook testing
- **Integration Tests**: Context and service testing
- **Test Utilities**: Custom render functions with providers

Run tests with:

```bash
pnpm test           # Run once
pnpm test:watch     # Watch mode for development
```

## 🎨 Styling

- **Tailwind CSS 4**: Utility-first CSS framework
- **CSS Variables**: Dynamic theming support
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: System preference detection with manual toggle

## 📱 Features in Detail

### Character Management

- Browse characters with pagination or infinite scroll
- Filter by name (with debounced search)
- Filter by status (Alive, Dead, Unknown)
- Sort alphabetically (A-Z, Z-A)

### View Modes

- **Grid View**: Card-based layout with character images
- **Table View**: Compact table with sortable columns

### Favorites System

- Add/remove individual characters
- Bulk add selected characters
- Persistent storage using localStorage
- Dedicated favorites page

### Responsive Design

- Mobile-optimized navigation with hamburger menu
- Adaptive layouts for different screen sizes
- Touch-friendly interactions
