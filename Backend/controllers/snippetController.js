const Snippet = require('../models/Snippet');
const Bookmark = require('../models/Bookmark');
const mongoose = require('mongoose');

// Helper to format tags
const sanitizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .map((t) => String(t).trim().toLowerCase())
      .filter((t) => t.length > 0);
  }
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);
  }
  return [];
};

// @desc    Create a new snippet
// @route   POST /api/snippets
// @access  Private
const createSnippet = async (req, res, next) => {
  try {
    const { title, description, code, language, tags, visibility } = req.body;

    if (!title || !code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Please provide snippet title, code, and programming language'
      });
    }

    const cleanedTags = sanitizeTags(tags);

    const snippet = await Snippet.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      code,
      language,
      tags: cleanedTags,
      visibility: visibility === 'private' ? 'private' : 'public',
      userId: req.user._id
    });

    const populatedSnippet = await Snippet.findById(snippet._id).populate(
      'userId',
      'username avatar'
    );

    return res.status(201).json({
      success: true,
      message: 'Snippet created successfully',
      snippet: populatedSnippet
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all snippets belonging to the logged-in user
// @route   GET /api/snippets/my
// @access  Private
const getMySnippets = async (req, res, next) => {
  try {
    const { search, language, visibility, sort, page = 1, limit = 12 } = req.query;

    const query = { userId: req.user._id };

    if (visibility && visibility !== 'all') {
      query.visibility = visibility;
    }

    if (language && language !== 'all') {
      query.language = language;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Snippet.countDocuments(query);
    const snippets = await Snippet.find(query)
      .populate('userId', 'username avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

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

// @desc    Get all public snippets (Explore)
// @route   GET /api/snippets/explore
// @access  Public (Optional auth for like/bookmark state)
const getExploreSnippets = async (req, res, next) => {
  try {
    const { search, language, tag, sort, page = 1, limit = 12 } = req.query;

    const query = { visibility: 'public' };

    if (language && language !== 'all') {
      query.language = language;
    }

    if (tag && tag !== 'all') {
      query.tags = tag.toLowerCase().trim();
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'likes') {
      // Sorting by likes count: handled via aggregation or projected field if needed,
      // or sort by array length in pipeline, or secondary sort
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    let snippets;
    let total;

    if (sort === 'likes') {
      const aggregatePipeline = [
        { $match: query },
        {
          $addFields: {
            likesCount: { $size: { $ifNull: ['$likes', []] } }
          }
        },
        { $sort: { likesCount: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            title: 1,
            description: 1,
            code: 1,
            language: 1,
            tags: 1,
            visibility: 1,
            likes: 1,
            createdAt: 1,
            updatedAt: 1,
            userId: {
              _id: '$user._id',
              username: '$user.username',
              avatar: '$user.avatar'
            }
          }
        }
      ];

      total = await Snippet.countDocuments(query);
      snippets = await Snippet.aggregate(aggregatePipeline);
    } else {
      total = await Snippet.countDocuments(query);
      snippets = await Snippet.find(query)
        .populate('userId', 'username avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean();
    }

    // Attach user bookmark & like state if logged in
    let userBookmarks = new Set();
    if (req.user) {
      const bookmarks = await Bookmark.find({ userId: req.user._id }).select('snippetId');
      userBookmarks = new Set(bookmarks.map((b) => b.snippetId.toString()));
    }

    const enhancedSnippets = snippets.map((s) => {
      const isLiked = req.user
        ? (s.likes || []).some((id) => id.toString() === req.user._id.toString())
        : false;
      const isBookmarked = req.user ? userBookmarks.has(s._id.toString()) : false;
      return {
        ...s,
        likesCount: (s.likes || []).length,
        isLiked,
        isBookmarked
      };
    });

    return res.json({
      success: true,
      count: enhancedSnippets.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      snippets: enhancedSnippets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single snippet by ID
// @route   GET /api/snippets/:id
// @access  Public for public snippets / Private for private snippets
const getSnippetById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found (Invalid ID format)'
      });
    }

    const snippet = await Snippet.findById(id).populate(
      'userId',
      'username bio avatar createdAt'
    );

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    const isOwner =
      req.user &&
      snippet.userId &&
      snippet.userId._id.toString() === req.user._id.toString();

    // Check visibility authorization
    if (snippet.visibility === 'private' && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'This snippet is private. Only the author can access it.'
      });
    }

    const isLiked = req.user
      ? snippet.likes.some((userId) => userId.toString() === req.user._id.toString())
      : false;

    let isBookmarked = false;
    if (req.user) {
      const bookmark = await Bookmark.findOne({
        userId: req.user._id,
        snippetId: snippet._id
      });
      isBookmarked = !!bookmark;
    }

    // Fetch up to 3 related public snippets (same language or sharing tags)
    const relatedSnippets = await Snippet.find({
      _id: { $ne: snippet._id },
      visibility: 'public',
      $or: [
        { language: snippet.language },
        { tags: { $in: snippet.tags } }
      ]
    })
      .select('title language description tags createdAt userId likes')
      .populate('userId', 'username avatar')
      .limit(3)
      .lean();

    return res.json({
      success: true,
      snippet: {
        ...snippet.toObject(),
        likesCount: snippet.likes.length,
        isLiked,
        isBookmarked,
        isOwner
      },
      relatedSnippets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a snippet
// @route   PUT /api/snippets/:id
// @access  Private (Owner only)
const updateSnippet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, code, language, tags, visibility } = req.body;

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

    // Ownership check
    if (snippet.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit snippets you created'
      });
    }

    if (title !== undefined) snippet.title = title.trim();
    if (description !== undefined) snippet.description = description.trim();
    if (code !== undefined) snippet.code = code;
    if (language !== undefined) snippet.language = language;
    if (tags !== undefined) snippet.tags = sanitizeTags(tags);
    if (visibility !== undefined) {
      snippet.visibility = visibility === 'private' ? 'private' : 'public';
    }

    snippet.updatedAt = Date.now();
    await snippet.save();

    const updated = await Snippet.findById(id).populate('userId', 'username avatar');

    return res.json({
      success: true,
      message: 'Snippet updated successfully',
      snippet: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a snippet
// @route   DELETE /api/snippets/:id
// @access  Private (Owner only)
const deleteSnippet = async (req, res, next) => {
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

    // Ownership check
    if (snippet.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own snippets'
      });
    }

    // Remove associated bookmarks
    await Bookmark.deleteMany({ snippetId: snippet._id });

    // Remove snippet
    await Snippet.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: 'Snippet and associated bookmarks deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like or unlike a snippet (toggle)
// @route   POST /api/snippets/:id/like
// @access  Private
const toggleLikeSnippet = async (req, res, next) => {
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

    // If private, only owner can view or like
    if (
      snippet.visibility === 'private' &&
      snippet.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Cannot interact with private snippet'
      });
    }

    const userIdStr = req.user._id.toString();
    const existingIndex = snippet.likes.findIndex(
      (uid) => uid.toString() === userIdStr
    );

    let isLiked = false;
    if (existingIndex > -1) {
      // Already liked, so unlike
      snippet.likes.splice(existingIndex, 1);
      isLiked = false;
    } else {
      // Add like
      snippet.likes.push(req.user._id);
      isLiked = true;
    }

    await snippet.save();

    return res.json({
      success: true,
      isLiked,
      likesCount: snippet.likes.length,
      message: isLiked ? 'Snippet liked' : 'Snippet unliked'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSnippet,
  getMySnippets,
  getExploreSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  toggleLikeSnippet
};

