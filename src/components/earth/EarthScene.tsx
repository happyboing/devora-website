import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Devora's "Earth": a globe built entirely in the browser.
 *
 * Rather than fetching a photo texture (the site is self-hosted and has to work
 * offline), the landmasses are drawn from a small set of approximate continent
 * outlines into an offscreen equirectangular mask, then sampled with a Fibonacci
 * sphere. Every sample that lands on land becomes a glowing dot, so the result
 * reads as a planet while adding almost nothing to the bundle.
 *
 * The globe holds the centre of the screen and turns on its own axis; the
 * pointer only nudges its tilt, so it stays alive without ever wandering off.
 */

const RADIUS = 1.6
const SAMPLES = 12000
const MASK_W = 1024
const MASK_H = 512

/** Approximate continent outlines as [longitude, latitude] rings. */
const CONTINENTS: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  // North America
  [
    [-168, 66], [-152, 71], [-128, 70], [-95, 73], [-78, 72], [-62, 60], [-55, 50],
    [-66, 45], [-75, 37], [-81, 26], [-90, 29], [-97, 26], [-105, 22], [-115, 30],
    [-124, 40], [-130, 53], [-140, 60], [-168, 66],
  ],
  // Greenland
  [[-58, 83], [-30, 83], [-20, 76], [-22, 70], [-40, 60], [-50, 60], [-58, 70], [-58, 83]],
  // South America
  [
    [-81, 12], [-70, 11], [-60, 10], [-50, 0], [-35, -6], [-38, -16], [-48, -25],
    [-58, -34], [-63, -42], [-70, -52], [-75, -52], [-72, -40], [-71, -25],
    [-76, -14], [-81, -4], [-81, 12],
  ],
  // Africa
  [
    [-17, 15], [-16, 22], [-10, 30], [0, 36], [10, 37], [25, 32], [35, 31], [43, 12],
    [51, 11], [45, -2], [41, -16], [33, -26], [26, -34], [18, -34], [12, -18],
    [9, -1], [3, 5], [-8, 5], [-13, 10], [-17, 15],
  ],
  // Madagascar
  [[43, -12], [50, -15], [50, -25], [44, -25], [43, -12]],
  // Eurasia
  [
    [-10, 36], [-9, 43], [-2, 48], [4, 52], [8, 57], [12, 55], [20, 55], [30, 60],
    [30, 70], [60, 72], [90, 76], [120, 74], [140, 72], [160, 68], [170, 60],
    [160, 55], [142, 45], [130, 35], [122, 32], [110, 20], [105, 10], [100, 3],
    [95, 15], [88, 21], [80, 15], [73, 20], [60, 25], [50, 30], [45, 40], [40, 45],
    [30, 45], [18, 40], [12, 38], [2, 42], [-10, 36],
  ],
  // British Isles
  [[-8, 50], [2, 51], [0, 58], [-6, 58], [-8, 50]],
  // Japan
  [[130, 32], [141, 36], [145, 44], [141, 44], [133, 34], [130, 32]],
  // Indonesia
  [[95, 5], [118, 0], [130, -2], [140, -6], [130, -9], [115, -9], [100, 0], [95, 5]],
  // Philippines
  [[120, 18], [124, 12], [126, 7], [122, 6], [120, 14], [120, 18]],
  // Australia
  [
    [114, -22], [122, -17], [130, -12], [137, -12], [142, -11], [146, -19],
    [153, -28], [150, -37], [141, -38], [131, -32], [120, -34], [115, -34], [114, -22],
  ],
  // Aotearoa / New Zealand
  [[166, -46], [175, -41], [178, -37], [172, -34], [166, -40], [166, -46]],
  // Antarctica
  [[-180, -63], [180, -63], [180, -90], [-180, -90]],
]

/** Rasterises the continent rings into a flat land/sea mask. */
function buildLandMask(): Uint8ClampedArray | null {
  const canvas = document.createElement('canvas')
  canvas.width = MASK_W
  canvas.height = MASK_H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, MASK_W, MASK_H)
  ctx.fillStyle = '#fff'

  for (const ring of CONTINENTS) {
    ctx.beginPath()
    ring.forEach(([lon, lat], index) => {
      const x = ((lon + 180) / 360) * MASK_W
      const y = ((90 - lat) / 180) * MASK_H
      if (index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.fill()
  }

  return ctx.getImageData(0, 0, MASK_W, MASK_H).data
}

/** Distributes points on a sphere and keeps only the ones over land. */
function makeLandPoints(): Float32Array {
  const mask = buildLandMask()
  const points: number[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < SAMPLES; i += 1) {
    const y = 1 - (i / (SAMPLES - 1)) * 2
    const ring = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    const x = Math.cos(theta) * ring
    const z = Math.sin(theta) * ring

    if (mask) {
      const lat = (Math.asin(y) * 180) / Math.PI
      const lon = (Math.atan2(z, x) * 180) / Math.PI
      const px = Math.floor(((lon + 180) / 360) * MASK_W) % MASK_W
      const py = Math.floor(((90 - lat) / 180) * MASK_H)
      if (py < 0 || py >= MASK_H) continue
      if (mask[(py * MASK_W + px) * 4] < 128) continue
    }

    points.push(x * RADIUS, y * RADIUS, z * RADIUS)
  }

  return new Float32Array(points)
}

/** Soft round sprite so each land sample reads as a glowing dot. */
function makeDotTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.45, 'rgba(255,255,255,0.85)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** Ring-shaped halo: transparent through the middle, bright around the limb. */
function makeGlowTexture(): THREE.Texture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(255,255,255,0)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,0)')
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.95)')
    gradient.addColorStop(0.62, 'rgba(255,255,255,0.32)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function Globe() {
  const group = useRef<THREE.Group>(null)
  const spin = useRef(0)

  const geometry = useMemo(() => {
    const buffer = new THREE.BufferGeometry()
    buffer.setAttribute('position', new THREE.BufferAttribute(makeLandPoints(), 3))
    return buffer
  }, [])

  const dotTexture = useMemo(makeDotTexture, [])
  const glowTexture = useMemo(makeGlowTexture, [])

  useFrame((state, delta) => {
    const globe = group.current
    if (!globe) return

    spin.current += delta * 0.09

    globe.rotation.y = spin.current
    globe.rotation.x = THREE.MathUtils.damp(globe.rotation.x, 0.22 + state.pointer.y * 0.12, 3, delta)
    globe.rotation.z = THREE.MathUtils.damp(globe.rotation.z, -0.16 - state.pointer.x * 0.08, 3, delta)
  })

  return (
    <group ref={group}>
      {/* Dark core gives the globe a solid body so far-side dots stay hidden. */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.985, 64, 64]} />
        <meshStandardMaterial color="#1a0b16" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Glowing land dots */}
      <points geometry={geometry}>
        <pointsMaterial
          map={dotTexture}
          color="#ffd2e4"
          size={0.022}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Pink atmospheric halo */}
      <sprite position={[0, 0, -0.3]} scale={[RADIUS * 4.1, RADIUS * 4.1, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#e0427c"
          transparent
          opacity={0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* Cool secondary halo keeps the icy-blue accent alive */}
      <sprite position={[0, 0, -0.5]} scale={[RADIUS * 5.6, RADIUS * 5.6, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#5ed6ff"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[3.2, 2.4, 3]} intensity={22} color="#ffd2e4" distance={14} />
      <pointLight position={[-3.4, -1.8, 2]} intensity={18} color="#5ed6ff" distance={14} />
      <Globe />
    </>
  )
}

/**
 * Lazy entry point. Kept as a default export so the wrapper can pull it in with
 * `React.lazy`, matching the pattern used by the rest of the site.
 */
export default function EarthScene() {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.75], fov: 42 }}
    >
      <Scene />
    </Canvas>
  )
}
