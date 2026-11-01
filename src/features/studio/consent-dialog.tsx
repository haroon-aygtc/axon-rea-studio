import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConsentDialogProps {
  open: boolean;
  onDecide: (allowed: boolean) => void;
}

const shared = [
  "Your question and the scan summary",
  "File excerpts the agent asks to read",
  "Results of the tools it runs",
];

export function ConsentDialog({ open, onDecide }: ConsentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onDecide(false)}>
      <DialogContent hideClose>
        <DialogHeader>
          <div className="mb-2 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <DialogTitle>Use REA AI on this target?</DialogTitle>
          <DialogDescription>
            Your files are never uploaded in full. To answer, the following is sent to the AI
            provider. Only continue if you are allowed to share these excerpts.
          </DialogDescription>
        </DialogHeader>
        <ul className="mt-4 space-y-2 text-sm">
          {shared.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => onDecide(false)}>
            Keep it local
          </Button>
          <Button variant="ember" onClick={() => onDecide(true)}>
            Share and continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
