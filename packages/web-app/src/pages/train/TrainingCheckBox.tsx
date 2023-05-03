import { css, styled } from '@mui/material'

const StepCheckBox = styled('div')(
  () => css`
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 2;
  `,
)
const Icon = styled('span')(
  () => css`
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 1, 'opsz' 48;
    background-color: green;
    border-radius: 100%;
    color: black;
    padding: 0;
  `,
)

export const TrainingCheckBox: React.FC = () => {
  return (
    <StepCheckBox>
      <Icon className="material-symbols-outlined">check</Icon>
    </StepCheckBox>
  )
}
