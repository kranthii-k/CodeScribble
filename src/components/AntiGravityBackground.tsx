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
        color="#6366f1"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
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
      <meshBasicMaterial color="#7c3aed" wireframe opacity={0.09} transparent />
    </mesh>
  );
}

// ── Outer Grid Plane ─────────────────────────────────────────────────────────

function GridPlane() {
  return (
    <gridHelper
      args={[40, 40, "#4338ca", "#0d0d18"]}
      position={[0, -6, 0]}
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
        background: "radial-gradient(ellipse at 50% 0%, #0f0c29 0%, #060609 70%)",
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
