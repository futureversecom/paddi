import { useEffect } from 'react'
import { DescriptionBox } from 'src/components/common/DescriptionBox'
import { reportEvent } from 'src/utils/ga'
import { useAccount } from 'wagmi'

import { BrainStatsGrid } from './BrainStatsGrid'

// Keep this file for reference temporarily. TODO: Delete this file and related files.
export const Profile = () => {
  const { address } = useAccount()
  useEffect(
    () =>
      reportEvent('page_view', {
        page_title: 'Profile',
      }),
    [],
  )

  return (
    <>
      <DescriptionBox title="Profile" sx={{ my: 2 }}>
        <p>
          An ASM Brain is a type of digital asset that represents a unique Brain
          with a specific set of attributes. These attributes can include things
          like speed, colour, and other characteristics. Each Brain NFT has a
          genome matrix, which is a set of data that determines the brain&nbsp;s
          attributes. This matrix is unique to each Brain, which makes each
          Brain NFT one-of-a-kind.
        </p>
      </DescriptionBox>

      {address && <BrainStatsGrid address={address} />}
    </>
  )
}
