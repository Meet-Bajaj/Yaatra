"use client";

import { useEffect, useRef, useState } from "react";
import { User, MapPin, ChevronRight, LogOut, Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getInitials } from "@/lib/utils";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [city, setCity] = useState(user?.city || "");

  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get(API.users.me);
      if (res.data) {
        updateUser(res.data);
      }
      return res.data;
    },
  });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setCity(user.city || "");
    }
  }, [user?.name, user?.city]);

  const updateMutation = useMutation({
    mutationFn: (data: { name?: string; city?: string }) =>
      api.patch(API.users.updateMe, data),
    onSuccess: (res) => {
      if (res.data) {
        updateUser(res.data);
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setEditing(false);
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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG, PNG, WebP, and GIF images are allowed");
      return;
    }

    avatarMutation.mutate(file);
    e.target.value = "";
  };

  const handleSave = () => {
    const data: { name?: string; city?: string } = {};
    if (name !== user?.name) data.name = name;
    if (city !== user?.city) data.city = city;
    if (Object.keys(data).length > 0) {
      updateMutation.mutate(data);
    } else {
      setEditing(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <h1 className="text-xl font-bold text-white md:text-2xl">Profile</h1>

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
            {avatarMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <h2 className="text-lg font-semibold text-white">{user?.name}</h2>
        <p className="text-sm text-white/60">{user?.phone}</p>
        <p className="text-xs text-white/40 capitalize mt-1">{user?.role?.toLowerCase()}</p>
      </div>

      {editing ? (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
          <div>
            <label className="mb-1.5 block text-xs text-white/50">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none touch-target"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-white/50">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none touch-target"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(false); setName(user?.name || ""); setCity(user?.city || ""); }}
              className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-white/60 hover:bg-white/5 transition-colors touch-target"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex-1 rounded-xl bg-white py-3 text-sm font-medium text-black hover:bg-white/90 transition-colors disabled:opacity-50 touch-target"
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
              <User className="h-5 w-5 text-white/50" />
              <div className="flex-1">
                <p className="text-xs text-white/50">Name</p>
                <p className="text-sm text-white">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
              <MapPin className="h-5 w-5 text-white/50" />
              <div className="flex-1">
                <p className="text-xs text-white/50">City</p>
                <p className="text-sm text-white">{user?.city || "Not set"}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0a] py-3 text-sm font-medium text-white/60 hover:bg-white/5 transition-colors touch-target"
          >
            Edit Profile
          </button>
        </>
      )}

      <button
        onClick={() => router.push("/profile/places")}
        className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left text-sm text-white/60 hover:bg-white/5 transition-colors touch-target"
      >
        Saved Places <ChevronRight className="ml-auto h-4 w-4" />
      </button>

      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors touch-target"
      >
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    </div>
  );
}
