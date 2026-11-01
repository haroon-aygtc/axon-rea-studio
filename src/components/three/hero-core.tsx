import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

import { scenePalette } from "./palette";

const SPIN = 0.12;
const PARALLAX = 0.35;
const DAMPING = 3;

/** Deterministic pseudo-random generator so the scene looks the same every load. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function useRingPositions(count: number, radius: number, jitter: number, seed: number) {
  return useMemo(() => {
    const rand = seeded(seed);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = radius + (rand() - 0.5) * jitter;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (rand() - 0.5) * jitter * 0.4;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count, radius, jitter, seed]);
}

function DataRing({
  radius,
  count,
  tilt,
  speed,
  color,
  seed,
}: {
  radius: number;
  count: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
  seed: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useRingPositions(count, radius, 0.35, seed);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += Math.min(delta, 0.05) * speed;
  });
  return (
    <group rotation={tilt}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={color}
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.004, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function Dust({ count = 600 }: { count?: number }) {
  const positions = useMemo(() => {
    const rand = seeded(7);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + rand() * 6;
      const t = rand() * Math.PI * 2;
      const p = Math.acos(2 * rand() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, [count]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color={scenePalette.paper} transparent opacity={0.35} />
    </points>
  );
}

/** A horizontal ring sweeping up and down the core, like a scanner pass. */
function ScanSweep() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 0.8) * 1.5;
    const s = Math.sqrt(Math.max(0.05, 1 - (ref.current.position.y / 1.7) ** 2)) * 1.75;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.98, 1, 96]} />
      <meshBasicMaterial color={scenePalette.ember} transparent opacity={0.8} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Core() {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const g = group.current;
    if (!g) return;
    g.rotation.y += dt * SPIN;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * PARALLAX, DAMPING, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, state.pointer.x * PARALLAX * 0.5, DAMPING, dt);
    if (shell.current) shell.current.rotation.y -= dt * SPIN * 2;
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh ref={shell}>
          <icosahedronGeometry args={[1.7, 1]} />
          <meshBasicMaterial color={scenePalette.rust} wireframe transparent opacity={0.5} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.05, 0]} />
          <meshStandardMaterial
            color={scenePalette.oxide}
            emissive={scenePalette.ember}
            emissiveIntensity={0.45}
            roughness={0.3}
            metalness={0.55}
            flatShading
          />
        </mesh>
        <ScanSweep />
      </Float>
      <DataRing radius={2.5} count={120} tilt={[0.35, 0, 0.15]} speed={0.35} color={scenePalette.ember} seed={3} />
      <DataRing radius={3.1} count={160} tilt={[-0.5, 0, -0.25]} speed={-0.22} color={scenePalette.paper} seed={11} />
      <DataRing radius={3.7} count={90} tilt={[1.2, 0, 0.4]} speed={0.15} color={scenePalette.rust} seed={19} />
    </group>
  );
}

export default function HeroCore() {
  const [ready, setReady] = useState(false);
  return (
    <div className="h-full w-full" data-scene-ready={ready || undefined}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.4, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => setReady(true)}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[4, 3, 5]} intensity={40} color={scenePalette.ember} />
        <pointLight position={[-5, -2, -3]} intensity={25} color={scenePalette.rust} />
        <directionalLight position={[0, 5, 2]} intensity={0.6} color={scenePalette.paper} />
        <Core />
        <Dust />
      </Canvas>
    </div>
  );
}
