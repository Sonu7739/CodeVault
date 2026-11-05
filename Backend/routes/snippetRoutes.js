const express = require('express');
const router = express.Router();
const {
  createSnippet,
  getMySnippets,
  getExploreSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  toggleLikeSnippet
} = require('../controllers/snippetController');
const {
  addBookmark,
  removeBookmark
} = require('../controllers/bookmarkController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Base routes
router.post('/', protect, createSnippet);
router.get('/my', protect, getMySnippets);
router.get('/explore', optionalAuth, getExploreSnippets);

// Interaction sub-routes (must come before generic :id if matching paths)
router.post('/:id/like', protect, toggleLikeSnippet);
router.post('/:id/bookmark', protect, addBookmark);
router.delete('/:id/bookmark', protect, removeBookmark);

// Dynamic snippet routes
router.get('/:id', optionalAuth, getSnippetById);
router.put('/:id', protect, updateSnippet);
router.delete('/:id', protect, deleteSnippet);

module.exports = router;

