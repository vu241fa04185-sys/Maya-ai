# MAYA — Personal AI Life, Learning & Project Assistant

> *"Understand → Remember → Plan → Recommend → Execute with permission → Learn"*

MAYA is a context-aware personal AI agent built to help you manage your projects, tasks, studies, goals, and daily schedule.

---

## 🚀 Quick Start (V1)

### 1. Get your FREE Gemini API Key
Go to 👉 https://aistudio.google.com/app/apikey → Sign in → Create API Key

### 2. Add your API key to the server
Open `maya/server/.env` and replace the placeholder:
```
GEMINI_API_KEY=paste_your_actual_key_here
```

### 3. Start the Backend (Terminal 1)
```bash
cd maya/server
npm run dev
```
You should see the MAYA ASCII banner and `Status: Running ✓`

### 4. Start the Frontend (Terminal 2)
```bash
cd maya/client
npm install   # only needed first time
npm run dev
```

### 5. Open your browser
Navigate to: **http://localhost:5173**

---

## 📁 Project Structure

```
maya/
├── client/                  ← React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── ChatWindow.jsx
│       │   ├── MessageBubble.jsx
│       │   ├── InputBar.jsx
│       │   ├── Sidebar.jsx
│       │   └── StatusIndicator.jsx
│       ├── hooks/
│       │   └── useChat.js
│       ├── App.jsx
│       └── index.css
│
└── server/                  ← Node.js + Express backend
    ├── config/maya.js       ← MAYA system prompt & persona
    ├── services/llmService.js  ← Gemini API calls
    ├── controllers/chatController.js
    ├── routes/chat.js
    ├── middleware/errorHandler.js
    ├── .env                 ← ⚠️ Add your API key here
    └── index.js             ← Entry point
```

---

## 🔌 API Reference

### POST /api/chat
Send a message to MAYA.

**Request:**
```json
{
  "message": "What should I work on today?",
  "history": [
    { "role": "user", "content": "Hi MAYA" },
    { "role": "assistant", "content": "Hello! How can I help?" }
  ]
}
```

**Response:**
```json
{
  "reply": "Based on your goals, I recommend..."
}
```

### GET /api/chat/health
Check if the server is running.

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| `CORS error` in browser | Make sure the server is running on port 5000 |
| `Invalid API key` | Check `.env` file — key should start with `AIzaSy` |
| `Cannot connect` | Run `npm run dev` in the server folder first |
| Blank responses | Check server terminal for error messages |
| `Network Error` | Backend not running — start it first |

---

## 🗺️ Development Roadmap

| Version | Features |
|---|---|
| **V1** ✅ | Basic chat, LLM integration, beautiful UI |
| **V2** | MongoDB, user accounts, persistent conversations |
| **V3** | Tasks, projects, goals, deadlines, daily planning |
| **V4** | Agent architecture, tool/function calling |
| **V5** | Voice (speech-to-text + text-to-speech) |
| **V6** | Web search, file analysis, reminders |
| **V7** | Webcam, computer vision (FastAPI + OpenCV) |
| **V8** | Proactive planning, progress tracking, weekly reviews |
