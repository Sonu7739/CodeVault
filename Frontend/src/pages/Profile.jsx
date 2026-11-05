import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User,
  Calendar,
  Code2,
  Edit3,
  Save,
  X,
  Loader2,
  CheckCircle2,
  Globe,
  Sparkles
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import SnippetCard from '../components/SnippetCard';
import LoadingSpinner, { CardSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const { success, error } = useToast();

  const [profile, setProfile] = useState(null);
  const [snippets, setSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit bio modal state
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [isSavingBio, setIsSavingBio] = useState(false);

  const isOwnProfile =
    currentUser &&
    profile &&
    currentUser.username.toLowerCase() === profile.username.toLowerCase();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await userService.getUserProfile(username);
      if (res.success) {
        setProfile(res.profile);
        setSnippets(res.snippets || []);
        setBioText(res.profile.bio || '');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      error(err.response?.data?.message || 'Developer profile not found');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const handleSaveBio = async (e) => {
    e.preventDefault();
    try {
      setIsSavingBio(true);
      const res = await userService.updateProfile({ bio: bioText });
      if (res.success) {
        success('Profile updated successfully!');
        setProfile((prev) => ({ ...prev, bio: res.user.bio }));
        updateUser(res.user);
        setIsEditingBio(false);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingBio(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Loading developer profile..." />
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-white mb-2">Developer Not Found</h2>
          <p className="text-sm text-vault-muted mb-6">
            The profile for "@{username}" does not exist.
          </p>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl bg-purple-brand hover:bg-purple-brand-hover text-white text-sm font-semibold transition"
          >
            Explore Developers
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const initials = profile.username.slice(0, 2).toUpperCase();
  const joinDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <DashboardLayout>
      {/* Profile Card Header */}
      <div className="bg-vault-card border border-vault-border rounded-2xl p-6 md:p-8 mb-8 shadow-card relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* Avatar Initials */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-brand to-blue-brand flex items-center justify-center text-2xl font-extrabold text-white shadow-glow-purple shrink-0">
              {initials}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  @{profile.username}
                </h1>
                {isOwnProfile && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-medium">
                    You
                  </span>
                )}
              </div>

              {/* Bio */}
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                {profile.bio || (
                  <span className="italic text-vault-subtle">
                    {isOwnProfile
                      ? 'No developer bio written yet. Click "Edit Bio" to describe your stack!'
                      : 'No developer bio provided.'}
                  </span>
                )}
              </p>

              {/* Join Date & Stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-vault-subtle pt-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined {joinDate}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profile.totalPublicSnippets} Public Snippets</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Bio Button for owner */}
          {isOwnProfile && (
            <button
              onClick={() => setIsEditingBio(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-vault-border text-xs font-semibold text-slate-200 transition self-start md:self-center"
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-brand" />
              <span>Edit Bio</span>
            </button>
          )}
        </div>
      </div>

      {/* Edit Bio Modal */}
      {isEditingBio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-vault-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEditingBio(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-white mb-1">Update Developer Bio</h3>
            <p className="text-xs text-vault-muted mb-4">
              Share what technologies and stacks you love building with.
            </p>

            <form onSubmit={handleSaveBio} className="space-y-4">
              <textarea
                rows={4}
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                maxLength={500}
                placeholder="e.g. Full-stack developer passionate about Node.js, distributed databases, and high-performance React architectures."
                className="w-full bg-slate-950 border border-vault-border rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-brand transition resize-none"
              />
              <div className="text-right text-[11px] text-vault-subtle">
                {bioText.length}/500 characters
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingBio(false)}
                  disabled={isSavingBio}
                  className="px-4 py-2 rounded-lg border border-vault-border text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingBio}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-purple-brand hover:bg-purple-brand-hover text-white text-xs font-semibold transition shadow-glow-purple disabled:opacity-50"
                >
                  {isSavingBio ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Developer's Public Snippets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-brand" />
            <h2 className="text-base font-semibold text-white">
              Public Snippets by @{profile.username}
            </h2>
          </div>
          <span className="text-xs text-vault-subtle">
            {snippets.length} {snippets.length === 1 ? 'snippet' : 'snippets'}
          </span>
        </div>

        {snippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                showAuthor={false}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No public snippets"
            description={`@${profile.username} has not published any public code snippets yet.`}
            actionLabel={isOwnProfile ? 'Create Public Snippet' : null}
            actionLink="/snippets/new"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;

