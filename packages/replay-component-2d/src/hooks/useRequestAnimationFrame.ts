import { useEffect, useRef } from 'react'

export const useRequestAnimationFrame = (callback: () => void) => {
  const requestRef = useRef<number>()
  const animate = () => {
    callback()
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [callback])

  return requestRef
}
