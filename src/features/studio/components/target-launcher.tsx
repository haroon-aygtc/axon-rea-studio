import { useRef, useState, type FormEvent } from "react";
import { FileArchive, FolderOpen, Globe, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useStudio } from "../store";
import { useStudioUi } from "../ui-store";

/** Directory pickers need non-standard attributes React does not type. */
const folderAttrs = { webkitdirectory: "", directory: "" } as Record<string, string>;

function SourceButton({
  icon: Icon,
  title,
  hint,
  disabled,
  onClick,
}: {
  icon: typeof FileArchive;
  title: string;
  hint: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="group flex items-center gap-4 rounded-xl border bg-surface/60 p-4 text-left transition-all hover:border-primary/50 hover:bg-accent/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-surface/60"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110 group-disabled:group-hover:scale-100">
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </button>
  );
}

/** Consent + source picker. Used inline on the scanner and inside the launcher dialog. */
export function TargetPicker({ onStarted, className }: { onStarted?: () => void; className?: string }) {
  const authorized = useStudio((s) => s.authorized);
  const setAuthorized = useStudio((s) => s.setAuthorized);
  const status = useStudio((s) => s.status);
  const error = useStudio((s) => s.error);
  const loadFiles = useStudio((s) => s.loadFiles);
  const loadSample = useStudio((s) => s.loadSample);
  const loadWebsite = useStudio((s) => s.loadWebsite);
  const fileRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const busy = status === "loading" || status === "running";
  const locked = !authorized || busy;

  function start(run: () => Promise<void>) {
    onStarted?.();
    void run();
  }

  function onPick(files: FileList | null) {
    if (files && files.length) start(() => loadFiles(files));
  }

  function onSubmitUrl(e: FormEvent) {
    e.preventDefault();
    if (url.trim()) start(() => loadWebsite(url.trim()));
  }

  return (
    <div className={cn("space-y-4", className)}>
      <label className="flex cursor-pointer gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed">
        <input
          type="checkbox"
          checked={authorized}
          onChange={(e) => setAuthorized(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--ember)]"
        />
        <span>
          I own this target or have written permission to examine it.{" "}
          <span className="text-muted-foreground">This is recorded in the run log.</span>
        </span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <SourceButton icon={FileArchive} title="Files or archive" hint="zip, apk, jar or any files" disabled={locked} onClick={() => fileRef.current?.click()} />
        <SourceButton icon={FolderOpen} title="A folder" hint="Scan a whole project" disabled={locked} onClick={() => folderRef.current?.click()} />
      </div>
      <SourceButton icon={Sparkles} title="Try the sample" hint="Scan this studio's own code" disabled={locked} onClick={() => start(loadSample)} />

      <form onSubmit={onSubmitUrl} className="flex gap-2">
        <div className="relative flex-1">
          <Globe className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={locked}
            aria-label="Website address"
            className="h-10 w-full rounded-full border bg-background/60 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-40"
          />
        </div>
        <Button type="submit" variant="outline" disabled={locked || !url.trim()}>
          {busy ? <Loader2 className="animate-spin" /> : null}
          Inspect
        </Button>
      </form>

      {!authorized && (
        <p className="text-xs text-muted-foreground">Confirm permission above to choose a target.</p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <input ref={fileRef} type="file" multiple hidden onChange={(e) => onPick(e.target.files)} />
      <input ref={folderRef} type="file" multiple hidden {...folderAttrs} onChange={(e) => onPick(e.target.files)} />
    </div>
  );
}

export function TargetLauncherDialog() {
  const open = useStudioUi((s) => s.launcherOpen);
  const setOpen = useStudioUi((s) => s.setLauncherOpen);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Choose a target</DialogTitle>
          <DialogDescription>
            Files are read in your browser and never uploaded. Website inspection downloads public
            pages directly in your browser.
          </DialogDescription>
        </DialogHeader>
        <TargetPicker className="mt-5" onStarted={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
