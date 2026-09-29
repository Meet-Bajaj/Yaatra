"use client";

import { useEffect, useRef, useState } from "react";
import {
  User, MapPin, ChevronRight, LogOut, Camera, Loader2,
  Shield, CreditCard, Lock, Phone, Car,
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getInitials } from "@/lib/utils";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Sheet states ──────────────────────────────────────
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);

  // ─── Edit profile fields ───────────────────────────────
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [city, setCity] = useState(user?.city || "");

  // ─── Password fields ───────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ─── Fetch latest profile ──────────────────────────────
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get(API.users.me);
      if (res.data) updateUser(res.data);
      return res.data;
    },
  });

  useEffect(() => {
    if (user) {
      // Hydrate the edit form once the fetched profile arrives (async data post-mount).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name || "");
      setEmail(user.email || "");
      setCity(user.city || "");
    }
    // Primitive deps intentionally: only re-sync when values change, so a
    // background profile refetch never clobbers what the user is typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.name, user?.email, user?.city]);

  // ─── Mutations ─────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (data: { name?: string; email?: string; city?: string }) =>
      api.patch(API.users.updateMe, data),
    onSuccess: (res) => {
      if (res.data) updateUser(res.data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setShowEditProfile(false);
    },
  });

  const avatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(API.users.avatar, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      api.patch("/users/me", data),
    onSuccess: () => {
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setPasswordError(err?.response?.data?.message || "Failed to update password");
    },
  });

  const roleMutation = useMutation({
    mutationFn: (role: string) => api.post("/users/me/role", { role }),
    onSuccess: (res) => {
      updateUser(res.data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setShowRoleSwitch(false);
    },
  });

  const roles = ["RIDER", "DRIVER", "BOTH"];

  // ─── Handlers ──────────────────────────────────────────
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("File size must be less than 5MB"); return; }
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) { alert("Only JPEG, PNG, WebP, and GIF images are allowed"); return; }
    avatarMutation.mutate(file);
    e.target.value = "";
  };

  const handleSaveProfile = () => {
    const data: { name?: string; email?: string; city?: string } = {};
    if (name !== user?.name) data.name = name;
    if (email !== user?.email) data.email = email;
    if (city !== user?.city) data.city = city;
    if (Object.keys(data).length > 0) {
      updateMutation.mutate(data);
    } else {
      setShowEditProfile(false);
    }
  };

  const handlePasswordSubmit = () => {
    setPasswordError("");
    if (newPassword.length < 8) { setPasswordError("Password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Passwords do not match"); return; }
    passwordMutation.mutate({ currentPassword, newPassword });
  };

  const openEditProfile = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setCity(user?.city || "");
    setShowEditProfile(true);
  };

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <h1 className="text-xl font-bold text-white md:text-2xl">Profile</h1>

      {/* ─── Avatar Card ───────────────────────────────── */}
      <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 md:p-6">
        <div className="relative mb-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white overflow-hidden">
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
            ) : (
              getInitials(user?.name || "U")
            )}
          </div>
          <button
            onClick={handleAvatarClick}
            disabled={avatarMutation.isPending}
            className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-colors touch-target disabled:opacity-50"
          >
            {avatarMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          </button>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange} className="hidden" />
        </div>
        <h2 className="text-lg font-semibold text-white">{user?.name}</h2>
        <p className="text-sm text-white/60">{user?.phone}</p>
        <p className="text-xs text-white/40 capitalize mt-1">{user?.role?.toLowerCase()}</p>
      </div>

      {/* ─── Actions List ──────────────────────────────── */}
      <div className="space-y-2">
        <button onClick={openEditProfile}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors touch-target">
          <User className="h-5 w-5 text-white/50" />
          <div className="flex-1"><p className="text-sm font-medium text-white">Edit Profile</p><p className="text-xs text-white/50">Update name, email, and city</p></div>
          <ChevronRight className="h-4 w-4 text-white/40" />
        </button>

        <Link href="/profile/places"
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors touch-target">
          <MapPin className="h-5 w-5 text-white/50" />
          <div className="flex-1"><p className="text-sm font-medium text-white">Saved Places</p><p className="text-xs text-white/50">Home, work, and favorites</p></div>
          <ChevronRight className="h-4 w-4 text-white/40" />
        </Link>

        <Link href="/safety"
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors touch-target">
          <Shield className="h-5 w-5 text-white/50" />
          <div className="flex-1"><p className="text-sm font-medium text-white">Safety & Emergency</p><p className="text-xs text-white/50">Emergency contacts, SOS, report issues</p></div>
          <ChevronRight className="h-4 w-4 text-white/40" />
        </Link>

        {user?.role !== "ADMIN" && (
          <>
            <button onClick={() => setShowRoleSwitch(!showRoleSwitch)}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors touch-target">
              <Car className="h-5 w-5 text-white/50" />
              <div className="flex-1"><p className="text-sm font-medium text-white">Switch Role</p><p className="text-xs text-white/50">Currently: {user?.role?.toLowerCase()}</p></div>
              <ChevronRight className="h-4 w-4 text-white/40" />
            </button>
            {showRoleSwitch && (
              <div className="ml-8 space-y-1">
                {roles.map((role) => (
                  <button key={role} onClick={() => roleMutation.mutate(role)}
                    disabled={roleMutation.isPending || user?.role === role}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors touch-target ${user?.role === role ? "bg-white/10 text-white font-medium" : "text-white/50 hover:bg-white/5 hover:text-white/80"} disabled:opacity-50`}>
                    {role.charAt(0) + role.slice(1).toLowerCase()}
                    {user?.role === role && " (current)"}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        <Link href="/wallet"
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors touch-target">
          <CreditCard className="h-5 w-5 text-white/50" />
          <div className="flex-1"><p className="text-sm font-medium text-white">Payment & Wallet</p><p className="text-xs text-white/50">Manage UPI, cards, and wallet</p></div>
          <ChevronRight className="h-4 w-4 text-white/40" />
        </Link>

        <button onClick={() => { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setPasswordError(""); setShowChangePassword(true); }}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors touch-target">
          <Lock className="h-5 w-5 text-white/50" />
          <div className="flex-1"><p className="text-sm font-medium text-white">Change Password</p><p className="text-xs text-white/50">Update your account password</p></div>
          <ChevronRight className="h-4 w-4 text-white/40" />
        </button>
      </div>

      {/* ─── Sign Out ──────────────────────────────────── */}
      <button onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors touch-target">
        <LogOut className="h-4 w-4" /> Sign Out
      </button>

      {/* ─── Edit Profile Sheet ────────────────────────── */}
      <BottomSheet open={showEditProfile} onClose={() => setShowEditProfile(false)} title="Edit Profile">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 touch-target md:h-11"
              placeholder="Your name" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 touch-target md:h-11"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 touch-target md:h-11"
              placeholder="Your city" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Phone</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <Phone className="h-4 w-4 text-white/40" />
              <span className="text-sm text-white/60">{user?.phone}</span>
            </div>
            <p className="mt-1 text-[10px] text-white/40">Phone number cannot be changed</p>
          </div>
          <Button className="w-full" size="lg" onClick={handleSaveProfile}
            disabled={updateMutation.isPending || !name}>
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </BottomSheet>

      {/* ─── Change Password Sheet ─────────────────────── */}
      <BottomSheet open={showChangePassword} onClose={() => setShowChangePassword(false)} title="Change Password">
        <div className="space-y-4">
          {passwordError && <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{passwordError}</div>}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 touch-target md:h-11"
              placeholder="Enter current password" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 touch-target md:h-11"
              placeholder="Min 8 characters" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 touch-target md:h-11"
              placeholder="Re-enter new password" />
          </div>
          <Button className="w-full" size="lg" onClick={handlePasswordSubmit}
            disabled={passwordMutation.isPending || !currentPassword || !newPassword || !confirmPassword}>
            {passwordMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
