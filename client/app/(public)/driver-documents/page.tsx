"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Car, X } from "lucide-react";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const docTypes = ["AADHAAR", "DRIVING_LICENSE", "PAN"] as const;

export default function DriverDocumentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [capacity, setCapacity] = useState("4");

  const [docType, setDocType] = useState<string>("DRIVING_LICENSE");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post(API.users.vehicles, {
        make: vehicleMake,
        model: vehicleModel,
        color: vehicleColor,
        licensePlate,
        capacity: parseInt(capacity),
      });

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("docType", docType);
        await api.post(API.documents.list, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      router.push("/profile-setup");
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <Car className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Vehicle & Documents</h2>
          <p className="text-sm text-white/50">Add your vehicle and upload documents</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Vehicle Make"
            placeholder="e.g. Maruti"
            value={vehicleMake}
            onChange={(e) => setVehicleMake(e.target.value)}
          />
          <Input
            label="Vehicle Model"
            placeholder="e.g. Swift"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Color"
            placeholder="e.g. White"
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
          />
          <Input
            label="License Plate"
            placeholder="e.g. MH 01 AB 1234"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />
        </div>

        <Input
          label="Capacity"
          type="number"
          min="2"
          max="6"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/70">Document Type</label>
          <div className="flex gap-2">
            {docTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDocType(type)}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                  docType === type
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                }`}
              >
                {type.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/70">Upload Document</label>
          {file ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Car className="h-5 w-5 text-white/50" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{file.name}</p>
                <p className="text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] p-8 text-white/40 hover:border-white/20 hover:bg-white/5 transition-colors"
            >
              <Upload className="h-5 w-5" />
              <span className="text-sm">Click to upload (max 5MB)</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full" size="lg" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save & Continue"}
        </Button>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full text-center text-sm text-white/40 hover:text-white transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
