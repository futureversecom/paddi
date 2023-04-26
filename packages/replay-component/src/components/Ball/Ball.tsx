/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { shaderMaterial, Sphere, useTexture } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import type { MutableRefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { Group, InstancedMesh, ShaderMaterial } from 'three'
import { AdditiveBlending, Object3D, Texture, Vector3 } from 'three'
import { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh'
import { useInterval } from 'usehooks-ts'

import type { GameState } from '../Replay/Replay'

type ModelProps = {
  // We can narrow the state down to be just PlayerState in the future
  gameState: MutableRefObject<GameState>
}

const MyMaterial = shaderMaterial(
  { map: new Texture(), uProgress: 0 },
  `
varying vec2 vUv;
uniform float time;

void main()	{
  vUv = uv;
  vec4 mvPosition = vec4( position, 1.0 );
  // https://threejs.org/docs/index.html?q=shad#api/en/renderers/webgl/WebGLProgram
  mvPosition = instanceMatrix * mvPosition;
  vec4 modelViewPosition = modelViewMatrix * mvPosition;

  gl_Position = projectionMatrix * modelViewPosition;
}
`,
  `
varying vec2 vUv;
// uniform float repeats;
uniform sampler2D map;
uniform float uProgress;

void main(){
 
  vec2 uv = vec2(uProgress,0.0);
  vec2 shift= vec2(0.0,0.0);
  vec4 color = vec4(
       texture2D(map, uv).r,
       texture2D(map, uv + shift).g,
       texture2D(map, uv - shift ).b,
     
        texture2D(map, uv ).a
  );

  gl_FragColor = color;

  #include <tonemapping_fragment>
  #include <encodings_fragment>
}
`,
)

extend({ MyMaterial })

type MyMaterialImpl = {
  // repeats: number;
  uProgress: number
  map: Texture | Texture[]
} & JSX.IntrinsicElements['shaderMaterial']

declare global {
  namespace JSX {
    interface IntrinsicElements {
      myMaterial: MyMaterialImpl
    }
  }
}

extend({ InstancedUniformsMesh })

type Particle = {
  lifeTime: number
  maxLifeTime: number
  scale: number
  radians: number
  position: Vector3
  direction: Vector3
  speed: number
}

const colors = [
  [4, 0.1, 1],
  [0.5, 1, 4],
  [1, 4, 0.5],
  [1, 4, 55],
]
const getNewRandomColor = (currentColor: number[]) => {
  const filtered = colors.filter(c => c !== currentColor)
  return filtered[Math.floor(Math.random() * (filtered.length - 1))]
}
export const Ball = ({ gameState }: ModelProps) => {
  // from Unity: The particle system emits these spheres at a rate of 25/s, randomly rotated, random scale between .75 - 1.25, random lifetime between 1-2s, the pictured scale and color over time
  // Using a basic additive shader
  // colour: over time so it starts transparent white, goes red, then transparent black

  const ball = useRef<Group>(null!)
  const [isHit, setIsHit] = useState<boolean>(false)
  const [color, setColor] = useState<number[]>([10, 30, 12])
  const instancesRef = useRef<InstancedMesh>(null!)
  const matRef = useRef<ShaderMaterial>(null!)
  const particlesRef = useRef<Particle[]>([])
  const ballDirection = useRef<Vector3>(new Vector3())
  const maxParticles = 1000
  const [dummy3DObject] = useState(() => new Object3D())

  const map = useTexture(`/textures/supershot.png`)

  useEffect(() => {
    const newColor = getNewRandomColor(color)
    setColor(newColor || [10, 30, 12])
  }, [isHit])

  useInterval(
    () => {
      if (particlesRef.current.length < maxParticles) {
        const life = 0.94 + Math.random()
        particlesRef.current.push({
          lifeTime: life,
          maxLifeTime: life,
          scale: 1 + Math.random() * 1,
          radians: 0,
          position: gameState.current.frameState.ball.position.clone(),
          direction: ballDirection.current,
          speed: 0.1 + Math.random() * 0.21,
        })
      }
    },
    // Delay in milliseconds or null to stop it
    90,
  )

  const updateInstances = () => {
    // https://drei.pmnd.rs/?path=/story/misc-trail--use-trail-st
    const particles = particlesRef.current
    if (!instancesRef.current) return
    if (particles.length === 0) return

    const decay = 0.05

    const toBeRemoved: Particle[] = []

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      if (!particle) return
      particle.lifeTime -= decay

      const pct = Math.max(0, particle.lifeTime / particle.maxLifeTime)
      const targetPosition = particle.position.add(
        particle.direction.clone().multiplyScalar(particle.speed),
      )
      particle.position.set(
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
      )

      // position.set(Math.cos(elapsedTime) * 2, i, Math.sin(elapsedTime) * 2);
      // set the dummy
      dummy3DObject.position.set(
        particle.position.x,
        particle.position.y,
        particle.position.z,
      )
      dummy3DObject.scale.setScalar(particle.scale * pct)

      dummy3DObject.updateMatrixWorld()
      // update the matrix at the right index
      instancesRef.current.setMatrixAt(i, dummy3DObject.matrixWorld)

      // @ts-ignore updating
      instancesRef.current.setUniformAt('uProgress', i, pct)

      if (particle.lifeTime <= 0) {
        toBeRemoved.push(particle)
      }
    }

    instancesRef.current.count = particles.length
    instancesRef.current.instanceMatrix.needsUpdate = true
    const filteredParticles = particles.filter(p => !toBeRemoved.includes(p))
    particlesRef.current = filteredParticles
  }

  useFrame(() => {
    ball.current.position.copy(gameState.current.frameState.ball.position)

    setIsHit(!!gameState.current.frameState.paddleHit)
    updateInstances()
  })

  return (
    <>
      <group position={[0, 0.5, 0]}>
        <group ref={ball}>
          <Sphere>
            {/* @ts-ignore */}
            <meshBasicMaterial color={color} toneMapped={false} />
          </Sphere>
        </group>
        {/* we need to negatively off set it to match the original group for some reason */}
        <group position={[0, 0, 0]}>
          {/* react fiber allows lower case by design*/}
          {/* @ts-ignore */}
          <instancedUniformsMesh
            position={[0, 0, 0]}
            ref={instancesRef}
            // set a max amount of particles for the mesh
            args={[undefined, undefined, maxParticles]}
          >
            <boxBufferGeometry />

            <myMaterial
              ref={matRef}
              map={map}
              uProgress={0}
              transparent
              blending={AdditiveBlending}
            />
            {/* @ts-ignore */}
          </instancedUniformsMesh>
        </group>
      </group>
    </>
  )
}

// useGLTF.preload(modelPath);
