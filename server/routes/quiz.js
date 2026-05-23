const express = require('express');
const questions = require('../questions');

const router = express.Router();

// In-memory session store
const sessions = {};

// POST /api/start — Create a new quiz session
router.post('/start', (req, res) => {
  const { v4: uuidv4 } = require('uuid');
  const sessionId = uuidv4();
  sessions[sessionId] = {
    answers: {},
    startedAt: Date.now()
  };
  res.json({
    sessionId,
    total: questions.length
  });
});

// GET /api/questions/:id — Get a single question (NO correct answer sent)
router.get('/questions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const q = questions.find(q => q.id === id);

  if (!q) {
    return res.status(404).json({ error: 'Question not found' });
  }

  // Strip out correctIndex and explanation — never send to client
  res.json({
    id: q.id,
    question: q.question,
    options: q.options,
    category: q.category,
    questionNumber: q.id,
    total: questions.length
  });
});

// POST /api/submit — Validate a single answer
router.post('/submit', (req, res) => {
  const { questionId, selectedOption, sessionId } = req.body;

  if (selectedOption === undefined || questionId === undefined) {
    return res.status(400).json({ error: 'questionId and selectedOption are required' });
  }

  const q = questions.find(q => q.id === questionId);
  if (!q) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const correct = selectedOption === q.correctIndex;

  // Store the answer in session
  if (sessionId && sessions[sessionId]) {
    sessions[sessionId].answers[questionId] = {
      selectedOption,
      correct
    };
  }

  res.json({
    correct,
    correctIndex: q.correctIndex,
    explanation: q.explanation
  });
});

// POST /api/finish — Get final results
router.post('/finish', (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId || !sessions[sessionId]) {
    return res.status(400).json({ error: 'Invalid session' });
  }

  const session = sessions[sessionId];
  const results = questions.map(q => {
    const answer = session.answers[q.id];
    return {
      id: q.id,
      question: q.question,
      category: q.category,
      options: q.options,
      yourAnswer: answer ? answer.selectedOption : null,
      correctIndex: q.correctIndex,
      correct: answer ? answer.correct : false,
      explanation: q.explanation
    };
  });

  const score = results.filter(r => r.correct).length;
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  let grade;
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B+';
  else if (percentage >= 60) grade = 'B';
  else if (percentage >= 50) grade = 'C';
  else grade = 'F';

  // Clean up session
  delete sessions[sessionId];

  res.json({ score, total, percentage, grade, results });
});

module.exports = router;
