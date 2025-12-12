# Inbox Tasks - Frontend Application

A simple React SPA for managing tasks, built with React, TypeScript, and Vite. This application connects to an AWS serverless backend (API Gateway + Lambda + DynamoDB).

## Features

- Create new tasks with title and content
- View all tasks in a list sorted by creation date
- Edit existing tasks
- Delete tasks with confirmation
- Responsive design with modern UI
- Error handling and loading states

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with gradient backgrounds

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Deployed AWS backend (API Gateway URL)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**

   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your API Gateway URL:
   ```
   VITE_API_URL=https://your-api-id.execute-api.region.amazonaws.com/prod
   ```

   You can get this URL after deploying the CDK stack in the `integration` directory.

3. **Run Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   ```

   The built files will be in the `dist` directory.

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── TaskForm.tsx    # Form for creating/editing tasks
│   ├── TaskForm.css
│   ├── TaskList.tsx    # List of tasks with actions
│   └── TaskList.css
├── services/           # API service layer
│   └── taskService.ts  # HTTP client for tasks API
├── types/              # TypeScript type definitions
│   └── task.ts         # Task model interfaces
├── App.tsx             # Main application component
├── App.css             # Application styles
└── main.tsx            # Application entry point
```

## API Integration

The application connects to the following endpoints:

- `GET /tasks` - Fetch all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/{id}/{createdAt}` - Update a task
- `DELETE /tasks/{id}/{createdAt}` - Delete a task

**Note:** The current API implementation in `integration/lib/api-stack.ts` needs to be updated to include path parameters for PUT and DELETE operations. The frontend expects the following resource structure:

```typescript
const tasks = api.root.addResource("tasks");
const taskItem = tasks.addResource("{id}").addResource("{createdAt}");

tasks.addMethod("POST", ...);  // POST /tasks
tasks.addMethod("GET", ...);   // GET /tasks
taskItem.addMethod("PUT", ...);    // PUT /tasks/{id}/{createdAt}
taskItem.addMethod("DELETE", ...); // DELETE /tasks/{id}/{createdAt}
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
