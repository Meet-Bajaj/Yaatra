"use client";

import { useState } from "react";
import {
  Shield,
  CreditCard,
  ChevronRight,
  LogOut,
  Camera,
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
import { BottomSheet } from "@/components/ui/bottom-sheet";

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

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
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <h1 className="text-xl font-bold text-white md:text-2xl">Settings</h1>

      <button
        onClick={() => {
          setName(user?.name || "");
          setEmail(user?.email || "");
          setShowEditProfile(true);
        }}
        className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 text-left hover:bg-white/5 transition-colors touch-target"
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
          <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
            <Camera className="h-3 w-3" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{user?.name || "User"}</p>
          <p className="text-xs text-white/50">{user?.phone}</p>
          {user?.email && <p className="text-xs text-white/50">{user.email}</p>}
        </div>
        <ChevronRight className="h-4 w-4 text-white/40" />
      </button>

      <div className="space-y-2">
        <Link
          href="/safety"
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors touch-target"
        >
          <Shield className="h-5 w-5 text-white/50" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Safety & Emergency</p>
            <p className="text-xs text-white/50">Emergency contacts, SOS, report issues</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/40" />
        </Link>

        <button
          onClick={() => setShowRoleSwitch(!showRoleSwitch)}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors touch-target"
        >
          <Car className="h-5 w-5 text-white/50" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Switch Role</p>
            <p className="text-xs text-white/50">Currently: {user?.role?.toLowerCase()}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/40" />
        </button>

        {showRoleSwitch && (
          <div className="ml-8 space-y-1">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => roleMutation.mutate(role)}
                disabled={roleMutation.isPending || user?.role === role}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors touch-target ${
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

        <Link
          href="/wallet"
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors touch-target"
        >
          <CreditCard className="h-5 w-5 text-white/50" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Payment Methods</p>
            <p className="text-xs text-white/50">Manage UPI, cards, and wallet</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/40" />
        </Link>

        <button
          onClick={() => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordError("");
            setShowChangePassword(true);
          }}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors touch-target"
        >
          <Lock className="h-5 w-5 text-white/50" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Change Password</p>
            <p className="text-xs text-white/50">Update your account password</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/40" />
        </button>
      </div>

      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors touch-target"
      >
        <LogOut className="h-4 w-4" /> Sign Out
      </button>

      <BottomSheet open={showEditProfile} onClose={() => setShowEditProfile(false)} title="Edit Profile">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 touch-target md:h-11"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 touch-target md:h-11"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Phone</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <Phone className="h-4 w-4 text-white/40" />
              <span className="text-sm text-white/60">{user?.phone}</span>
            </div>
            <p className="mt-1 text-[10px] text-white/40">Phone number cannot be changed</p>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => profileMutation.mutate({ name, email })}
            disabled={profileMutation.isPending || !name}
          >
            {profileMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet open={showChangePassword} onClose={() => setShowChangePassword(false)} title="Change Password">
        <div className="space-y-4">
          {passwordError && (
            <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {passwordError}
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 touch-target md:h-11"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 touch-target md:h-11"
              placeholder="Min 8 characters"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 touch-target md:h-11"
              placeholder="Re-enter new password"
            />
          </div>
          <Button
            className="w-full"
            size="lg"
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
