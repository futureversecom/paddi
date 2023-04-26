import { useEffect } from 'react'
import { DescriptionBox } from 'src/components/common/DescriptionBox'
import { reportEvent } from 'src/utils/ga'

export const Docs = () => {
  useEffect(
    () =>
      reportEvent('page_view', {
        page_title: 'Docs',
      }),
    [],
  )
  return (
    <DescriptionBox title="Docs" sx={{ my: 2 }}>
      <p>This is where you can find documentation related to this game.</p>
      <p>🚧 Building in progress... 🚧</p>
    </DescriptionBox>
  )
}
