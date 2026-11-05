import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MySnippets from './pages/MySnippets';
import Explore from './pages/Explore';
import AddSnippet from './pages/AddSnippet';
import EditSnippet from './pages/EditSnippet';
import SnippetDetails from './pages/SnippetDetails';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          {/* Public Landing & Authentication */}
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Public / Community Exploration */}
          <Route path="/explore" element={<Explore />} />
          <Route path="/snippets/:id" element={<SnippetDetails />} />
          <Route path="/profile/:username" element={<Profile />} />

          {/* Protected Developer Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-snippets"
            element={
              <ProtectedRoute>
                <MySnippets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/snippets/new"
            element={
              <ProtectedRoute>
                <AddSnippet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/snippets/edit/:id"
            element={
              <ProtectedRoute>
                <EditSnippet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;

