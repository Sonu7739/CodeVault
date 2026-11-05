const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateUserProfile);
router.get('/:username', optionalAuth, getUserProfile);

module.exports = router;

