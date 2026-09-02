# 🚀 Node.js + Express + TypeScript Backend Setup

Beginner-friendly setup for creating a backend project using:

* Node.js
* Express.js
* TypeScript
* tsx
* dotenv
* CORS

---

## 1. Create Project Folder

```bash
mkdir my-backend
cd my-backend
```

---

## 2. Initialize Node.js Project

```bash
npm init -y
```

This creates:

```text
package.json
```

---

## 3. Install TypeScript

```bash
npm install -D typescript
```

---

## 4. Install Node.js Type Definitions

```bash
npm install -D @types/node
```

---

## 5. Install Express

```bash
npm install express
```

---

## 6. Install Express Type Definitions

```bash
npm install -D @types/express
```

---

## 7. Install tsx

`tsx` allows us to run TypeScript files directly during development.

```bash
npm install -D tsx
```

---

## 8. Install dotenv

For environment variables such as:

```env
PORT=5000
MONGO_URI=your_database_url
```

Install:

```bash
npm install dotenv
```

---

## 9. Install CORS

```bash
npm install cors
```

And its TypeScript types:

```bash
npm install -D @types/cors
```

---

# 10. Create TypeScript Configuration

Run:

```bash
npx tsc --init
```

This creates:

```text
tsconfig.json
```

Basic `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

---

# 11. Create Folder Structure

Create:

```text
my-backend/
│
├── src/
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

# 12. Create `src/app.ts`

```ts
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API is working",
  });
});

export default app;
```

---

# 13. Create `src/server.ts`

```ts
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

> If you are using `module: "NodeNext"`, keep `.js` in the import path even though the source file is `server.ts` / `app.ts`. TypeScript resolves it correctly after compilation.

---

# 14. Create `.env`

```env
PORT=5000
```

---

# 15. Create `.gitignore`

```gitignore
node_modules/
dist/
.env
```

Never commit your `.env` file to GitHub.

---

# 16. Update `package.json`

Add these scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

Your important scripts are:

### Development

```bash
npm run dev
```

### Build TypeScript

```bash
npm run build
```

### Production

```bash
npm start
```

---

# 17. Run Development Server

```bash
npm run dev
```

You should see:

```text
Server running on port 5000
```

Open:

```text
http://localhost:5000
```

Response:

```json
{
  "message": "API is working"
}
```

---

# 18. Build Project

Before production:

```bash
npm run build
```

This creates:

```text
dist/
```

Example:

```text
dist/
├── app.js
└── server.js
```

---

# 19. Run Production Build

```bash
npm start
```

---

# 📁 Final Structure

```text
my-backend/
│
├── src/
│   ├── app.ts
│   └── server.ts
│
├── dist/
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

# 🧠 Understand the Flow

```text
              Client
                │
                ▼
          server.ts
                │
                ▼
             app.ts
                │
       ┌────────┴────────┐
       │                 │
     CORS          express.json()
       │                 │
       └────────┬────────┘
                │
                ▼
             Routes
                │
                ▼
           Controllers
                │
                ▼
            Services
                │
                ▼
            Database
```

For now, don't worry about Controllers, Services and Database.

First understand:

```text
server.ts
    ↓
app.ts
    ↓
Route
    ↓
Response
```

---

# 📚 What to Learn Next

After this basic setup, learn TypeScript in this order:

### Level 1 — TypeScript Basics

* Variables & Types
* String / Number / Boolean
* Arrays
* Objects
* Functions
* Function Return Types
* Optional Properties
* Union Types
* Type Aliases
* Interfaces

### Level 2 — Important TypeScript

* `any`
* `unknown`
* `never`
* `void`
* Enums
* Type Assertions
* Generics
* Utility Types
* Optional Chaining
* Nullish Coalescing

### Level 3 — Node.js + TypeScript

* Express with TypeScript
* Request / Response types
* Custom types
* Middleware types
* Error handling
* Environment variables
* Async/Await
* Promise types

### Level 4 — Backend Architecture

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
Database
```

Then learn:

* MongoDB + Mongoose + TypeScript
* PostgreSQL + Prisma + TypeScript
* Authentication
* JWT
* Refresh Token
* RBAC
* Validation with Zod
* Error Handling
* Security
* Testing
* Docker
* Deployment

---

# 🎯 Beginner Goal

Don't try to learn everything at once.

First make this work:

```text
Node.js
   +
Express
   +
TypeScript
   ↓
GET /api/hello
   ↓
JSON Response
```

Then gradually add:

```text
Routes
 ↓
Controllers
 ↓
Services
 ↓
Database
 ↓
Authentication
 ↓
Validation
 ↓
Security
 ↓
Testing
```

**Build → Practice → Make mistakes → Fix → Repeat 🚀**
