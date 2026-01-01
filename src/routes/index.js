const express = require('express');
const authRoutes = require('./authRoutes');
const articleRoutes = require('./articleRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);

module.exports = router;

