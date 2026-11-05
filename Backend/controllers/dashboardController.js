const Snippet = require('../models/Snippet');
const Bookmark = require('../models/Bookmark');

// @desc    Get dashboard statistics for the logged in user
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Run parallel queries for optimal performance
    const [
      totalSnippets,
      publicSnippets,
      privateSnippets,
      totalBookmarks,
      userSnippets,
      recentSnippets
    ] = await Promise.all([
      Snippet.countDocuments({ userId }),
      Snippet.countDocuments({ userId, visibility: 'public' }),
      Snippet.countDocuments({ userId, visibility: 'private' }),
      Bookmark.countDocuments({ userId }),
      Snippet.find({ userId }).select('likes language'),
      Snippet.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'username avatar')
    ]);

    // Calculate total likes received across all snippets owned by the user
    const totalLikesReceived = userSnippets.reduce((sum, snippet) => {
      return sum + (snippet.likes ? snippet.likes.length : 0);
    }, 0);

    // Calculate language distribution
    const languageCounts = {};
    userSnippets.forEach((snippet) => {
      if (snippet.language) {
        languageCounts[snippet.language] = (languageCounts[snippet.language] || 0) + 1;
      }
    });

    const formattedRecent = recentSnippets.map((s) => ({
      ...s.toObject(),
      likesCount: (s.likes || []).length,
      isLiked: (s.likes || []).some((uid) => uid.toString() === userId.toString())
    }));

    return res.json({
      success: true,
      stats: {
        totalSnippets,
        publicSnippets,
        privateSnippets,
        totalLikesReceived,
        totalBookmarks,
        languageBreakdown: languageCounts
      },
      recentSnippets: formattedRecent
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};

