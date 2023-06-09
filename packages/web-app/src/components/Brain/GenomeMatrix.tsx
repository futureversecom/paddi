/* eslint-disable react/no-unknown-property */
import { css, styled } from '@mui/material'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import type { FC } from 'react'
import { useRef, useState } from 'react'
import type { Group } from 'three'
import { MathUtils } from 'three'

type Props = {
  matrix: number[]
  isActive?: boolean
}
const Container = styled('div')(
  ({ theme }) =>
    css`
      height: 100%;
      background: ${theme.palette.background.transparentBlack};
    `,
)

export const getGenomeConfigByName = (key: string) => {
  return GENOME_ATTRIBUTES.flatMap(a => (a.key === key ? [a] : []))[0]
}
const GENOME_ATTRIBUTES = [
  {
    baseColor: '#EA3323',
    label: 'Colour',
    key: 'colour',
    areaX: 0,
    areaY: 3,
    areaDX: 5,
    areaDY: 5,
    order: 5,
  },
  {
    baseColor: '#7F0FC3',
    label: 'Speed',
    key: 'speed',
    areaX: 20,
    areaY: 4,
    areaDX: 18,
    areaDY: 13,
    order: 2,
  },
  {
    baseColor: '#1689F3',
    label: 'Strength',
    key: 'strength',
    areaX: 11,
    areaY: 21,
    areaDX: 13,
    areaDY: 12,
    order: 3,
  },
  {
    baseColor: '#4BA634',
    label: 'Endurance',
    key: 'endurance',
    areaX: 4,
    areaY: 14,
    areaDX: 11,
    areaDY: 12,
    order: 4,
  },
  {
    baseColor: '#DB950D',
    label: 'Size',
    key: 'size',
    areaX: 13,
    areaY: 16,
    areaDX: 5,
    areaDY: 19,
    order: 1,
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

const ThreeDee = ({ matrix, isActive }: Props) => {
  const gridSize = 40
  const cellSize = 1
  const cellHeight = 10

  const containerRef = useRef<Group>(null)
  const currentRotationSpeed = useRef<number>(0)

  useFrame(() => {
    if (!containerRef.current) return

    const targetSpeed = isActive ? 0.005 : 0
    currentRotationSpeed.current +=
      (targetSpeed - currentRotationSpeed.current) * 0.05
    containerRef.current.rotation.y += currentRotationSpeed.current
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight intensity={1} position={[0, 20, 0]} castShadow />
      <OrthographicCamera makeDefault position={[0, 45, 55]} zoom={8} />
      <OrbitControls enableZoom={false} enablePan={false} />

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
                  MathUtils.mapLinear(value, 0, 1, 90, 100),
                )
              : getPercentageOfColor(
                  // '0x242424',
                  '0xffffff',
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
  const [isActive, setIsActive] = useState<boolean>(false)
  const onPointerEnter = () => {
    setIsActive(true)
  }
  const onPointerLeave = () => {
    setIsActive(false)
  }
  return (
    <Container onMouseEnter={onPointerEnter} onMouseLeave={onPointerLeave}>
      <Canvas shadows>
        <ThreeDee matrix={normalisedMatrix} isActive={isActive} />
      </Canvas>
    </Container>
  )
}
