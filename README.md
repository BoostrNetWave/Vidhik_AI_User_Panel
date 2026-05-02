# Vidhik AI - User Admin Panel

This directory contains the full-stack application for the **User Admin Panel** of Vidhik AI. It has been configured and optimized for a seamless local development experience and is completely production-ready.

## Architecture

The application uses a unified full-stack architecture running as a monolithic Node.js application in production, while retaining a split dev environment for optimal developer experience:
- **Frontend**: React 18, Vite, Tailwind CSS, Radix UI, React Router.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **AI Processing**: Integration with Google Gemini and OpenAI for legal document analysis.

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.x or v20.x recommended
- **npm**: v9.x or higher
- **MongoDB**: A local MongoDB instance or a MongoDB Atlas connection string.

## Dependencies

### Core Backend Dependencies
- `express` (Web server framework)
- `mongoose` (MongoDB object modeling)
- `cors`, `helmet`, `morgan` (Security and logging)
- `cookie-parser` (Cookie parsing middleware)
- `multer`, `pdf-parse`, `mammoth` (File upload and document text extraction)
- `@google/generative-ai`, `openai` (AI Integration)

### Core Frontend Dependencies
- `react`, `react-dom`, `react-router-dom` (Core UI and Routing)
- `tailwindcss`, `clsx`, `tailwind-merge` (Styling utilities)
- `@radix-ui/*`, `lucide-react` (Accessible components and icons)
- `axios` (API requests)
- `react-hook-form`, `zod` (Form handling and validation)
- `recharts` (Data visualization)

---

## 🛠️ Local Development Setup

To run this project locally, follow these steps in your terminal:

**1. Navigate to the project directory:**
```bash
cd d:/BooterNetWave/VidhikAI/user-admin2
```

**2. Install all dependencies:**
```bash
npm install
```

**3. Configure Environment Variables:**
Create a `.env` file in the root of `user-admin2` by copying the example file:
```bash
cp .env.example .env
```
Ensure you fill in your environment variables inside `.env`:
- `PORT` (e.g., 5003)
- `MONGO_URI` (Your MongoDB connection string)
- `OPENAI_API_KEY` (Your OpenAI API Key)
- `GEMINI_API_KEY` (Your Google Gemini API Key)

**4. Start the Development Servers:**

For local development, you need to run the frontend and backend simultaneously. Open **two** terminal windows.

**Terminal 1 (Backend Server):**
```bash
npm run server
```
*(This starts the backend on the port specified in your .env, typically 5003)*

**Terminal 2 (Frontend Client):**
```bash
npm run dev
```
*(This starts the Vite React dev server, typically on port 5175, with proxying configured to route `/api` to the backend)*

---

## 🚀 Production Build & Deployment

The application is structured to easily build both the client and server into a single artifact for production environments (like AWS, Render, Heroku, or VPS).

**1. Build the Application:**
```bash
npm run build
```
This command does two things:
1. Compiles the React frontend using Vite into `dist/client`.
2. Compiles the TypeScript backend into `dist/server`.

**2. Start the Production Server:**
```bash
npm run start
```
This will set `NODE_ENV=production` and start the server using Node.js. 
In production mode, the Express server will automatically serve the built React files from `dist/client` at the `/user` path.

## Important Notes
- **Routing**: In production, the React app is served dynamically. If you visit `/user/*`, the Express server will route the request to `index.html` allowing React Router to handle the frontend path.
- **Type Checking**: The TypeScript compiler validates typing for the backend before successfully generating the build. Frontend types are checked within the IDE but ignored during the Vite build to speed up CI/CD deployments.
