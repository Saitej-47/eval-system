const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  res.send({
    averageRating: 4.3,
    totalResponses: 231,
    activeForms: 8,
    responseRate: "78%"
  });
});
module.exports = router;
