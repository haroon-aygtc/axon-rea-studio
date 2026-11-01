import type { LucideIcon } from "lucide-react";
import {
  Binary,
  Bot,
  FileText,
  GitBranch,
  Layers,
  Map,
  Radar,
  ShieldAlert,
  Target,
  Upload,
  MessageSquareText,
  BadgeCheck,
} from "lucide-react";

export interface Capability {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
  /** Grid span on large screens for the bento layout. */
  wide?: boolean;
}

export const capabilities: Capability[] = [
  {
    icon: Bot,
    title: "REA investigator",
    description:
      "Ask a question in plain words. The agent searches, reads and traces your files, then answers with quotes it has checked against the source.",
    tag: "agent",
    wide: true,
  },
  {
    icon: Radar,
    title: "Deep scan",
    description: "Fingerprints stacks, routes, endpoints, storage and secrets in seconds.",
    tag: "scan",
  },
  {
    icon: Map,
    title: "Memory map",
    description: "Every host, library and screen text the target touches, linked in one map.",
    tag: "map",
  },
  {
    icon: Layers,
    title: "Architecture & structure",
    description: "Layered diagrams and folder trees rebuilt from what the code actually does.",
    tag: "design",
  },
  {
    icon: GitBranch,
    title: "Data & user flow",
    description: "Follow data from input to storage and the paths a user takes through screens.",
    tag: "flow",
  },
  {
    icon: FileText,
    title: "PRD & prototype",
    description:
      "Draft a product spec and click through a low-fidelity prototype of the target, ready to export.",
    tag: "reports",
    wide: true,
  },
  {
    icon: ShieldAlert,
    title: "Threat review",
    description: "Risky patterns, exposed keys and unsafe messaging flagged with evidence.",
    tag: "security",
  },
  {
    icon: Binary,
    title: "Binary peek",
    description: "Headers, strings and hex views for compiled files and unknown blobs.",
    tag: "binary",
  },
  {
    icon: Target,
    title: "Practice arena",
    description: "Write challenges on your own code and grade the agent with private answer keys.",
    tag: "practice",
    wide: true,
  },
];

export interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const steps: Step[] = [
  {
    icon: Upload,
    title: "Load a target",
    description: "Drop a folder or file, or point at a public website. Everything is read in your browser.",
  },
  {
    icon: MessageSquareText,
    title: "Ask a question",
    description: "“Where is the high score saved?” The agent plans, searches and reads only what it needs.",
  },
  {
    icon: BadgeCheck,
    title: "Get verified answers",
    description: "Every claim comes with a quote that is checked against the real file before you see it.",
  },
];

export const marqueeTerms = [
  "fingerprint",
  "trace",
  "evidence",
  "hex",
  "strings",
  "routes",
  "endpoints",
  "storage",
  "threats",
  "PRD",
  "data flow",
  "prototype",
];
