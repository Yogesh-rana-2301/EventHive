# Contributing to EventHive

First off, thank you for considering contributing to EventHive! It's people like you that make EventHive such a great tool for event management.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by the [EventHive Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [INSERT EMAIL].

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git
- A Supabase account (for database)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/EventHive.git
   cd EventHive
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/EventHive.git
   ```

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** explaining why this enhancement would be useful
- **Possible implementation** (optional)

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Issues that need attention

### Pull Requests

1. Follow the [Development Setup](#development-setup)
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test your changes thoroughly
5. Commit with clear messages: `git commit -m "Add feature: description"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request

## Development Setup

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# JWT Secrets
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### 3. Set Up Database

Follow the [Supabase Setup Guide](Docs/SUPABASE_SETUP.md) to configure your database.

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app running.

### 5. Run Tests

```bash
npm test
```

## Pull Request Process

1. **Update Documentation**: If you've added features, update the relevant documentation in the `/Docs` folder
2. **Follow Style Guidelines**: Ensure your code follows our coding standards
3. **Test Thoroughly**: Test your changes on different browsers and screen sizes
4. **Update CHANGELOG**: Add your changes to `CHANGELOG.md` under "Unreleased"
5. **Link Issues**: Reference any related issues in your PR description
6. **Request Review**: Tag relevant maintainers for review

### PR Title Format

Use conventional commit format:
- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update documentation`
- `style: Format code`
- `refactor: Refactor module`
- `test: Add tests`
- `chore: Update dependencies`

## Style Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Run `npm run format` before committing
- **Linting**: Ensure `npm run lint` passes
- **Components**: Use functional components with hooks
- **File naming**: Use kebab-case for files, PascalCase for components

### Git Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests after the first line

Example:
```
feat: Add event creation form validation

- Add Zod schema for form validation
- Implement error handling for API calls
- Update UI to show validation errors

Closes #123
```

### TypeScript Guidelines

```typescript
// Use explicit types
interface EventProps {
  id: string;
  title: string;
  date: Date;
}

// Use functional components
export function EventCard({ id, title, date }: EventProps) {
  // Component logic
}

// Prefer named exports
export { EventCard };
```

### Component Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── forms/        # Form components
│   └── layout/       # Layout components
├── lib/              # Utilities and helpers
├── stores/           # State management
└── types/            # TypeScript types
```

## Documentation

When adding new features:

1. Update relevant documentation in `/Docs`
2. Add JSDoc comments to functions
3. Update README.md if needed
4. Include examples in your PR description

## Community

- **Questions?** Open a GitHub Discussion
- **Chat**: Join our Discord (if available)
- **Twitter**: Follow us @EventHive (if available)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (if applicable)

Thank you for contributing to EventHive! 🎉