import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/profileService";
import { useToast } from "../components/ToastProvider";
import AvatarPicker from "../components/AvatarPicker";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      const profileData = response?.data && typeof response.data === "object" && !Array.isArray(response.data) ? response.data : {};
      setProfile(profileData);
    } catch (error) {
      toast.notify("Unable to load profile.", "error");
    }
  };

  const handleChange = (e) => {
    setProfile((current) => ({
      ...(current || {}),
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarSelect = (avatarId) => {
    setProfile((current) => ({
      ...(current || {}),
      avatar: avatarId,
    }));
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        full_name: profile?.full_name || user?.full_name || "",
        age_group: profile?.age_group || "",
        interests: profile?.interests || "",
        spiritual_goals: profile?.spiritual_goals || "",
        reading_preferences: profile?.reading_preferences || "",
        bio: profile?.bio || "",
        preferred_language: profile?.preferred_language || "English",
        avatar: profile?.avatar || "female-1",
      };
      const response = await updateProfile(payload);
      const updatedProfile = response?.data && typeof response.data === "object" ? response.data : payload;
      setProfile(updatedProfile);
      toast.notify("Profile updated successfully.", "success");
      setEditing(false);
    } catch (error) {
      toast.notify(error?.response?.data?.detail || "Unable to save profile. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.notify("New passwords do not match.", "error");
      return;
    }
    toast.notify("Password management is not available with the current backend API.", "error");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const memberSinceText = useMemo(() => {
    if (!user?.created_at && !profile?.created_at) return "N/A";
    const date = new Date(user?.created_at || profile?.created_at);
    if (Number.isNaN(date.getTime())) return "N/A";
    return `Member since ${date.toLocaleDateString("en", { month: "long", year: "numeric" })}`;
  }, [profile, user]);

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-white px-4 py-20 text-center text-slate-600 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-300">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-white px-4 py-10 text-slate-800 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-100/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-slate-950/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-violet-600 dark:text-violet-300">Profile</p>
              <h1 className="mt-3 text-4xl font-semibold">Your premium dashboard.</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">Manage your account details and keep your personal reading profile aligned with every new analysis.</p>
            </div>
            <button onClick={handleLogout} className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110">
              Logout
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-100/60 dark:border-white/10 dark:bg-slate-900/80">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/60">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Profile</p>
                <p className="mt-3 text-2xl font-semibold">{profile.full_name || user?.full_name || "Reader"}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{profile.email || user?.email}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/60">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Avatar</p>
                <div className="mt-4">
                  <AvatarPicker value={profile.avatar || "female-1"} onSelect={handleAvatarSelect} compact />
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/60">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Member since</p>
                <p className="mt-3 text-lg font-semibold">{memberSinceText}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Personalized readings and recommendations</p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/60">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">About you</p>
              <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between gap-4">
                  <span>Age group</span>
                  <span>{profile.age_group || "Not set"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Interests</span>
                  <span>{profile.interests || "Not set"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-100/60 dark:border-white/10 dark:bg-slate-900/80">
              <h2 className="text-2xl font-semibold">Personal details</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
                  <AvatarPicker value={profile.avatar || "female-1"} onSelect={handleAvatarSelect} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Full name</label>
                  <input name="full_name" value={profile.full_name || user?.full_name || ""} onChange={handleChange} disabled={!editing} className="mt-2 w-full rounded-[1.25rem] border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-slate-950 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Email</label>
                  <input name="email" value={profile.email || user?.email || ""} disabled className="mt-2 w-full rounded-[1.25rem] border border-slate-300 bg-slate-50 px-4 py-3 text-slate-500 outline-none dark:border-white/10 dark:bg-slate-950 dark:text-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Age group</label>
                  <input name="age_group" value={profile.age_group || ""} onChange={handleChange} disabled={!editing} className="mt-2 w-full rounded-[1.25rem] border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-slate-950 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Interests</label>
                  <input name="interests" value={profile.interests || ""} onChange={handleChange} disabled={!editing} className="mt-2 w-full rounded-[1.25rem] border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-slate-950 dark:text-white" />
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setEditing((current) => !current)} className="rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500">
                  {editing ? "Cancel" : "Edit profile"}
                </button>
                {editing && (
                  <button onClick={saveProfile} disabled={saving} className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:opacity-60">
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-100/60 dark:border-white/10 dark:bg-slate-900/80">
              <h2 className="text-2xl font-semibold">Security</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">Password updates are not available with the current backend API, so this section remains informational.</p>
              <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Current password</label>
                  <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} className="mt-2 w-full rounded-[1.25rem] border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-slate-950 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">New password</label>
                  <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} className="mt-2 w-full rounded-[1.25rem] border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-slate-950 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Confirm new password</label>
                  <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} className="mt-2 w-full rounded-[1.25rem] border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-slate-950 dark:text-white" />
                </div>
                <button type="submit" className="w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500">
                  Update password
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
