import { css, styled } from '@mui/material'
import type { FC } from 'react'
import { useBrainMetadata } from 'src/hooks/useBrainMetadata'
import transientPropCheck from 'src/utils/transientPropCheck'

interface BrainImageContainerProps {
  $fixedHeight?: string | undefined
}

const BrainImageContainer = styled(
  'div',
  transientPropCheck,
)<BrainImageContainerProps>(
  ({ $fixedHeight }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    width: 100%;
    ${$fixedHeight && `height: ${$fixedHeight};`};
  `,
)

interface BrainImageDivProps {
  $imageURL?: string | undefined
  $isCentered?: boolean
}

const BrainImageDiv = styled(
  'div',
  transientPropCheck,
)<BrainImageDivProps>(
  ({ $imageURL, $isCentered }) => css`
    width: 100%;
    height: 100%;
    ${$imageURL &&
    `background-image: url(${$imageURL});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: ${$isCentered ? 'center' : 'initial'};
    `};
  `,
)

interface BrainImageProps {
  id: number
  fixedHeight?: string
  isCentered?: boolean
}

export const BrainImage: FC<BrainImageProps> = ({
  id,
  fixedHeight,
  isCentered = true,
}) => {
  const { data } = useBrainMetadata(id)
  const imageURL = data?.image_transparent

  return (
    <>
      <BrainImageContainer $fixedHeight={fixedHeight}>
        {/* TODO: adding loading holder */}
        <BrainImageDiv $imageURL={imageURL} $isCentered={isCentered} />
      </BrainImageContainer>
    </>
  )
}
