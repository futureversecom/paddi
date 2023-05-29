import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { reportEvent } from 'src/utils/ga'

export const Terms = () => {
  useEffect(
    () =>
      reportEvent('page_view', {
        page_title: 'Terms',
      }),
    [],
  )

  return (
    <>
      <Helmet>
        <title>Paddi</title>
      </Helmet>
    </>
  )
}
