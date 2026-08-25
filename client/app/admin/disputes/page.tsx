"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const disputes = [
  { id: "1", rideId: "R-101", rider: "Sneha G.", driver: "Arjun K.", reason: "Overcharged", amount: 250, status: "OPEN", date: "23 Aug 2026" },
  { id: "2", rideId: "R-098", rider: "Karan T.", driver: "Priya M.", reason: "No-show", amount: 120, status: "OPEN", date: "22 Aug 2026" },
];

export default function AdminDisputesPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Disputes</h1>

      <div className="space-y-3">
        {disputes.map((dispute) => (
          <div key={dispute.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white">{dispute.reason}</p>
                <p className="text-xs text-white/40">Ride {dispute.rideId} - {dispute.date}</p>
              </div>
              <Badge variant="warning">{dispute.status}</Badge>
            </div>

            <div className="mb-3 space-y-1 text-xs text-white/50">
              <p>Rider: {dispute.rider}</p>
              <p>Driver: {dispute.driver}</p>
              <p>Amount: ₹{dispute.amount}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">Dismiss</Button>
              <Button variant="outline" size="sm" className="flex-1">Split</Button>
              <Button size="sm" className="flex-1">Resolve</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
