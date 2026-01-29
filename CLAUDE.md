# CLAUDE.md — AI Assistant Guide for One-Click-Publishing

## Project Overview

**Repository:** `TaeSungLee96/One-Click-Publishing-`
**Status:** Initial setup — the project is in its earliest stage of development.
**Purpose:** One-Click Publishing — a tool/application for streamlining content publishing workflows.

## Repository Structure

```
One-Click-Publishing-/
├── CLAUDE.md          # This file — AI assistant guidance
└── .git/              # Git metadata
```

> This repository is newly initialized. As the project grows, update this section to reflect the actual directory layout, tech stack, and architecture.

## Development Workflow

### Branch Strategy

- **Feature branches** should follow the pattern `claude/<description>-<session-id>` when created by AI assistants.
- Always develop on the designated feature branch; never push directly to the main branch without explicit permission.

### Git Conventions

- Write clear, descriptive commit messages focused on the "why" rather than the "what."
- Keep commits atomic — each commit should represent a single logical change.
- Use `git push -u origin <branch-name>` for pushes.

### Getting Started (for future contributors)

Once the project has source code:

1. Clone the repository.
2. Install dependencies (update this section with the actual command once a package manager is chosen).
3. Run the development server or build (update accordingly).
4. Run tests before pushing (update accordingly).

## Key Conventions

### Code Style

> To be defined once the tech stack is chosen. Update this section with:
> - Language and framework versions
> - Linter and formatter configuration (e.g., ESLint, Prettier, Black, Ruff)
> - Naming conventions (files, variables, components)

### Architecture Patterns

> To be defined. Document key patterns here as they emerge, such as:
> - Project layout (e.g., feature-based vs. layer-based)
> - State management approach
> - API design conventions
> - Error handling strategy

### Testing

> To be defined. Document:
> - Test framework and runner
> - Test file naming and location conventions
> - Coverage expectations
> - How to run tests locally

## AI Assistant Instructions

When working in this repository:

1. **Read before writing.** Always read existing files before modifying them.
2. **Keep changes minimal.** Only make changes that are directly requested or clearly necessary. Avoid over-engineering.
3. **Track tasks.** Use the TodoWrite tool to plan and track multi-step work.
4. **No security vulnerabilities.** Avoid introducing command injection, XSS, SQL injection, or other OWASP Top 10 issues.
5. **Update this file.** When making significant structural changes (new directories, new dependencies, new scripts), update CLAUDE.md to reflect the current state.
6. **Commit discipline.** Create atomic commits with descriptive messages. Never amend previous commits unless explicitly asked.
7. **Don't guess.** If something is unclear about the project's conventions or intent, note it rather than assuming.

## Build & Run Commands

> To be populated once the project has build tooling. Example format:
>
> | Command | Description |
> |---------|-------------|
> | `npm install` | Install dependencies |
> | `npm run dev` | Start development server |
> | `npm run build` | Production build |
> | `npm test` | Run test suite |
> | `npm run lint` | Run linter |

## Environment & Configuration

> To be populated. Document:
> - Required environment variables
> - Configuration files and their purpose
> - External service dependencies

## Troubleshooting

> To be populated as common issues are encountered during development.
