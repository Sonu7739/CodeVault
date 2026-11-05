const User = require('../models/User');
const Snippet = require('../models/Snippet');

// @desc    Get public user profile and their public snippets
// @route   GET /api/users/:username
// @access  Public
const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      username: username.trim().toLowerCase()
    }).select('username bio avatar createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Developer profile not found'
      });
    }

    // Total public snippets count
    const totalPublicSnippets = await Snippet.countDocuments({
      userId: user._id,
      visibility: 'public'
    });

    // Fetch public snippets created by this user
    const publicSnippets = await Snippet.find({
      userId: user._id,
      visibility: 'public'
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const formattedSnippets = publicSnippets.map((s) => ({
      ...s,
      likesCount: (s.likes || []).length,
      isLiked: req.user
        ? (s.likes || []).some((uid) => uid.toString() === req.user._id.toString())
        : false
    }));

    return res.json({
      success: true,
      profile: {
        _id: user._id,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
        totalPublicSnippets
      },
      snippets: formattedSnippets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update authenticated user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { bio, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    if (avatar !== undefined) {
      user.avatar = avatar.trim();
    }

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};

