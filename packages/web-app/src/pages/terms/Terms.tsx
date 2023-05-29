import { Typography } from '@mui/material'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ScrollRestoration } from 'react-router-dom'
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
      <Typography variant="h1">Paddi Website Terms of Use</Typography>
      <br />
      <ScrollRestoration />
      <p>
        These Terms of Use govern your use of our website, located at
        https://paddi.alteredstatemachine.xyz/. This website is an interface
        allowing participants to experience the ASM AI Protocol proof of concept
        by way of Paddi experience. Further, Paddi is not intended for
        commercial gains. By accessing or using our website, you agree to be
        bound by these Terms of Use and our Privacy Policy. If you do not agree
        with any part of these terms, please do not use our website.
      </p>
      <Typography variant="h2">Definitions</Typography>
      <br />
      <p>
        <strong>Futureverse</strong> is a New Zealand Limited Liability Company.
        <br />
        <br />
        <strong>Altered State Machine (ASM)</strong> is a New Zealand Limited
        Liability Company.
        <br />
        <br />
        <strong>The Root Network (TRN)</strong> is a public decentralized
        blockchain for the Futureverse ecosystem.
        <br />
        <br />
        <strong>Porcini</strong> is The Root Network’s blockchain testnet. Note,
        all assets on Porcini are test assets and don’t hold real value.
        <br />
        <br />
        <strong>Paddi</strong> is a proof-of-concept tech demonstration for the
        ASM AI Protocol.
        <br />
        <br />
        <strong>Website</strong> refers to the internet website hosted at
        https://paddi.alteredstatemachine.xyz/, operated by Futureverse.
        <br />
        <br />
        <strong>ASTO</strong> on Paddi is a cryptocurrency by ASM as an ERC20
        token on TRN Porcini and are test asset.
        <br />
        <br />
        <strong>ASM Brains (Brain)</strong> is a collection of digital
        functional assets expressed as NFTs utilizing blockchain technologies
        for Paddi and the purposes of https://paddi.alteredstatemachine.xyz/.
        The ASM Brains on Paddi are test assets on Porcini.
        <br />
        <br />
        <strong>ASM AI PROTOCOL</strong> is a decentralized protocol providing
        services relating to ASTO, A.I., NFTs and other functions, and made
        available publicly on the internet.
        <br />
        <br />
      </p>
      <Typography variant="h2">General</Typography>
      <p>
        Use of Content a. All content on our website, including but not limited
        to text, images, videos, graphics, logos, and software, is the property
        of Futureverse and is protected by applicable intellectual property
        laws. b. You may access and view the content on our website solely for
        personal, non-commercial use. Any unauthorized use, reproduction,
        distribution, or modification of the content is strictly prohibited.
      </p>
      <Typography variant="h2">Third-Party Links</Typography>
      <p>
        Our website may contain links to third-party websites or resources that
        are not owned or controlled by Futureverse. We are not responsible for
        the content or availability of these external websites. The inclusion of
        any links does not imply our endorsement or association with the linked
        website.
      </p>
      <Typography variant="h2">Updates</Typography>
      <p>
        We may update or amend these Terms from time to time. Any amendments or
        modifications to these terms will be made at this URL. Where permitted
        by law, such amendments and modifications to these Terms shall also
        constitute part of these Terms.
      </p>
      <Typography variant="h2">Limitations of liability</Typography>
      <p>
        TO THE EXTENT PERMITTED BY LAW, AND EXCEPT AS EXPRESSLY STATED IN THESE
        TERMS, FUTUREVERSE DOES NOT MAKE ANY REPRESENTATIONS OR WARRANTIES AND
        EXPLICITLY DISCLAIMS ALL OTHER REPRESENTATIONS AND WARRANTIES INCLUDING
        WITHOUT LIMITATION, IN RELATION TO ASTO OR ANY ASSOCIATED SMART
        CONTRACTS, WHETHER EXPRESS, IMPLIED, WRITTEN, ORAL OR STATUTORY,
        INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
        PARTICULAR PURPOSE, AND WARRANTIES OTHERWISE ARISING FROM A COURSE OF
        DEALING, COURSE OF PERFORMANCE OR USAGE OF TRADE.
        <br />
        <br />
        To the maximum extent permitted by law, Futureverse will not be liable
        under any circumstances for any indirect, incidental, consequential, or
        other non-direct damages of any kind or for any special, additional or
        similar damages.
        <br />
        <br />
        <strong>Severability:</strong> If any provision contained in these Terms
        is held to be invalid or unenforceable by any competent authority, all
        other provisions of these Terms will remain in full force and effective
        and will not in any way be impaired.
        <br />
        <br />
        <strong>Waiver:</strong> A failure to enforce and provision of these
        Terms shall not constitute a waiver of such provision unless it is in
        writing and signed by the party providing the waiver.
        <br />
        <br />
        <strong>Governing law:</strong> These Terms are governed by New Zealand
        law.
        <br />
        <br />
        If you have any questions or concerns regarding these Terms of Use,
        please contact us at{' '}
        <a href="mailto:privacy@futureverse.com">privacy@futureverse.com</a>.
        <br />
        <br />
      </p>
    </>
  )
}
