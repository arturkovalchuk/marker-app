# User Management System

A modern React application for managing user data, built with TypeScript and Vite.

## Features

- 👥 User management (add, edit, delete)
- 🏷️ Tag-based filtering
- 📊 Visit history tracking
- 🔍 Advanced search functionality
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- React 18.3
- TypeScript 5.0
- Vite 5.4
- Tailwind CSS 3.4
- React Router DOM 6.22
- ESLint & Prettier for code quality
- Husky & lint-staged for pre-commit hooks

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Marker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── @types/         # Global type definitions
├── components/     # Reusable components
├── context/        # React context providers
├── pages/         # Page components
├── utils/         # Utility functions
└── types.ts       # Common TypeScript interfaces
```

## Code Quality

The project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Husky for pre-commit hooks
- lint-staged for running checks on staged files

## Build and Deploy

To build the project for production:

```bash
npm run build
```

This will create a `dist` directory with the production build.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 