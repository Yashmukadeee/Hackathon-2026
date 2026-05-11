# Smart Campus Notice Board - Full Stack Setup

This project is now a functional full-stack application with a React frontend, a Firebase-powered real-time database, and an Express backend for secure AI features.

## Architecture
- **Frontend**: React + Vite + Tailwind (Brutalism UI)
- **Backend**: Express.js (Node)
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth (Google Login)
- **AI**: Google Gemini (via Backend)

## How to Run

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Configure Environment
1.  Navigate to `smart-campus-notice-board`.
2.  Open the `.env` file and replace `YOUR_GEMINI_API_KEY_HERE` with your actual Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

### 3. Start the Backend Server
In a terminal, run:
```bash
cd smart-campus-notice-board
npm run server
```
This starts the Express server on `http://localhost:3001`.

### 4. Start the Frontend
In a **separate** terminal, run:
```bash
cd smart-campus-notice-board
npm run dev
```
This starts the Vite dev server on `http://localhost:3000`.

## Key Features

### 📢 AI-Powered Broadcasting
When a Faculty or Admin posts a notice, the backend automatically:
1.  **Summarizes** the content into a 2-sentence preview.
2.  **Classifies** the urgency (Critical, Important, Normal, Info).

### 🤖 Campus AI Assistant
The chat widget in the bottom right allows students to ask questions about current notices. It uses **RAG (Retrieval-Augmented Generation)** to fetch recent notices and provide accurate answers.

### 🛡️ Secure Design
- **API Key Protection**: The Gemini API key is stored on the server, not in the browser.
- **Role-Based Access**: Students can only view notices, while Faculty and Admins can post them (enforced via Firestore Security Rules).

## Testing
- **Student View**: By default, new users are assigned the `Student` role.
- **Admin View**: To test the posting feature, you can manually change your role in the Firestore `users` collection to `Faculty` or `DeptAdmin`.
