const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to db.json file
const dbPath = path.join(__dirname, '../data/db.json');

// Function to read feedback from db.json
function readFeedbackFromDB() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data).feedback;
  } catch (error) {
    console.error('Error reading feedback:', error);
    return [];
  }
}

// Function to write feedback to db.json
function writeFeedbackToDB(feedbackArray) {
  try {
    const data = { feedback: feedbackArray };
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing feedback:', error);
  }
}

// POST - Add new feedback
router.post('/', (req, res) => {
  const feedbacks = readFeedbackFromDB();
  feedbacks.push(req.body);
  writeFeedbackToDB(feedbacks);
  res.send({ success: true });
});

// GET - Retrieve all feedback
router.get('/', (req, res) => {
  const feedbacks = readFeedbackFromDB();
  res.send(feedbacks);
});

module.exports = router;
