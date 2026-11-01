import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import type { DiscoveryCluster, DiscoveryKind } from "@/content/discovery-sample";
import { scenePalette } from "./palette";

const KIND_COLOR: Record<DiscoveryKind, string> = {
  host: scenePalette.ember,
  endpoint: scenePalette.rust,
  lib: scenePalette.paper,
  storage: "#FFC285",
  ui: "#D9C9B0",
  route: "#E06A2C",
};

interface GraphNode {
  id: string;
  label: string;
  kind: DiscoveryKind | "target";
  position: THREE.Vector3;
  hub: boolean;
}

/** Lays clusters on a sphere around the target, items around each cluster hub. */
function buildGraph(clusters: DiscoveryCluster[]) {
  const nodes: GraphNode[] = [
    { id: "target", label: "target", kind: "target", position: new THREE.Vector3(), hub: true },
  ];
  const segments: number[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  clusters.forEach((cluster, ci) => {
    const y = 1 - (ci / Math.max(1, clusters.length - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * ci;
    const hubPos = new THREE.Vector3(Math.cos(theta) * r, y * 0.8, Math.sin(theta) * r).multiplyScalar(3);
    nodes.push({ id: cluster.kind, label: cluster.label, kind: cluster.kind, position: hubPos, hub: true });
    segments.push(0, 0, 0, hubPos.x, hubPos.y, hubPos.z);
    cluster.items.forEach((item, ii) => {
      const a = (ii / cluster.items.length) * Math.PI * 2 + ci;
      const offset = new THREE.Vector3(Math.cos(a), Math.sin(a * 1.7) * 0.6, Math.sin(a)).multiplyScalar(1.1);
      const pos = hubPos.clone().add(offset);
      nodes.push({ id: `${cluster.kind}:${item}`, label: item, kind: cluster.kind, position: pos, hub: false });
      segments.push(hubPos.x, hubPos.y, hubPos.z, pos.x, pos.y, pos.z);
    });
  });
  return { nodes, segments: new Float32Array(segments) };
}

function Node({
  node,
  active,
  onHover,
}: {
  node: GraphNode;
  active: boolean;
  onHover: (id: string | null) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const color = node.kind === "target" ? scenePalette.ember : KIND_COLOR[node.kind];
  const size = node.kind === "target" ? 0.42 : node.hub ? 0.2 : 0.09;
  useFrame((_, delta) => {
    const m = ref.current;
    if (!m) return;
    const target = active ? 1.6 : 1;
    m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, target, 8, Math.min(delta, 0.05)));
  });
  return (
    <mesh
      ref={ref}
      position={node.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(node.id);
      }}
      onPointerOut={() => onHover(null)}
    >
      {node.kind === "target" ? <icosahedronGeometry args={[size, 0]} /> : <sphereGeometry args={[size, 20, 20]} />}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={active ? 1 : node.hub ? 0.5 : 0.25}
        roughness={0.4}
        flatShading={node.kind === "target"}
      />
      {(active || node.kind === "target" || node.hub) && (
        <Html center distanceFactor={9} position={[0, size + 0.28, 0]} className="pointer-events-none">
          <span
            className={
              active
                ? "whitespace-nowrap rounded-full border border-primary/50 bg-popover px-2 py-0.5 font-mono text-[11px] text-foreground"
                : "whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
            }
          >
            {node.label}
          </span>
        </Html>
      )}
    </mesh>
  );
}

function Graph({ clusters }: { clusters: DiscoveryCluster[] }) {
  const { nodes, segments } = useMemo(() => buildGraph(clusters), [clusters]);
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[segments, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={scenePalette.rust} transparent opacity={0.45} />
      </lineSegments>
      {nodes.map((n) => (
        <Node key={n.id} node={n} active={hovered === n.id} onHover={setHovered} />
      ))}
    </group>
  );
}

export default function DiscoveryGraph({ clusters }: { clusters: DiscoveryCluster[] }) {
  const [ready, setReady] = useState(false);
  return (
    <div className="h-full w-full cursor-grab active:cursor-grabbing" data-scene-ready={ready || undefined}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.5, 8.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setReady(true)}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={18} color={scenePalette.ember} />
        <pointLight position={[6, 6, 6]} intensity={30} color={scenePalette.paper} />
        <Graph clusters={clusters} />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}
