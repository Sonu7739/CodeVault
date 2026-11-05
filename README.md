# CodeVault 🛡️

> **"Your Code. Your Vault. Your Community."**  
> A developer code snippet management and sharing platform built with React, Node.js/Express, and MongoDB Atlas.

---

## 📌 1. Project Overview

**CodeVault** is a full-stack developer SaaS platform designed to streamline how software engineers store, organize, share, and discover reusable code snippets. It bridges the gap between a private personal code library and a public developer knowledge-sharing community.

### Key Capabilities:
- **Personal Code Vault**: Store frequently used algorithms, boilerplate configurations, utility helpers, and snippets with syntax highlighting.
- **Privacy Controls**: Mark snippets as **Private** (exclusive to your account) or **Public** (discoverable by the community).
- **Multi-Language Support**: Full syntax highlighting for 17+ languages (JavaScript, TypeScript, Python, Java, Go, Rust, C, C++, C#, SQL, HTML, CSS, PHP, Kotlin, JSON, Bash, and Other).
- **1-Click Copy & Share**: Immediate clipboard copy with animated feedback and unique shareable permalinks.
- **Developer Community**: Explore public snippets, filter by tags/languages, vote with likes, and save bookmarks.
- **Developer Profiles**: Showcase public snippets and bio information while keeping emails and private data secure.
- **Live Statistics**: Real-time dashboard displaying total snippets, public vs. private counts, and appreciations received.

---

## 💻 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Axios, Tailwind CSS, Lucide React, React Syntax Highlighter (Prism) |
| **Backend** | Node.js, Express.js (REST API), JSON Web Tokens (JWT), bcryptjs, CORS, dotenv |
| **Database** | MongoDB Atlas Cloud Database (`CodeVaultDB`), Mongoose ODM |
| **Design System** | Premium Modern Dark Theme (`#0B0F19`), Electric Purple (`#8B5CF6`), Blue Accent (`#3B82F6`) |

---

## 🏗️ 3. Project Architecture

```
CodeVault/
├── package.json                   # Root orchestrator scripts
├── README.md                      # Comprehensive documentation
├── .gitignore                     # Git ignore rules
│
├── server/                        # Express.js REST API Backend
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection & error reporting
│   ├── models/
│   │   ├── User.js                # User schema with bcrypt password hashing
│   │   ├── Snippet.js             # Snippet schema with indexes & search
│   │   └── Bookmark.js            # Bookmark schema with unique compound index
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Me endpoints
│   │   ├── snippetController.js   # CRUD, likes, public/private authorization
│   │   ├── bookmarkController.js  # Add, remove, query bookmarked snippets
│   │   ├── userController.js      # Public profile & bio updates
│   │   └── dashboardController.js # Aggregated statistics & recent activity
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── snippetRoutes.js
│   │   ├── bookmarkRoutes.js
│   │   ├── userRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification & optional auth
│   │   └── errorMiddleware.js     # Centralized error & 404 handlers
│   ├── utils/
│   │   └── generateToken.js       # JWT signing utility
│   ├── test/                      # Node.js built-in automated test suite
│   ├── seed.js                    # Database seeder with sample snippets
│   ├── server.js                  # Application entry point
│   ├── .env.example               # Backend environment template
│   └── package.json
│
└── client/                        # React + Vite Frontend
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Top search bar, mobile toggle & user status
    │   │   ├── Sidebar.jsx         # SaaS sidebar with badge links & logout
    │   │   ├── DashboardLayout.jsx # Authenticated layout container
    │   │   ├── SnippetCard.jsx     # Snippet card with copy, like & bookmarks
    │   │   ├── CodeViewer.jsx      # Prism syntax highlighter with copy button
    │   │   ├── CodeEditor.jsx      # Monospace editor with Tab-indent & live preview
    │   │   ├── SearchBar.jsx       # Real-time search bar
    │   │   ├── LanguageFilter.jsx  # Multi-language selector dropdown
    │   │   ├── ProtectedRoute.jsx  # Client-side JWT route protection
    │   │   ├── LoadingSpinner.jsx  # Skeletons and loading indicators
    │   │   ├── EmptyState.jsx      # Illustrated empty state placeholders
    │   │   ├── ConfirmDialog.jsx   # Modal confirmation for destructive actions
    │   │   └── Footer.jsx          # Brand footer with links
    │   ├── pages/
    │   │   ├── Landing.jsx         # Public landing page with hero & code preview
    │   │   ├── Register.jsx        # Registration with password visibility toggle
    │   │   ├── Login.jsx           # Login with JWT persistence
    │   │   ├── Dashboard.jsx       # Analytics, quick actions & recent snippets
    │   │   ├── MySnippets.jsx      # Personal vault with search/filter/sort
    │   │   ├── Explore.jsx         # Community snippets, tag cloud & likes sort
    │   │   ├── AddSnippet.jsx      # Create form with live syntax preview
    │   │   ├── EditSnippet.jsx     # Owner-validated update form
    │   │   ├── SnippetDetails.jsx  # Full view, copy, share & related snippets
    │   │   ├── Bookmarks.jsx       # Saved bookmarks management
    │   │   ├── Profile.jsx         # Developer profile & editable bio
    │   │   └── NotFound.jsx        # 404 error page
    │   ├── context/
    │   │   ├── AuthContext.jsx     # Authentication state provider
    │   │   └── ToastContext.jsx    # Custom toast notification system
    │   ├── services/
    │   │   ├── api.js              # Axios instance with JWT interceptor
    │   │   ├── authService.js
    │   │   ├── snippetService.js
    │   │   ├── bookmarkService.js
    │   │   ├── userService.js
    │   │   └── dashboardService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example               # Frontend environment template
    ├── tailwind.config.js
    ├── vite.config.js
    └── vercel.json                # Single Page App rewrite rules for Vercel
```

---

## 🚀 4. Installation & Setup Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)
- **MongoDB Atlas** account (or local MongoDB daemon)

---

### Step 1: Clone or Navigate to the Project

```bash
cd CodeVault
```

---

### Step 2: Configure MongoDB Atlas Database

1. Log into your [MongoDB Atlas Console](https://www.mongodb.com/cloud/atlas).
2. Create a **Shared Free Cluster** (M0).
3. Under **Security > Database Access**:
   - Create a database user with Read/Write privileges (e.g., username: `codevault_admin`).
   - Note the password.
4. Under **Security > Network Access**:
   - Add IP Access: `0.0.0.0/0` (Allow Access from Anywhere) to permit cloud and local connections.
5. Under **Deployment > Database**:
   - Click **Connect** > **Drivers** > **Node.js**.
   - Copy the connection URI string. It looks like:
     ```
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/CodeVaultDB?retryWrites=true&w=majority
     ```

---

### Step 3: Backend Setup (`server/`)

1. Open `server/.env` (or copy from `server/.env.example`):
   ```bash
   cd server
   cp .env.example .env
   ```
2. Fill in your credentials:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://your_username:your_password@cluster0.abcde.mongodb.net/CodeVaultDB?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Seed the database with high-quality sample snippets:
   ```bash
   npm run seed
   ```
   *(Creates 3 developer accounts: `alex_dev`, `sarah_codes`, `marcus_db` with password `password123` and preloaded snippets across TypeScript, Go, Python, Rust, SQL, Java, and Bash).*

5. Start the backend server:
   ```bash
   npm run dev
   # or: npm start
   ```
   Server will run on `http://localhost:5000`.

---

### Step 4: Frontend Setup (`client/`)

1. In a new terminal window:
   ```bash
   cd client
   ```
2. Verify `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser at:
   ```
   http://localhost:5173
   ```

---

## 🧪 5. Automated Testing

The backend includes a comprehensive suite of unit and controller tests using the Node.js test runner:

```bash
cd server
npm test
```

### Tests verified:
- User schema password hashing with bcryptjs
- Safe JSON output excluding password hashes
- JWT signing and verification
- Snippet schema validation and default visibility
- Bookmark compound index requirements
- Express route controllers and authorization checks

---

## 📡 6. REST API Reference

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user with username, email, password |
| `POST` | `/api/auth/login` | Public | Authenticate user with email and password, returns JWT |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |

### Snippet Routes (`/api/snippets`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/snippets` | Private | Create a new code snippet |
| `GET` | `/api/snippets/my` | Private | Get user's own snippets (search, language, visibility, sort) |
| `GET` | `/api/snippets/explore` | Public | Get public snippets (search, language, tag, sort, pagination) |
| `GET` | `/api/snippets/:id` | Public/Private | Get snippet details + related snippets (403 if private & not owner) |
| `PUT` | `/api/snippets/:id` | Private (Owner) | Update snippet title, code, language, tags, visibility |
| `DELETE` | `/api/snippets/:id` | Private (Owner) | Delete snippet and related bookmarks |
| `POST` | `/api/snippets/:id/like` | Private | Toggle like / unlike on a snippet |
| `POST` | `/api/snippets/:id/bookmark` | Private | Bookmark snippet |
| `DELETE` | `/api/snippets/:id/bookmark` | Private | Remove bookmark |

### Bookmark Routes (`/api/bookmarks`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/bookmarks` | Private | Get all bookmarked snippets for logged-in user |

### User Profile Routes (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/:username` | Public | Public developer profile + public snippets count & list |
| `PUT` | `/api/users/profile` | Private | Update authenticated user's bio and avatar |

### Dashboard Routes (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Private | Real statistics: total, public, private counts, total likes & recent items |

---

## 🔒 7. Security Architecture

1. **Password Protection**: Passwords hashed using `bcryptjs` with salt rounds before database persistence.
2. **Stateless JWT Authentication**: Secure tokens signed with `JWT_SECRET` and evaluated in `authMiddleware.js`.
3. **Data Sanitization**: Passwords explicitly removed from all JSON responses via `User.toJSON()` and `.select('-password')`.
4. **Ownership Enforcement**: Update and delete actions strictly compare `req.user._id` with `snippet.userId`.
5. **Private Vault Isolation**: Queries to `/explore` strictly match `{ visibility: 'public' }`. Direct ID lookups enforce `403 Forbidden` if private and requested by a non-owner.
6. **Compound Index Integrity**: The Bookmark model enforces a unique compound index on `(userId, snippetId)` preventing duplicate bookmarking.

---

## 🌐 8. Deployment Guide

### Deploying Frontend to Vercel
1. Push repository to GitHub.
2. On [Vercel](https://vercel.com):
   - Import your repository.
   - Set **Root Directory** to `client`.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL`: `https://your-backend-api.onrender.com/api`
3. Deploy! The included `client/vercel.json` ensures client-side routing works seamlessly on refresh.

### Deploying Backend to Render / Railway
1. Create a new **Web Service** pointing to your repository.
2. Set **Root Directory** to `server`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables:
   - `PORT`: `5000`
   - `MONGO_URI`: `mongodb+srv://...` (your Atlas connection string)
   - `JWT_SECRET`: `random_strong_production_secret`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `NODE_ENV`: `production`

---

## 📄 License
This project is licensed under the MIT License.
Built for software engineers who value clean, organized, and accessible code.

