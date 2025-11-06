const express = require('express');
const app = express();
app.use(express.json());

const feedbackRoutes = require('./routes/feedback');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(3001, () => console.log('Backend running on port 3001'));
