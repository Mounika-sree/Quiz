# QuizMaster — Multiple-Choice Quiz App

A full-stack multiple-choice quiz application built with **Node.js + Express** (backend) and **Vanilla HTML/CSS/JS** (frontend).

---

## Features

- 📝 **10 curated questions** across Web Development, JavaScript & Computer Science
- ⚡ **Instant feedback** — see if you're right/wrong immediately after answering
- 🔒 **Cheat-proof** — correct answers are never sent to the browser before submission
- 📊 **Detailed results** — animated score ring, grade badge, and per-question review
- 🎨 **Premium UI** — dark glassmorphism theme with smooth animations

---

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or later

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
```

Then open **http://localhost:3000** in your browser.

---

## Project Structure

```
Quiz app/
├── server/
│   ├── index.js          ← Express server entry point
│   ├── questions.js      ← In-memory question data store
│   └── routes/
│       └── quiz.js       ← REST API route handlers
├── public/
│   ├── index.html        ← Single-page app HTML
│   ├── style.css         ← Full design system
│   └── app.js            ← Frontend state machine
├── package.json
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/start` | Create a new quiz session |
| `GET` | `/api/questions/:id` | Get a question (no correct answer) |
| `POST` | `/api/submit` | Submit & validate a single answer |
| `POST` | `/api/finish` | Get final score & full results |

---

## How It Works

1. **Start** — The frontend calls `POST /api/start` to get a session ID
2. **Play** — Questions are fetched one at a time; correct answers stay server-side
3. **Submit** — Each answer is validated via `POST /api/submit`, which returns feedback
4. **Finish** — `POST /api/finish` returns the final score and a full review breakdown
