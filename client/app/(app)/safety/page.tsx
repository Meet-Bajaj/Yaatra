"use client";

import { useState } from "react";
import { Shield, Phone, Plus, Trash2, Share2, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Input } from "@/components/ui/input";

const emergencyContacts = [
  { id: "1", phone: "+91 98765 43210", label: "Mom" },
  { id: "2", phone: "+91 87654 32109", label: "Dad" },
];

export default function SafetyPage() {
  const [showAddContact, setShowAddContact] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [newLabel, setNewLabel] = useState("");

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Safety</h1>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-5 w-5 text-white/50" />
          <h3 className="text-sm font-semibold text-white">Trust Profile</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-white">4.8</p>
            <p className="text-[10px] text-white/40">Rating</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">12</p>
            <p className="text-[10px] text-white/40">Rides</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">Verified</p>
            <p className="text-[10px] text-white/40">KYC Status</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Emergency Contacts</h3>
          <button onClick={() => setShowAddContact(true)} className="flex items-center gap-1 text-xs text-white/50 hover:text-white">
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Phone className="h-4 w-4 text-white/50" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{contact.label}</p>
                <p className="text-xs text-white/40">{contact.phone}</p>
              </div>
              <button className="text-white/30 hover:text-red-400 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left text-sm text-white/60 hover:bg-white/5 transition-colors">
          <Share2 className="h-4 w-4" /> Share Trip Preferences
          <ChevronRight className="ml-auto h-4 w-4" />
        </button>
        <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left text-sm text-white/60 hover:bg-white/5 transition-colors">
          <AlertTriangle className="h-4 w-4" /> Report an Issue
          <ChevronRight className="ml-auto h-4 w-4" />
        </button>
      </div>

      <button className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 py-4 text-center text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
        <AlertTriangle className="mx-auto mb-1 h-5 w-5" />
        Emergency SOS
      </button>

      <BottomSheet open={showAddContact} onClose={() => setShowAddContact(false)} title="Add Emergency Contact">
        <div className="space-y-3">
          <Input placeholder="Label (e.g. Mom)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          <Input placeholder="Phone number" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
          <Button className="w-full" onClick={() => setShowAddContact(false)}>Add Contact</Button>
        </div>
      </BottomSheet>
    </div>
  );
}
