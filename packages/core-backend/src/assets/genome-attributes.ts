export type GenomeMapping = {
  areaX: number // X start point
  areaY: number // Y start point
  areaDX: number // X length
  areaDY: number // Y length
}

export const getAttributeValue = (
  matrix: number[][], // Genome matrix 40x40
  mapping: GenomeMapping,
  shift = 2.5, // Center offset
  alpha = 0.7, // Spread
): number => {
  const { areaX, areaY, areaDX, areaDY } = mapping
  const slice = matrix
    .slice(areaY, areaY + areaDY)
    .map(row => row.slice(areaX, areaX + areaDX))
  const total = slice.reduce(
    (acc, row) => acc + row.reduce((sum, val) => sum + val, 0),
    0,
  )
  const avg = total / (areaDX * areaDY)
  return sigmoid(alpha * (-shift + avg))
}

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x))

export const unflattenGenomeMatrix = (flatMatrix: number[]): number[][] =>
  Array.from({ length: 40 }, (_, i) => flatMatrix.slice(i * 40, i * 40 + 40))
