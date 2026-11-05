const Bookmark = require('../models/Bookmark');
const Snippet = require('../models/Snippet');
const mongoose = require('mongoose');

// @desc    Add bookmark for a snippet
// @route   POST /api/snippets/:id/bookmark
// @access  Private
const addBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    const snippet = await Snippet.findById(id);
    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    // Check if private and not owner
    if (
      snippet.visibility === 'private' &&
      snippet.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Cannot bookmark a private snippet of another user'
      });
    }

    // Upsert bookmark
    let bookmark = await Bookmark.findOne({
      userId: req.user._id,
      snippetId: snippet._id
    });

    if (!bookmark) {
      bookmark = await Bookmark.create({
        userId: req.user._id,
        snippetId: snippet._id
      });
    }

    return res.status(200).json({
      success: true,
      isBookmarked: true,
      message: 'Snippet bookmarked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove bookmark for a snippet
// @route   DELETE /api/snippets/:id/bookmark
// @access  Private
const removeBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    await Bookmark.findOneAndDelete({
      userId: req.user._id,
      snippetId: id
    });

    return res.json({
      success: true,
      isBookmarked: false,
      message: 'Bookmark removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookmarked snippets for logged-in user
// @route   GET /api/bookmarks
// @access  Private
const getUserBookmarks = async (req, res, next) => {
  try {
    const { search, language, page = 1, limit = 12 } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    // Find all bookmarks for this user
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .populate({
        path: 'snippetId',
        populate: {
          path: 'userId',
          select: 'username avatar'
        }
      })
      .sort({ createdAt: -1 });

    // Filter out deleted snippets or private snippets where user is not owner
    let validBookmarks = bookmarks
      .filter((b) => b.snippetId != null)
      .filter((b) => {
        const s = b.snippetId;
        if (s.visibility === 'private') {
          return s.userId && s.userId._id.toString() === req.user._id.toString();
        }
        return true;
      });

    // Apply in-memory search and language filtering if provided
    if (language && language !== 'all') {
      validBookmarks = validBookmarks.filter(
        (b) => b.snippetId.language.toLowerCase() === language.toLowerCase()
      );
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      validBookmarks = validBookmarks.filter((b) => {
        const s = b.snippetId;
        return (
          (s.title && s.title.toLowerCase().includes(q)) ||
          (s.description && s.description.toLowerCase().includes(q)) ||
          (s.tags && s.tags.some((t) => t.toLowerCase().includes(q)))
        );
      });
    }

    const total = validBookmarks.length;
    const paginated = validBookmarks.slice(skip, skip + limitNum);

    const snippets = paginated.map((b) => {
      const s = b.snippetId;
      return {
        _id: s._id,
        title: s.title,
        description: s.description,
        code: s.code,
        language: s.language,
        tags: s.tags,
        visibility: s.visibility,
        userId: s.userId,
        likesCount: (s.likes || []).length,
        isLiked: (s.likes || []).some((uid) => uid.toString() === req.user._id.toString()),
        isBookmarked: true,
        bookmarkedAt: b.createdAt,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt
      };
    });

    return res.json({
      success: true,
      count: snippets.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      snippets
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getUserBookmarks
};

