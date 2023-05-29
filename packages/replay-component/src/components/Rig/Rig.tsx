import { useFrame } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { MathUtils, Vector2 } from 'three'

export const Rig = ({ children }: { children: ReactNode }) => {
  const ref = useRef<any>()

  const mouse = useRef<Vector2>(new Vector2(0, 0))
  const handleMouseMove = (event: MouseEvent) => {
    event.preventDefault()
    const width = window.innerWidth
    const height = window.innerHeight

    mouse.current.x = (event.clientX / width) * 2 - 1
    mouse.current.y = -(event.clientY / height) * 2 + 1
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.y = MathUtils.lerp(
      ref.current.rotation.y,
      mouse.current.x * Math.PI * -0.05,
      0.05,
    )
    ref.current.rotation.x = MathUtils.lerp(
      ref.current.rotation.x,
      mouse.current.y * Math.PI * 0.08,
      0.05,
    )
    ref.current.position.y = MathUtils.lerp(
      ref.current.position.y,
      mouse.current.x * 1,
      0.05,
    )
  })
  return <group ref={ref}>{children}</group>
}
