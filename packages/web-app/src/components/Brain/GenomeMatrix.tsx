/* eslint-disable react/no-unknown-property */
import { css, styled } from '@mui/material'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import type { FC } from 'react'
import { useRef } from 'react'
import type { Group } from 'three'
import { MathUtils } from 'three'

type Props = {
  matrix: number[]
}
const Container = styled('div')(
  ({ theme }) =>
    css`
      background: ${theme.palette.divider};
      height: 100%;
    `,
)

export const GENOME_ATTRIBUTES = [
  {
    baseColor: '#ff0000',
    label: 'Colour',
    key: 'colour',
    areaX: 0,
    areaY: 3,
    areaDX: 5,
    areaDY: 5,
  },
  {
    baseColor: '#00ff00',
    label: 'Speed',
    key: 'speed',
    areaX: 20,
    areaY: 4,
    areaDX: 18,
    areaDY: 13,
  },
  {
    baseColor: '#0000ff',
    label: 'Strength',
    key: 'strength',
    areaX: 11,
    areaY: 21,
    areaDX: 13,
    areaDY: 12,
  },
  {
    baseColor: '#ff00ff',
    label: 'Endurance',
    key: 'endurance',
    areaX: 4,
    areaY: 14,
    areaDX: 11,
    areaDY: 12,
  },
  {
    baseColor: '#D4A603',
    label: 'Size',
    key: 'size',
    areaX: 13,
    areaY: 16,
    areaDX: 5,
    areaDY: 19,
  },
]
const getAttributesByRowCol = (row: number, col: number) => {
  // get att by row and col
  const selectedAtt = GENOME_ATTRIBUTES.flatMap(a => {
    const { areaX, areaDX, areaY, areaDY } = a
    const inColRange = col >= areaX && col <= areaX + areaDX
    const inRowRange = row >= areaY && row <= areaY + areaDY

    if (inColRange && inRowRange) {
      return [a]
    } else {
      return []
    }
  })

  return selectedAtt
}

const blendColors = (colors: string[]) => {
  // Convert colors from hexadecimal to RGB
  let r = 0
  let g = 0
  let b = 0

  colors.forEach(color => {
    // colrs start with # not 0x
    const rValue = parseInt(color.substring(1, 3), 16)
    const gValue = parseInt(color.substring(3, 5), 16)
    const bValue = parseInt(color.substring(5, 7), 16)

    r += rValue
    g += gValue
    b += bValue
  })

  // Calculate the average of RGB values
  r = Math.round(r / colors.length)
  g = Math.round(g / colors.length)
  b = Math.round(b / colors.length)

  // Convert RGB to hexadecimal
  const result =
    '0x' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)

  return result
}

const getPercentageOfColor = (color: string, percentage: number): number => {
  // Remove '0x' from color if present
  color = color.replace('0x', '')

  let red = parseInt(color.slice(0, 2), 16)
  let green = parseInt(color.slice(2, 4), 16)
  let blue = parseInt(color.slice(4, 6), 16)

  // Calculate percentage
  red = Math.round((red * percentage) / 100)
  green = Math.round((green * percentage) / 100)
  blue = Math.round((blue * percentage) / 100)

  // Convert RGB components back to hexadecimal
  const result = (1 << 24) | (red << 16) | (green << 8) | blue
  return result
}

const ThreeDee = ({ matrix }: Props) => {
  const gridSize = 40
  const cellSize = 1
  const cellHeight = 10

  const containerRef = useRef<Group>(null)

  useFrame(() => {
    if (!containerRef.current) return
    // containerRef.current.rotation.y += 0.005
  })
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight intensity={1} position={[0, 20, 0]} castShadow />
      <OrthographicCamera makeDefault position={[0, 45, 55]} zoom={8} />
      <OrbitControls enableZoom={false} />

      <group ref={containerRef} position={[0, 0, 0]}>
        {/* {attributes.map(a => {
          const x = a.areaX + a.areaDX / 2
          const z = a.areaY + a.areaDY / 2
          return (
            <Html
              key={a.label}
              center
              zIndexRange={[5]}
              position={[x - gridSize / 2, 0, z - gridSize / 2]}
            >
              <Div>
                <Label >{a.label}</Label>
              </Div>
            </Html>
          )
        })} */}

        {matrix.map((value, index) => {
          const row = Math.floor(index / gridSize)
          const col = index % gridSize
          const x = col - gridSize / 2
          const z = row - gridSize / 2
          const y = (value / 2) * cellHeight

          // comes from brain-stats-service.ts
          // TODO: makes this available via export and re-use
          const selectedAtts = getAttributesByRowCol(row, col)

          // if we have attributes, use those colours - otherwise revert to white
          const blendedColor = blendColors(
            selectedAtts.map(({ baseColor }) => baseColor),
          )
          const colour =
            selectedAtts.length > 0
              ? getPercentageOfColor(
                  blendedColor,
                  MathUtils.mapLinear(value, 0, 1, 30, 100),
                )
              : getPercentageOfColor(
                  '0x242424',
                  MathUtils.mapLinear(value, 0, 1, 100, 100),
                )

          return (
            <mesh
              key={`${x}-${y}-${z}`}
              position={[x, y, z]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[cellSize, value * cellHeight, cellSize]} />
              <meshStandardMaterial color={colour} />
            </mesh>
          )
        })}
      </group>
    </>
  )
}

export const GenomeMatrix: FC<Props> = ({ matrix }: Props) => {
  const normalisedMatrix = matrix.map(value => value / 9)
  return (
    <Container>
      <Canvas shadows>
        <ThreeDee matrix={normalisedMatrix} />
      </Canvas>
    </Container>
  )
}
