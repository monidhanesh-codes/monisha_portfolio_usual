"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface StarFieldProps {
  density?: number;
  seed?: number;
  opacity?: number;
  className?: string;
}

// Simple Linear Congruential Generator for deterministic random numbers
function createPRNG(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const starVertexShader = `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3 aColor;
  attribute float aBaseAlpha;
  attribute float aMaxAlpha;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReducedMotion;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vSize;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size scaled by camera distance and device pixel ratio
    gl_PointSize = aSize * uPixelRatio * (300.0 / -mvPosition.z);

    // Asynchronous sinusoidal blinking
    float twinkle = 0.5 + 0.5 * sin(uTime * aSpeed + aPhase);
    
    // If prefers-reduced-motion, lock to subtle static brightness
    if (uReducedMotion > 0.5) {
      twinkle = 0.5;
    }

    // Natural twinkle between base alpha and max peak
    vAlpha = mix(aBaseAlpha, aMaxAlpha, twinkle);
    vColor = aColor;
    vSize = aSize;
  }
`;

const starFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSize;

  void main() {
    // Soft circular rendering with smooth falloff
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft edge antialiasing with delicate ambient aura for highlight stars
    float strength = 1.0 - smoothstep(0.15, 0.5, dist);
    if (vSize > 4.2) {
      strength += (1.0 - smoothstep(0.0, 0.5, dist)) * 0.25;
    }

    gl_FragColor = vec4(vColor, vAlpha * strength);
  }
`;

const cometVertexShader = `
  attribute float aAlpha;
  attribute vec3 aColor;
  varying float vAlpha;
  varying vec3 vColor;
  uniform float uOverallAlpha;

  void main() {
    vAlpha = aAlpha * uOverallAlpha;
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const cometFragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    if (vAlpha <= 0.005) discard;
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;

export default function StarField({
  density = 320,
  seed = 123,
  opacity = 1,
  className = "absolute inset-0 pointer-events-none z-0 overflow-hidden",
}: StarFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Determine particle count based on screen size & density prop
    const width = container.clientWidth || window.innerWidth;
    let particleCount = density;
    if (width < 640) {
      particleCount = Math.round(density * 0.5); // ~120-160 stars on mobile
    } else if (width < 1024) {
      particleCount = Math.round(density * 0.75); // ~200-240 stars on tablet
    }

    // Initialize Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const aspect = (container.clientWidth || window.innerWidth) / (container.clientHeight || 500);
    const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || 500);
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);

    // Color Palette Tokens
    // Soft White (#EAF1F8), Muted Blue (#AAB9D0), Cyan Accent (#72E6E8), Soft Lavender (#AAA2C8)
    const colorPalette = [
      new THREE.Color("#EAF1F8"),
      new THREE.Color("#AAB9D0"),
      new THREE.Color("#72E6E8"),
      new THREE.Color("#AAA2C8"),
    ];

    const prng = createPRNG(seed);

    // Buffers for Star Attributes
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const baseAlphas = new Float32Array(particleCount);
    const maxAlphas = new Float32Array(particleCount);

    const spreadX = 950;
    const spreadY = 550;
    const spreadZ = 450;

    for (let i = 0; i < particleCount; i++) {
      // 3D Volume Distribution with 16:9 spatial depth
      positions[i * 3] = (prng() - 0.5) * spreadX;
      positions[i * 3 + 1] = (prng() - 0.5) * spreadY;
      positions[i * 3 + 2] = (prng() - 0.5) * spreadZ;

      // Color assignment (mostly soft white/muted blue, sparse cyan/lavender)
      const colorRoll = prng();
      let chosenColor = colorPalette[0]; // 55% Soft White
      if (colorRoll > 0.82) {
        chosenColor = colorPalette[2]; // 18% Cyan Accent
      } else if (colorRoll > 0.65) {
        chosenColor = colorPalette[3]; // 17% Soft Lavender
      } else if (colorRoll > 0.35) {
        chosenColor = colorPalette[1]; // 30% Muted Blue
      }

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      // Tier Breakdown:
      // ~70% subtle stars, ~25% moderately visible stars, ~5% brighter highlight stars
      const tierRoll = prng();
      if (tierRoll > 0.95) {
        // ~5% Brighter Highlight Stars
        sizes[i] = 4.5 + prng() * 1.8;
        baseAlphas[i] = 0.35 + prng() * 0.2;
        maxAlphas[i] = 0.9 + prng() * 0.1;
        speeds[i] = 0.8 + prng() * 1.2;
      } else if (tierRoll > 0.70) {
        // ~25% Moderately Visible Stars
        sizes[i] = 2.6 + prng() * 1.5;
        baseAlphas[i] = 0.2 + prng() * 0.18;
        maxAlphas[i] = 0.7 + prng() * 0.2;
        speeds[i] = 0.5 + prng() * 1.0;
      } else {
        // ~70% Subtle Stars
        sizes[i] = 1.4 + prng() * 1.1;
        baseAlphas[i] = 0.12 + prng() * 0.15;
        maxAlphas[i] = 0.5 + prng() * 0.2;
        speeds[i] = 0.3 + prng() * 0.8;
      }

      // Random Phase for organic asynchronous twinkling
      phases[i] = prng() * Math.PI * 2;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    starGeometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    starGeometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    starGeometry.setAttribute("aBaseAlpha", new THREE.BufferAttribute(baseAlphas, 1));
    starGeometry.setAttribute("aMaxAlpha", new THREE.BufferAttribute(maxAlphas, 1));

    const starMaterial = new THREE.ShaderMaterial({
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uReducedMotion: { value: prefersReducedMotion ? 1.0 : 0.0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // ==========================================
    // RARE TINY COMET SYSTEM SETUP (1 every 15-35s)
    // ==========================================
    const cometSegs = 8;
    const cometPos = new Float32Array(cometSegs * 3);
    const cometColors = new Float32Array(cometSegs * 3);
    const cometAlphas = new Float32Array(cometSegs);

    const cometColorObj = new THREE.Color("#72E6E8");

    for (let i = 0; i < cometSegs; i++) {
      const alphaVal = Math.pow(1 - i / (cometSegs - 1), 1.8);
      cometAlphas[i] = alphaVal;
      cometColors[i * 3] = cometColorObj.r;
      cometColors[i * 3 + 1] = cometColorObj.g;
      cometColors[i * 3 + 2] = cometColorObj.b;
    }

    const cometGeometry = new THREE.BufferGeometry();
    cometGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(cometPos, 3)
    );
    cometGeometry.setAttribute(
      "aColor",
      new THREE.BufferAttribute(cometColors, 3)
    );
    cometGeometry.setAttribute(
      "aAlpha",
      new THREE.BufferAttribute(cometAlphas, 1)
    );

    const cometMaterial = new THREE.ShaderMaterial({
      vertexShader: cometVertexShader,
      fragmentShader: cometFragmentShader,
      uniforms: {
        uOverallAlpha: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const cometLine = new THREE.Line(cometGeometry, cometMaterial);
    scene.add(cometLine);

    // Comet State & Timing Variables
    let isCometActive = false;
    let cometStartTime = 0;
    let cometDuration = 1.1; // seconds
    let cometStartVec = new THREE.Vector3();
    let cometDirVec = new THREE.Vector3();
    let cometSpeed = 380;
    let cometTailLength = 45;

    // Schedule initial comet spawn (first comet at ~8-14 seconds)
    let nextCometTime = 8 + Math.random() * 6;

    const spawnComet = (currentTimeSec: number) => {
      isCometActive = true;
      cometStartTime = currentTimeSec;
      cometDuration = 0.9 + Math.random() * 0.5; // ~0.9 - 1.4s

      // Select trajectory traveling through empty hero space
      const trajectoryIndex = Math.floor(Math.random() * 4);
      if (trajectoryIndex === 0) {
        // Top right to center right (downwards-left ↙)
        cometStartVec.set(280 + Math.random() * 80, 180 + Math.random() * 60, 50);
        cometDirVec.set(-0.85, -0.52, -0.1).normalize();
      } else if (trajectoryIndex === 1) {
        // Top left to center left (downwards-right ↘)
        cometStartVec.set(-320 - Math.random() * 60, 200 + Math.random() * 50, 30);
        cometDirVec.set(0.88, -0.47, -0.05).normalize();
      } else if (trajectoryIndex === 2) {
        // Upper right diagonal high pass ↙
        cometStartVec.set(350 + Math.random() * 50, 220 + Math.random() * 40, -40);
        cometDirVec.set(-0.75, -0.66, 0.05).normalize();
      } else {
        // Upper left diagonal ↘
        cometStartVec.set(-280 - Math.random() * 80, 160 + Math.random() * 60, 20);
        cometDirVec.set(0.82, -0.57, -0.1).normalize();
      }

      cometTailLength = 40 + Math.random() * 25;
      cometSpeed = 340 + Math.random() * 120;
    };

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - startTime) * 0.001;
      starMaterial.uniforms.uTime.value = elapsed;

      // Comet logic (disabled if reduced motion is enabled)
      if (!prefersReducedMotion) {
        if (!isCometActive && elapsed >= nextCometTime) {
          spawnComet(elapsed);
        }

        if (isCometActive) {
          const cometAge = elapsed - cometStartTime;
          const progress = cometAge / cometDuration;

          if (progress >= 1.0) {
            isCometActive = false;
            cometMaterial.uniforms.uOverallAlpha.value = 0;
            // Schedule next comet in 15 to 35 seconds (RARE)
            nextCometTime = elapsed + 15 + Math.random() * 20;
          } else {
            // Smooth fade-in, quick travel, smooth fade-out
            const fadeAlpha = Math.sin(progress * Math.PI);
            cometMaterial.uniforms.uOverallAlpha.value = fadeAlpha * 0.85;

            // Compute head position
            const travelDist = progress * cometSpeed;
            const headPos = cometStartVec
              .clone()
              .add(cometDirVec.clone().multiplyScalar(travelDist));

            // Update comet segment coordinates
            const posAttr = cometGeometry.attributes.position;
            const posArray = posAttr.array as Float32Array;

            for (let i = 0; i < cometSegs; i++) {
              const segRatio = i / (cometSegs - 1);
              const segPos = headPos
                .clone()
                .sub(cometDirVec.clone().multiplyScalar(cometTailLength * segRatio));
              posArray[i * 3] = segPos.x;
              posArray[i * 3 + 1] = segPos.y;
              posArray[i * 3 + 2] = segPos.z;
            }

            posAttr.needsUpdate = true;
          }
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      starMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    };

    window.addEventListener("resize", handleResize);

    // Clean up Three.js resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      starGeometry.dispose();
      starMaterial.dispose();
      cometGeometry.dispose();
      cometMaterial.dispose();
      renderer.dispose();
    };
  }, [density, seed]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
