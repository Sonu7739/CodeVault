const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Snippet title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    code: {
      type: String,
      required: [true, 'Code is required']
    },
    language: {
      type: String,
      required: [true, 'Programming language is required'],
      trim: true,
      enum: [
        'Java',
        'Python',
        'JavaScript',
        'TypeScript',
        'C',
        'C++',
        'C#',
        'HTML',
        'CSS',
        'SQL',
        'PHP',
        'Go',
        'Rust',
        'Kotlin',
        'JSON',
        'Bash',
        'Other'
      ]
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

// Update updatedAt pre-save hook
snippetSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for efficient searching, filtering and sorting
snippetSchema.index({ language: 1 });
snippetSchema.index({ tags: 1 });
snippetSchema.index({ visibility: 1, createdAt: -1 });
snippetSchema.index({ userId: 1, createdAt: -1 });
// IMPORTANT: MongoDB text index defaults to language_override: 'language'.
// We explicitly set language_override: 'none' so MongoDB does not treat programming
// language names (like 'Java', 'Python', 'C++') as spoken language stemming codes.
snippetSchema.index(
  { title: 'text', description: 'text' },
  { language_override: 'none' }
);

const Snippet = mongoose.model('Snippet', snippetSchema);
module.exports = Snippet;

