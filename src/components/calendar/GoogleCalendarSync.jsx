import React, { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function GoogleCalendarSync({
  custodyDays,
  currentMonth,
  onClose,
  onImported,
}) {
  const [calendarId, setCalendarId] = useState("");
  const [loading, setLoading] = useState(false);

  const monthStr = format(currentMonth, "MMMM yyyy");

  const handleImport = () => {
    setLoading(true);

    // 👉 SIMULACIÓN SIMPLE (sin base44)
    const days = [];
    let current = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );

    for (let i = 0; i < 30; i++) {
      const dateStr = format(current, "yyyy-MM-dd");

      days.push({
        date: dateStr,
        with_whom: i % 2 === 0 ? "dad" : "mom",
        notes: "Imported schedule",
      });

      current.setDate(current.getDate() + 1);
    }

    // 👉 guardar en localStorage
    const existing = JSON.parse(localStorage.getItem("custodyDays") || "[]");

    const merged = [...existing];

    days.forEach((d) => {
      const index = merged.findIndex((x) => x.date === d.date);
      if (index >= 0) {
        merged[index] = { ...merged[index], ...d };
      } else {
        merged.push({ id: Date.now() + Math.random(), ...d });
      }
    });

    localStorage.setItem("custodyDays", JSON.stringify(merged));

    setLoading(false);
    onImported?.();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">Google Calendar Sync</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Calendar ID</Label>
            <Input
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              placeholder="yourcalendar@gmail.com"
              className="mt-1"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Importing for {monthStr}
          </p>

          <Button onClick={handleImport} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            {loading ? "Importing..." : "Import Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
