import type { Vec2D } from '../types/simulation'

export const interpolate = (from: Vec2D, to: Vec2D, pct: number) => {
  const x = from.x + (to.x - from.x) * pct
  const y = from.y + (to.y - from.y) * pct
  return { x, y }
}

/**
 * Maps one range to another. e.g. from 0 - 1 to 50 - 200
 * @param {number} value - the current value
 * @param {number} inputMin - the min value of the input range
 * @param {number} inputMax - the max value of the input range
 * @param {number} outputMin - the min value of the output range
 * @param {number} outputMax - the max value of the output range
 * @param {boolean} clamp - clamp the output to never exceed outputMax
 */
export const mapRange = (
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
  clamp?: boolean,
): number => {
  // Reference:
  // https://github.com/mattdesl/canvas-sketch-util/blob/852fee9564c85d535ef82cc59f9b857b1bf08a3d/math.js#L164
  if (Math.abs(inputMin - inputMax) < Number.EPSILON) {
    return outputMin
  }

  const outVal =
    ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) +
    outputMin

  if (!clamp) {
    return outVal
  }

  return outputMax < outputMin
    ? Math.max(Math.min(outVal, outputMin), outputMax)
    : Math.max(Math.min(outVal, outputMax), outputMin)
}
