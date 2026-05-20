# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a frontend website for Ivana Academy's course landing pages, built with Tailwind CSS and designed to run in a DevContainer environment. The site is deployed to GitHub Pages.

## Development Environment

- Uses DevContainer for consistent development environment
- Built with Tailwind CSS for styling
- Nginx serves the static content
- Port 8080 is forwarded for local development access

## Key Commands

### Development
- `npm install` - Install dependencies
- `npm run build` - Build the project (compiles HTML/CSS/JS)
- `npm run dev` - Start development mode with watch
- `npm start` - Start local HTTP server

### Code Quality
- `npm run lint` - Run ESLint on JavaScript files
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without changes

### Testing & Validation
- `npm run check` - Run both formatting and linting checks

## Project Structure

```
.
├── .devcontainer/           # DevContainer configuration
│   ├── compose/             # Docker Compose files for different environments
│   └── nginx/               # Nginx configuration
├── .github/workflows/       # GitHub Actions workflows
├── public/                  # Source files (HTML, CSS, JS, images) AND Built output (generated)
├── src/                     # Source files (will be processed to dist/)
├── package.json             # Dependencies and npm scripts
├── tailwind.config.js       # Tailwind CSS configuration
└── eslint.config.mjs        # ESLint configuration
```

## Architecture Notes

- Uses Tailwind CSS for styling with a utility-first approach
- Static site generation with build process that outputs to `public/` directory
- Nginx serves the static files in production
- GitHub Actions handles deployment to GitHub Pages
- Environment variables are managed through .devcontainer/env/*.env files in the DevContainer

## Deployment Process

The site is automatically deployed to GitHub Pages on pushes to the main branch through GitHub Actions workflow.

## Common Development Tasks

1. Making changes to HTML/CSS/JS in the `src/` directory
2. Running `npm run build` to compile changes
3. Testing locally with `npm start`
4. Validating code quality with `npm run check`

## Additional Information

### DevContainer Configuration
The project uses a multi-file Docker Compose setup:
- `compose/dev.yml` - Development-specific services
- `compose/build-dev.yml` - Build services for development

### NPM Scripts Details
- `npm run build` - Full build process including CSS compilation, JavaScript bundling, and file copying
- `npm run dev` - Development mode with file watching and auto-rebuild
- `npm run lint:fix` - Automatically fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run watch` - Watch for file changes and rebuild automatically
- `npm run clean` - Remove the dist directory

### Environment Variables
Environment variables are managed through the DevContainer configuration and are accessible during the build process.