const express = require('express');
const router = express.Router();
let feedbacks = [];

router.post('/', (req, res) => {
  feedbacks.push(req.body);
  res.send({ success: true });
});

router.get('/', (req, res) => {
  res.send(feedbacks);
});

module.exports = router;
