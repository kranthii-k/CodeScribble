"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ── Particle Field ───────────────────────────────────────────────────────────

function ParticleField({ count = 3500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.03;
      ref.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f5ff"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

// ── Wireframe Torus Knot ─────────────────────────────────────────────────────

function WireframeOrb() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.08;
      ref.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <mesh ref={ref} position={[3.5, -1, -4]}>
      <torusKnotGeometry args={[1.2, 0.35, 120, 16]} />
      <meshBasicMaterial color="#00f5ff" wireframe opacity={0.12} transparent />
    </mesh>
  );
}

// ── Outer Grid Plane ─────────────────────────────────────────────────────────

function GridPlane() {
  return (
    <gridHelper
      args={[40, 40, "#00f5ff", "#0a1628"]}
      position={[0, -6, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────

export function AntiGravityBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: "radial-gradient(ellipse at 50% 0%, #020d1f 0%, #020207 70%)",
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.1} />
        <ParticleField />
        <WireframeOrb />
        <GridPlane />
      </Canvas>
    </div>
  );
}
