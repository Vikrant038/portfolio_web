"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useSettings } from "@/lib/settings";
import { isLowPowerDevice, isTouchDevice } from "@/lib/device";
import { getAudioLevel } from "@/lib/sound";

/* window-level drag so the scene is interactive without blocking clicks */
const dragState = { on: false, x: 0 };

/* ---- theme palette: reads CSS vars so light/dark both look right ---- */
type Palette = { neon: string; neon2: string; gold: string; bg: string };

function readPalette(): Palette {
  if (typeof window === "undefined")
    return { neon: "#ff8f40", neon2: "#2dd4cd", gold: "#e8c98e", bg: "#090b13" };
  const cs = getComputedStyle(document.documentElement);
  const rgb = (v: string) => {
    const m = v.trim().match(/^([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
    return m ? `rgb(${m[1]} ${m[2]} ${m[3]})` : "#b06ab3";
  };
  return {
    neon: rgb(cs.getPropertyValue("--neon")),
    neon2: rgb(cs.getPropertyValue("--neon2")),
    gold: rgb(cs.getPropertyValue("--gold")),
    bg: rgb(cs.getPropertyValue("--bg")),
  };
}

function Particles({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.012;
    ref.current.rotation.x += delta * 0.004;
  });

  useEffect(() => {
    return () => {
      if (ref.current) {
        ref.current.geometry?.dispose();
        if (Array.isArray(ref.current.material)) {
          ref.current.material.forEach((m) => m.dispose());
        } else {
          ref.current.material?.dispose();
        }
      }
    };
  }, []);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={readPalette().neon2}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ShapeField({ lowPower }: { lowPower: boolean }) {
  const group = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const scroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scroll.current =
        window.scrollY /
        Math.max(1, document.body.scrollHeight - window.innerHeight);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state, delta) => {
    if (!group.current || !knot.current) return;
    const { pointer } = state;
    group.current.position.x +=
      (pointer.x * 0.55 - group.current.position.x) * 0.04;
    group.current.position.y +=
      (pointer.y * 0.4 - group.current.position.y) * 0.04;
    group.current.position.y -= scroll.current * 0.8;
    group.current.rotation.z += delta * 0.02;
    group.current.rotation.y += delta * (lowPower ? 0.03 : 0.05);

    // idle spin + audio-reactive emissive
    if (dragState.on) {
      knot.current.rotation.y += (dragState.x - knot.current.userData.lx) * 0.008;
    } else {
      knot.current.rotation.y += delta * 0.25;
    }
    knot.current.userData.lx = dragState.x;
    const level = getAudioLevel();
    const mat = knot.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.35 + level * 0.8;
    group.current.scale.setScalar(1 + level * 0.02);
  });

  const palette = readPalette();

  return (
    <group ref={group}>
      {/* draggable hero centerpiece - gold torus knot */}
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.1}>
        <mesh ref={knot} position={[2.6, 0.35, -1.5]}>
          <torusKnotGeometry args={[0.85, 0.26, lowPower ? 90 : 160, 24]} />
          <meshStandardMaterial
            color={palette.gold}
            metalness={0.95}
            roughness={0.22}
            emissive="#7a5c22"
            emissiveIntensity={0.35}
          />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={1.2} floatIntensity={1.6}>
        <mesh position={[-3.4, 1.6, -2.5]}>
          <icosahedronGeometry args={[1.05, lowPower ? 0 : 1]} />
          <meshStandardMaterial
            color={palette.neon}
            wireframe
            emissive={palette.neon}
            emissiveIntensity={0.55}
            transparent
            opacity={0.75}
          />
        </mesh>
      </Float>

      <Float speed={1.9} rotationIntensity={0.9} floatIntensity={1.3}>
        <mesh position={[-2.4, -2.1, -1.2]}>
          <octahedronGeometry args={[0.62, 0]} />
          <meshStandardMaterial
            color={palette.neon2}
            emissive={palette.neon2}
            emissiveIntensity={0.4}
            metalness={0.6}
            roughness={0.25}
          />
        </mesh>
      </Float>

      {[
        [1.2, 2.3, -2],
        [4.1, -1.4, -3],
        [-5, -0.4, -4],
        [0.4, -2.6, -3.5],
        [4.6, 2, -4.5],
      ].map((p, i) => (
        <Float
          key={i}
          speed={1.4 + i * 0.3}
          rotationIntensity={0.4}
          floatIntensity={1.8}
        >
          <mesh position={p as [number, number, number]}>
            <sphereGeometry args={[0.09 + i * 0.035, 24, 24]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? palette.neon : palette.neon2}
              emissive={i % 2 === 0 ? palette.neon : palette.neon2}
              emissiveIntensity={0.9}
              transparent
              opacity={0.85}
            />
          </mesh>
        </Float>
      ))}

      <pointLight
        position={[4, 3, 2]}
        intensity={60}
        color={palette.neon}
        distance={18}
      />
      <pointLight
        position={[-4, -2, 1]}
        intensity={45}
        color={palette.neon2}
        distance={16}
      />
      <ambientLight intensity={0.35} />

      {!lowPower && (
        <Sparkles
          count={70}
          scale={[14, 9, 6]}
          size={2.4}
          speed={0.32}
          color={palette.neon2}
          opacity={0.5}
        />
      )}
    </group>
  );
}

export default function PortfolioScene() {
  const { theme, reducedMotion } = useSettings();
  const [visible, setVisible] = useState(true);
  const [lowPower, setLowPower] = useState(false);
  const [inHero, setInHero] = useState(true);

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Pause rendering when hero is scrolled out of view to save battery & CPU
  useEffect(() => {
    const onScroll = () => {
      setInHero(window.scrollY < window.innerHeight * 1.2);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setLowPower(isLowPowerDevice() || reducedMotion);
  }, [reducedMotion]);

  // window-level drag → scene rotation (disabled on touch to prevent scroll hijacking)
  useEffect(() => {
    if (isTouchDevice()) return;

    const down = (e: PointerEvent) => {
      dragState.on = true;
      dragState.x = e.clientX;
    };
    const move = (e: PointerEvent) => {
      if (!dragState.on) return;
      dragState.x = e.clientX;
    };
    const up = () => {
      dragState.on = false;
    };
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  const [, force] = useState(0);
  useEffect(() => {
    force((n) => n + 1);
  }, [theme]);

  const activeLoop = !reducedMotion && visible && inHero;

  return (
    <Canvas
      dpr={lowPower ? [1, 1] : [1, 1.5]}
      frameloop={reducedMotion ? "demand" : activeLoop ? "always" : "never"}
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{
        antialias: !lowPower,
        alpha: true,
        powerPreference: lowPower ? "default" : "high-performance",
        precision: lowPower ? "lowp" : "highp",
      }}
      style={{ pointerEvents: "none" }}
    >
      <ShapeField lowPower={lowPower} />
      <Particles count={lowPower ? 140 : 900} />
      <FogTint />
    </Canvas>
  );
}

/* fog that matches the active theme background */
function FogTint() {
  return <fog attach="fog" args={[readPalette().bg, 9, 20]} />;
}
