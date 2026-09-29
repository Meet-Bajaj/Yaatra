"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Car, X, FileText, Check } from "lucide-react";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const docTypes = [
  { value: "AADHAAR", label: "Aadhaar Card", desc: "Government-issued ID" },
  { value: "DRIVING_LICENSE", label: "Driving License", desc: "Valid driving license" },
  { value: "PAN", label: "PAN Card", desc: "Tax identification" },
] as const;

interface DocEntry {
  type: string;
  file: File | null;
  uploaded: boolean;
  uploading: boolean;
}

export default function DriverDocumentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [capacity, setCapacity] = useState("4");

  const [docs, setDocs] = useState<DocEntry[]>([
    { type: "AADHAAR", file: null, uploaded: false, uploading: false },
    { type: "DRIVING_LICENSE", file: null, uploaded: false, uploading: false },
    { type: "PAN", file: null, uploaded: false, uploading: false },
  ]);

  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateDoc = (index: number, updates: Partial<DocEntry>) => {
    setDocs((prev) => prev.map((d, i) => (i === index ? { ...d, ...updates } : d)));
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }
    updateDoc(index, { file, uploaded: false });
    setError("");
  };

  const uploadDoc = async (index: number) => {
    const doc = docs[index];
    if (!doc.file) return;

    updateDoc(index, { uploading: true });
    try {
      const formData = new FormData();
      formData.append("file", doc.file);
      formData.append("docType", doc.type);
      await api.post(API.documents.list, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateDoc(index, { uploaded: true, uploading: false });
    } catch {
      updateDoc(index, { uploading: false });
      setError(`Failed to upload ${doc.type.replace("_", " ")}. Please try again.`);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const hasVehicle = vehicleMake || vehicleModel || licensePlate;
      if (hasVehicle) {
        await api.post(API.users.vehicles, {
          make: vehicleMake,
          model: vehicleModel,
          color: vehicleColor,
          licensePlate,
          capacity: parseInt(capacity),
        });
      }

      const pendingDocs = docs.filter((d) => d.file && !d.uploaded);
      for (const doc of pendingDocs) {
        const formData = new FormData();
        formData.append("file", doc.file!);
        formData.append("docType", doc.type);
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

  const anyUploading = docs.some((d) => d.uploading);

  return (
    <div className="animate-fade-in rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <Car className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Vehicle & Documents</h2>
          <p className="text-sm text-white/50">Add your vehicle and upload KYC documents</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ─── Vehicle Info ──────────────────────────────── */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">Vehicle Information</h3>
        <div className="space-y-3">
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
        </div>
      </div>

      {/* ─── KYC Documents ─────────────────────────────── */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">KYC Documents</h3>
        <p className="mb-4 text-xs text-white/40">Upload at least one document for verification</p>

        <div className="space-y-3">
          {docs.map((doc, i) => {
            const docMeta = docTypes.find((d) => d.value === doc.type);
            return (
              <div
                key={doc.type}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{docMeta?.label}</p>
                    <p className="text-[11px] text-white/40">{docMeta?.desc}</p>
                  </div>
                  {doc.uploaded && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
                      <Check className="h-3.5 w-3.5 text-green-400" />
                    </div>
                  )}
                </div>

                {doc.file ? (
                  <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 shrink-0">
                      <FileText className="h-4 w-4 text-white/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{doc.file.name}</p>
                      <p className="text-[11px] text-white/40">{(doc.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    {doc.uploaded ? (
                      <span className="text-[11px] text-green-400 shrink-0">Uploaded</span>
                    ) : doc.uploading ? (
                      <Loader2 className="h-4 w-4 text-white/50 animate-spin shrink-0" />
                    ) : (
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => uploadDoc(i)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                          <Upload className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => updateDoc(i, { file: null, uploaded: false })}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => fileRefs.current[i]?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/10 p-4 text-white/40 hover:border-white/20 hover:bg-white/5 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-xs">Click to upload (max 5MB)</span>
                  </button>
                )}

                <input
                  ref={(el) => { fileRefs.current[i] = el; }}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(i, e)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
        size="lg"
        disabled={loading || anyUploading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save & Continue"}
      </Button>
    </div>
  );
}
