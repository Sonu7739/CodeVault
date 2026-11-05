const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    snippetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Snippet',
      required: true,
      index: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

// Unique compound index so a user cannot bookmark the same snippet multiple times
bookmarkSchema.index({ userId: 1, snippetId: 1 }, { unique: true });
bookmarkSchema.index({ userId: 1, createdAt: -1 });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;

