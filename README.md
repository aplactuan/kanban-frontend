# Kanban Frontend

<p align="center">
  <img src="./src/assets/hero.png" alt="Kanban Frontend hero" width="220" />
</p>

<p align="center">
  A clean and modern Kanban board frontend built with Vue 3, TypeScript, Vite, Pinia, Tailwind CSS, and Element Plus.
</p>

<p align="center">
  <a href="#features">Features</a> |
  <a href="#tech-stack">Tech Stack</a> |
  <a href="#quick-start">Quick Start</a> |
  <a href="#project-structure">Project Structure</a>
</p>

## Overview

This project is a task management interface designed around a familiar Kanban workflow: create boards, organize them into columns, add tasks, and move work forward with drag-and-drop interactions.

It includes authentication, protected routes, CRUD flows, and a UI that feels polished without becoming heavy. The codebase is organized to stay approachable and easy to extend, which makes it a strong foundation for a personal product, portfolio project, or larger full-stack Kanban application.

## Features

- User authentication with register, login, logout, and current-user session restore
- Protected board routes with guest-only auth pages
- Board management for creating, editing, listing, and deleting boards
- Column management inside each board
- Task management inside each column
- Drag-and-drop task movement across columns with persisted ordering
- Responsive board layout with reusable modal-based forms
- Centralized state management with Pinia stores
- API modules separated from UI components for cleaner maintenance

## Interface Highlights

- Dashboard-style board listing for quick navigation
- Dedicated board view with horizontally scrollable columns
- Inline add actions for columns and tasks
- Confirmation flows for destructive actions
- Loading and error states across major views

## Tech Stack

- Vue 3 with `<script setup>`
- TypeScript
- Vite
- Pinia
- Vue Router
- Tailwind CSS v4
- Element Plus
- Axios
- `vuedraggable`

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## API Configuration

The frontend currently points to this API base URL:

```ts
http://kanban-api.test
```

That value is defined in [src/api/client.ts](./src/api/client.ts). If your backend runs on another host, update the `baseURL` before starting the app.

This repository also includes a Postman collection:

- `Kanban-API.postman_collection.json`

That is useful for testing or documenting the expected backend endpoints alongside the frontend.

## Project Structure

```text
src/
|- api/          # Axios client and API request modules
|- assets/       # Static visuals
|- components/   # Reusable UI pieces for boards, columns, tasks, and layout
|- router/       # Route definitions and auth guards
|- stores/       # Pinia stores for auth, boards, columns, and tasks
|- types/        # Shared TypeScript interfaces
|- views/        # Route-level pages
|- App.vue       # App shell
|- main.ts       # App bootstrap
```

## Application Flow

1. Users sign up or log in.
2. Auth state is stored locally with a bearer token.
3. Protected routes load the user's boards.
4. Opening a board fetches its columns and tasks.
5. Tasks can be created, updated, deleted, and moved between columns.

## Why This Repo Stands Out

- Strong separation between UI, state, and API concerns
- Typed data models across the application
- Clear feature boundaries by domain: auth, boards, columns, tasks
- Polished component-driven interface using a practical design system
- Easy to demo, extend, and connect to a backend service

## Scripts

- `npm run dev` starts the Vite development server
- `npm run build` runs type-checking and creates a production build
- `npm run preview` serves the production build locally

## Future Improvements

- Environment-variable based API configuration
- Board and column reordering
- Richer task metadata such as labels, priorities, or due dates
- Search and filtering
- Test coverage for stores, routes, and critical UI flows

## Notes

- The frontend expects a compatible backend API to be available.
- Authentication is token-based and stored in `localStorage`.
- The current repository focuses on the frontend application layer.

## License

This project is available for learning, experimentation, and further customization. Add a dedicated license file if you plan to distribute it publicly.
