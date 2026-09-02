"use client";

import { useState } from "react";
import {
  User,
  Shield,
  CreditCard,
  ChevronRight,
  LogOut,
  Camera,
  Mail,
  Phone,
  Lock,
  Loader2,
  Car,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomSheet } from "@/components/ui/bottom-sheet";

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);

  // Edit profile form state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const profileMutation = useMutation({
    mutationFn: (data: { name?: string; email?: string }) =>
      api.patch("/users/me", data),
    onSuccess: (res) => {
      updateUser(res.data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setShowEditProfile(false);
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

  const handlePasswordSubmit = () => {
    setPasswordError("");
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    passwordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Profile Card */}
      <button
        onClick={() => {
          setName(user?.name || "");
          setEmail(user?.email || "");
          setShowEditProfile(true);
        }}
        className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white">
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={user.name} className="h-14 w-14 rounded-full object-cover" />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-black">
            <Camera className="h-3 w-3" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{user?.name || "User"}</p>
          <p className="text-xs text-white/40">{user?.phone}</p>
          {user?.email && <p className="text-xs text-white/40">{user.email}</p>}
        </div>
        <ChevronRight className="h-4 w-4 text-white/30" />
      </button>

      <div className="space-y-2">
        {/* Safety */}
        <Link
          href="/safety"
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors"
        >
          <Shield className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Safety & Emergency</p>
            <p className="text-xs text-white/40">Emergency contacts, SOS, report issues</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </Link>

        {/* Switch Role */}
        <button
          onClick={() => setShowRoleSwitch(!showRoleSwitch)}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors"
        >
          <Car className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Switch Role</p>
            <p className="text-xs text-white/40">Currently: {user?.role?.toLowerCase()}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </button>

        {showRoleSwitch && (
          <div className="ml-8 space-y-1">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => roleMutation.mutate(role)}
                disabled={roleMutation.isPending || user?.role === role}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  user?.role === role
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                } disabled:opacity-50`}
              >
                {role.charAt(0) + role.slice(1).toLowerCase()}
                {user?.role === role && " (current)"}
              </button>
            ))}
          </div>
        )}

        {/* Payment */}
        <Link
          href="/wallet"
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors"
        >
          <CreditCard className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Payment Methods</p>
            <p className="text-xs text-white/40">Manage UPI, cards, and wallet</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </Link>

        {/* Change Password */}
        <button
          onClick={() => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordError("");
            setShowChangePassword(true);
          }}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors"
        >
          <Lock className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Change Password</p>
            <p className="text-xs text-white/40">Update your account password</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </button>
      </div>

      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="h-4 w-4" /> Sign Out
      </button>

      {/* Edit Profile Bottom Sheet */}
      <BottomSheet open={showEditProfile} onClose={() => setShowEditProfile(false)} title="Edit Profile">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Phone</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
              <Phone className="h-4 w-4 text-white/30" />
              <span className="text-sm text-white/50">{user?.phone}</span>
            </div>
            <p className="mt-1 text-[10px] text-white/30">Phone number cannot be changed</p>
          </div>
          <Button
            className="w-full"
            onClick={() => profileMutation.mutate({ name, email })}
            disabled={profileMutation.isPending || !name}
          >
            {profileMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </BottomSheet>

      {/* Change Password Bottom Sheet */}
      <BottomSheet open={showChangePassword} onClose={() => setShowChangePassword(false)} title="Change Password">
        <div className="space-y-4">
          {passwordError && (
            <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {passwordError}
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
              placeholder="Min 8 characters"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
              placeholder="Re-enter new password"
            />
          </div>
          <Button
            className="w-full"
            onClick={handlePasswordSubmit}
            disabled={passwordMutation.isPending || !currentPassword || !newPassword || !confirmPassword}
          >
            {passwordMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
