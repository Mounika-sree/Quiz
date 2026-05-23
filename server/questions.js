// In-memory question bank — correctIndex is NEVER sent to the client
const questions = [
  {
    id: 1,
    category: "Web Development",
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "HyperText Machine Language",
      "Hyperlink and Text Markup Language",
      "High-level Text Management Language"
    ],
    correctIndex: 0,
    explanation: "HTML stands for HyperText Markup Language — the standard language for creating web pages."
  },
  {
    id: 2,
    category: "JavaScript",
    question: "Which keyword is used to declare a block-scoped variable in modern JavaScript?",
    options: ["var", "let", "def", "dim"],
    correctIndex: 1,
    explanation: "'let' declares a block-scoped variable introduced in ES6. 'var' is function-scoped and is considered legacy."
  },
  {
    id: 3,
    category: "Computer Science",
    question: "What data structure operates on a Last-In, First-Out (LIFO) principle?",
    options: ["Queue", "Linked List", "Stack", "Heap"],
    correctIndex: 2,
    explanation: "A Stack follows LIFO — the last element pushed is the first one popped, like a stack of plates."
  },
  {
    id: 4,
    category: "Web Development",
    question: "Which CSS property is used to change the text color of an element?",
    options: ["font-color", "text-color", "color", "foreground"],
    correctIndex: 2,
    explanation: "The 'color' property in CSS sets the foreground/text color of an element."
  },
  {
    id: 5,
    category: "JavaScript",
    question: "What will `typeof null` return in JavaScript?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    correctIndex: 2,
    explanation: "This is a well-known JavaScript bug — 'typeof null' returns 'object', even though null is not an object."
  },
  {
    id: 6,
    category: "Computer Science",
    question: "What is the time complexity of binary search on a sorted array?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    correctIndex: 2,
    explanation: "Binary search halves the search space each step, giving O(log n) time complexity."
  },
  {
    id: 7,
    category: "Web Development",
    question: "Which HTTP method is conventionally used to update an existing resource?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctIndex: 2,
    explanation: "PUT is used to update/replace an existing resource. PATCH is used for partial updates."
  },
  {
    id: 8,
    category: "JavaScript",
    question: "Which method converts a JSON string into a JavaScript object?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.decode()", "JSON.convert()"],
    correctIndex: 1,
    explanation: "JSON.parse() parses a JSON string and returns a JavaScript object. JSON.stringify() does the reverse."
  },
  {
    id: 9,
    category: "Computer Science",
    question: "In networking, what does DNS stand for?",
    options: [
      "Dynamic Network System",
      "Data Name Server",
      "Domain Name System",
      "Distributed Node Service"
    ],
    correctIndex: 2,
    explanation: "DNS (Domain Name System) translates human-readable domain names (like google.com) to IP addresses."
  },
  {
    id: 10,
    category: "Web Development",
    question: "Which HTML tag is used to link an external CSS stylesheet?",
    options: ["<style>", "<css>", "<script>", "<link>"],
    correctIndex: 3,
    explanation: "The <link> tag with rel='stylesheet' is used in the <head> section to link an external CSS file."
  }
];

module.exports = questions;
