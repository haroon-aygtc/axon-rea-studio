import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Boxes,
  Brain,
  Building2,
  FileText,
  FolderTree,
  GitBranch,
  Layers,
  Map,
  Package,
  Radar,
  Route as RouteIcon,
  Target,
  Users,
} from "lucide-react";

export type StudioPath =
  | "/studio"
  | "/studio/agent"
  | "/studio/practice"
  | "/studio/operations"
  | "/studio/agents"
  | "/studio/discovery"
  | "/studio/second-brain"
  | "/studio/structure"
  | "/studio/stack"
  | "/studio/architecture"
  | "/studio/data-flow"
  | "/studio/user-flow"
  | "/studio/prd"
  | "/studio/reports";

export interface StudioScreen {
  to: StudioPath;
  label: string;
  icon: LucideIcon;
  description: string;
}

export interface StudioScreenGroup {
  label: string;
  screens: StudioScreen[];
}

export const studioGroups: StudioScreenGroup[] = [
  {
    label: "Investigate",
    screens: [
      { to: "/studio", label: "Scanner", icon: Radar, description: "Load a target and run the six-agent scan." },
      { to: "/studio/agent", label: "REA agent", icon: Bot, description: "Ask questions and get verified evidence." },
      { to: "/studio/practice", label: "Practice", icon: Target, description: "Grade the agent on your own challenges." },
    ],
  },
  {
    label: "Visualize",
    screens: [
      { to: "/studio/operations", label: "Operations floor", icon: Building2, description: "Watch agents move data through the rooms." },
      { to: "/studio/agents", label: "All agents", icon: Users, description: "Every agent's output and the live event stream." },
      { to: "/studio/discovery", label: "Discovery map", icon: Map, description: "Hosts, endpoints and libraries mapped out." },
      { to: "/studio/second-brain", label: "Second brain", icon: Brain, description: "A neural atlas of everything learned." },
    ],
  },
  {
    label: "Blueprint",
    screens: [
      { to: "/studio/structure", label: "Structure", icon: FolderTree, description: "Folder tree and file roles." },
      { to: "/studio/stack", label: "Stack", icon: Package, description: "Languages, frameworks and libraries." },
      { to: "/studio/architecture", label: "Architecture", icon: Layers, description: "Layers and how they connect." },
      { to: "/studio/data-flow", label: "Data flow", icon: GitBranch, description: "From input to storage and network." },
      { to: "/studio/user-flow", label: "User flow", icon: RouteIcon, description: "Screens and the paths between them." },
      { to: "/studio/prd", label: "PRD", icon: FileText, description: "A product spec drafted from evidence." },
    ],
  },
  {
    label: "Deliver",
    screens: [
      { to: "/studio/reports", label: "Reports", icon: Boxes, description: "Threats, prototype and exports." },
    ],
  },
];

export const studioScreens: StudioScreen[] = studioGroups.flatMap((g) => g.screens);

export function findScreen(to: StudioPath): StudioScreen {
  const screen = studioScreens.find((s) => s.to === to);
  if (!screen) throw new Error(`Unknown studio screen ${to}`);
  return screen;
}

/** Shared head() metadata for studio screens. */
export function studioHead(to: StudioPath) {
  const s = findScreen(to);
  const title = `${s.label} — REA Studio`;
  return {
    meta: [
      { title },
      { name: "description", content: s.description },
      { property: "og:title", content: title },
      { property: "og:description", content: s.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
