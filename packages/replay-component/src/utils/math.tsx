import type { Vec2D } from '../types/simulation'

export const interpolate = (from: Vec2D, to: Vec2D, pct: number) => {
  const x = from.x + (to.x - from.x) * pct
  const y = from.y + (to.y - from.y) * pct
  return { x, y }
}
