# web_challenge

A simple Express.js RESTful API in TypeScript demonstrating CRUD operations with in-memory storage, along with Jest unit tests following the AAA (Arrange–Act–Assert) pattern.

## Prerequisites

- Node.js v14+ or later
- npm (Node Package Manager)

## Installation

```bash
git clone https://github.com/hyphen-333/web_challenge.git
cd web_challenge
npm install
```

## Project Structure

```
.
├── src
│   ├── app.ts           # Express app, handlers, and in-memory store
│   ├── server.ts        # Bootstraps and listens
│   └── models
│       └── Item.ts      # Item interface definition
├── tests
│   └── itemHandlers.test.ts  # Jest unit tests for CRUD handlers
├── package.json         # NPM dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── jest.config.js       # Jest configuration
└── README.md            # Project overview and instructions
```

## Scripts

Add or verify the following scripts in your `package.json`:

```json
"scripts": {
  "dev": "ts-node-dev --respawn src/server.ts",
  "build": "tsc",
  "test": "jest"
}
```

- **`npm run dev`**: Starts the development server with automatic reloads.
- **`npm run build`**: Compiles TypeScript to JavaScript in the `dist/` folder.
- **`npm test`**: Runs the Jest test suite.

## Usage

1. **Start the server**

   ```bash
   npm run dev
   ```

2. **API Endpoints**

   - **Create an item**

     ```http
     POST /items
     Content-Type: application/json

     {
       "name": "Sample Item",
       "description": "Optional description"
     }
     ```

     - **Success**: `201 Created` with created item JSON
     - **Error**: `400 Bad Request` if `name` is missing

   - **Get all items**

     ```http
     GET /items
     ```

     - **Success**: `200 OK` with array of items

   - **Update an item**

     ```http
     PUT /items/:id
     Content-Type: application/json

     {
       "name": "Updated Name",
       "description": "Updated description"
     }
     ```

     - **Success**: `200 OK` with updated item JSON
     - **Error**: `404 Not Found` if item ID does not exist

   - **Delete an item**

     ```http
     DELETE /items/:id
     ```

     - **Success**: `204 No Content`
     - **Error**: `404 Not Found` if item ID does not exist

## Running Tests

```bash
npm test
```

The Jest test suite covers all CRUD handlers and ensures the in-memory store is reset before each test.
