import type { CreateMUIStyled } from '@mui/material'

// From https://github.com/emotion-js/emotion/issues/2193
// Allow easy filtering props that are only used for styling and should not be passed to the DOM
const transientPropCheck: Parameters<CreateMUIStyled>[1] = {
  shouldForwardProp: (propName: string) => !propName.startsWith('$'),
}

export default transientPropCheck
