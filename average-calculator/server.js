/**
 * Average Calculator Microservice
 * Exposes /numbers/{numberid} API for prime, fibonacci, even, random numbers
 * Maintains a window of unique numbers and calculates their average
 */

const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

// Configuration
const BASE_URL = 'http://20.244.56.144/evaluation-service';
const WINDOW_SIZE = 10;
const VALID_IDS = ['p', 'f', 'e', 'r'];
const ENDPOINTS = {
  p: '/primes',
  f: '/fibo',
  e: '/even',
  r: '/rand',
};

// State
let numberWindow = [];

// API Client

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2NjMwMjUyLCJpYXQiOjE3NDY2Mjk5NTIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImQwN2Q2NzIzLWRmZTEtNGViYy05YzFkLWY3MGJmNTJmYTVjYiIsInN1YiI6IjIwMjJpc19tb2hhbW1hZGFhbWlyX2JAbmllLmFjLmluIn0sImVtYWlsIjoiMjAyMmlzX21vaGFtbWFkYWFtaXJfYkBuaWUuYWMuaW4iLCJuYW1lIjoibW9oYW1tYWQgYWFtaXIiLCJyb2xsTm8iOiI0bmkyMmlzMTE3IiwiYWNjZXNzQ29kZSI6IkRSWXNjRSIsImNsaWVudElEIjoiZDA3ZDY3MjMtZGZlMS00ZWJjLTljMWQtZjcwYmY1MmZhNWNiIiwiY2xpZW50U2VjcmV0Ijoic3ltVlpzbldkalRwU01USiJ9.HvMtOGstijq6L3Hqw54vHdjC1_TrLZNz6IwNbPcAyKU"
  }
});


// Middleware to validate number ID
const validateNumberId = (req, res, next) => {
  const numberId = req.params.numberid;
  if (!VALID_IDS.includes(numberId)) {
    return res.status(400).json({ error: 'Invalid number ID. Use p, f, e, or r.' });
  }
  next();
};

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Average Calculator Microservice',
    endpoints: [
      {
        path: '/numbers/:numberid',
        description: 'Fetch numbers (p: prime, f: fibonacci, e: even, r: random) and calculate average',
        example: 'GET /numbers/p',
      },
    ],
  });
});

// API to fetch and calculate average
app.get('/numbers/:numberid', validateNumberId, async (req, res) => {
  const numberId = req.params.numberid;
  const endpoint = ENDPOINTS[numberId];

  try {
    // Store previous state
    const windowPrevState = [...numberWindow];

    // Fetch numbers from test server
    const response = await apiClient.get(endpoint);
    const numbers = response.data.numbers || [];

    // Filter unique numbers
    const newNumbers = numbers.filter((num) => !numberWindow.includes(num));

    // Update window
    numberWindow = [...numberWindow, ...newNumbers].slice(-WINDOW_SIZE);

    // Calculate average
    const avg = numberWindow.length
      ? (numberWindow.reduce((sum, num) => sum + num, 0) / numberWindow.length).toFixed(2)
      : 0;

    // Response
    res.json({
      windowPrevState,
      windowCurrState: numberWindow,
      numbers,
      avg: parseFloat(avg),
    });
  } catch (error) {
    // Log error for debugging
    console.error(`Error fetching ${endpoint}:`, error.message);
    // Return current state
    res.json({
      windowPrevState: numberWindow,
      windowCurrState: numberWindow,
      numbers: [],
      avg: numberWindow.length
        ? (numberWindow.reduce((sum, num) => sum + num, 0) / numberWindow.length).toFixed(2)
        : 0,
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});