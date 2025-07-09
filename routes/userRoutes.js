const express = require('express');
const { getUser, getUserById } = require('../controllers/userController');
const router = express.Router();

router.get('/profile/:userId',getUserById);
router.get('/profile', )

module.exports = router