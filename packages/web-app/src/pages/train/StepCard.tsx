import { Card, Checkbox, css, styled, Typography } from '@mui/material'
import { CheckIcon, OutlineCircle } from 'src/assets/icons'
import transientPropCheck from 'src/utils/transientPropCheck'

export const StyledCard = styled(
  Card,
  transientPropCheck,
)<{ $complete: boolean }>(
  ({ theme, $complete }) => css`
    height: 245px;
    display: flex;
    cursor: pointer;
    position: relative;
    align-items: center;
    border-radius: 32px;
    flex-direction: column;
    justify-content: center;
    border-color: ${$complete
      ? theme.palette.secondary.main
      : theme.palette.background.border};
    transition: ${theme.transitions.create('border-color')};

    circle {
      transition: ${theme.transitions.create('stroke')};
    }

    :hover {
      border-color: ${theme.palette.secondary.main};

      circle {
        stroke: ${theme.palette.secondary.main};
      }
    }
  `,
)

export const StyledCheckbox = styled(Checkbox)`
  top: 8px;
  right: 8px;
  position: absolute;
`

type StepCardProps = {
  index: number
  complete: boolean
  onClick: () => void
  children: React.ReactNode
}

export const StepCard = ({
  index,
  onClick,
  children,
  complete,
}: StepCardProps) => (
  <StyledCard role="button" onClick={onClick} $complete={complete}>
    <StyledCheckbox
      disableRipple
      checked={complete}
      icon={<OutlineCircle />}
      checkedIcon={<CheckIcon />}
    />
    <Typography mb={2} variant="overline" color="primary.dark">
      Step {index}
    </Typography>
    {children}
  </StyledCard>
)
