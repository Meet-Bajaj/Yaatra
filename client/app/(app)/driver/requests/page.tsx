"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const requests = [
  { id: "1", riderName: "Sneha G.", route: "HSR Layout to Electronic City", time: "Mon-Fri, 9:00 AM" },
  { id: "2", riderName: "Karan T.", route: "HSR Layout to Electronic City", time: "Mon-Fri, 9:00 AM" },
];

export default function DriverRequestsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Incoming Requests</h1>

      <div className="space-y-3">
        {requests.map((request) => (
          <div key={request.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                {request.riderName[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{request.riderName}</p>
                <p className="text-xs text-white/40">{request.route}</p>
              </div>
            </div>
            <p className="mb-3 text-xs text-white/40">{request.time}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <X className="h-4 w-4" /> Reject
              </Button>
              <Button size="sm" className="flex-1">
                <Check className="h-4 w-4" /> Accept
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
