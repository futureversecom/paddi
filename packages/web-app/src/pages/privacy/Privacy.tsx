import { Typography } from '@mui/material'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ScrollRestoration } from 'react-router-dom'
import { reportEvent } from 'src/utils/ga'

export const Privacy = () => {
  useEffect(
    () =>
      reportEvent('page_view', {
        page_title: 'Privacy',
      }),
    [],
  )

  return (
    <>
      <Helmet>
        <title>Paddi</title>
      </Helmet>
      <Typography variant="h1">Privacy Policy</Typography>
      <br />
      <ScrollRestoration />
      <p>
        This Privacy Policy governs the collection and use of personal
        information by Futureverse Corporation LTD (Futureverse Corporation, we,
        us or our).
      </p>
      <Typography variant="h2">Your Privacy Rights</Typography>
      <br />
      1. Futureverse Corporation is committed to complying with its obligations
      under the New Zealand Privacy Act 2020 (Privacy Act) when dealing with
      your personal information. Any personal information we collect and hold
      will be stored, used and disclosed in accordance with the Privacy Act and
      this Privacy Policy.
      <br />
      <br />
      2. In addition to our privacy obligations under the Privacy Act, to the
      extent that we collect personal information about individuals residing in
      the European Union (EU) or the United Kingdom (UK), we are a data
      controller for the purpose of the General Data Protection Regulation (EU)
      2016/679 (GDPR) and UK General Data Protection Act (UKGDPR).
      <br />
      <br />
      3. This Privacy Policy should be read in conjunction with any applicable
      terms and conditions relating to the use of and access to our website
      <a href="HTTPS://FUTUREVERSE.COM/">HTTPS://FUTUREVERSE.COM/</a> (Website),
      or subdomains thereof. The Futureverse and associated digital art or game
      items represented as non-fungible tokens on public blockchain networks
      (NFTs), along with our other products and/or services (collectively
      referred to in this policy as Services).
      <br />
      <br />
      4. If you have any questions regarding this Privacy Policy or wish to
      access or amend the personal information that we hold about you, please
      contact us at
      <a href="mailto:privacy@futureverse.com">PRIVACY@FUTURVERSE.COM.</a>
      <br />
      <br />
      <Typography variant="h2">Acceptance of this privacy policy</Typography>
      <br />
      5. You acknowledge that you have read and understood this Privacy Policy,
      and authorise us to collect, use, disclose and retain your personal
      information as described in this Privacy Policy when you access or use any
      of our Services, or otherwise provide us with any personal information.
      Amendments to this privacy policy
      <br />
      <br />
      6. We may amend and update this Privacy Policy from time to time by
      posting a revised version on our Websites. We will take reasonable steps
      to notify you in advance of any changes which are significant or will
      impact on your privacy rights.
      <br />
      <br />
      7. By using our Services after such notice period, you will be deemed to
      have accepted the updates to this Privacy Policy. If you do not agree to
      any change, you must immediately notify us and stop using and/or accessing
      our Services.
      <br />
      <br />
      <Typography variant="h2">
        Why do we collect personal information?
      </Typography>
      <br />
      8. Futureverse Corporation collects, uses and discloses personal
      information to provide you with access to and use of our Services,
      including but not limited to, providing Futureverse and associated NFTs,
      to market and promote Futureverse Corporation and our Services, to develop
      and improve our Services, to manage our workforce and to meet our legal
      obligations. Lawful basis for processing your personal information
      <br />
      <br />
      8.1 The legal basis on which we process your personal information is as
      follows:
      <br />
      <br />
      a. Where you have given your consent: This applies where you have freely
      given an informed, specific and unambiguous indication that we are
      permitted to collect and process your personal information. At any time,
      you may revoke your consent to the processing of some or all of your
      personal information by:
      <br />
      <br />
      i. emailing our data protection officer; and/or
      <br />
      <br />
      ii. using the “unsubscribe” function in any communication that we send to
      you.
      <br />
      <br />
      b. If you revoke your consent, we may need to stop providing you with
      services if consent is the only legal basis for our processing of your
      personal information. The withdrawal of your consent will not affect
      processing of personal information that occurs before you notify us that
      you have withdrawn your consent. Performance of a contract: This applies
      if processing your personal information is necessary for the performance
      of a contract you are a party to. For example, if we are providing you
      with goods or Services on the basis of our standard terms and conditions.
      <br />
      <br />
      a. For our legitimate business interests: This applies where the
      processing of your personal information is necessary for us to:
      <br />
      <br />
      i. service our clients and manage our staff, and community.
      <br />
      <br />
      ii. conduct market research and analysis to help us improve and customise
      our Services; and
      <br />
      <br />
      iii. perform marketing and development activities (unless your consent is
      required for such activities).
      <br />
      <br />
      <Typography variant="h2">
        What personal information do we collect?
      </Typography>
      <br />
      9. Your personal information will be collected and held by Futureverse
      Corporation Limited, 17 South Street, Newton, Auckland CBD, 1010, New
      Zealand.
      <br />
      <br />
      <Typography variant="h2">
        Personal Information for a specified purpose
      </Typography>
      <br />
      10. The type of personal information that we collect will depend on the
      purpose for which it is collected, and the Services you have requested,
      but may include:
      <br />
      <br />
      10.1 name and contact details, including your email address, phone number
      and postal address;
      <br />
      <br />
      10.2 your associated usernames or aliases;
      <br />
      <br />
      10.3 your blockchain address, which may become associated with personal
      information;
      <br />
      <br />
      10.4 Website user data, collected when you visit our Websites. Website
      user data may include your IP address, cookies, device information, unique
      device identifiers, operating system and version and mobile network
      information.
      <br />
      <br />
      10.5 information necessary to fulfil any regulatory compliance obligations
      we may have, including but not limited to, in the event that we are
      required to comply with the Anti-Money Laundering and Countering Financing
      of Terrorism Act 2009; and
      <br />
      <br />
      10.6 any other information that we may require from time to time for the
      purposes set out in this Privacy Policy.
      <br />
      <br />
      <Typography variant="h2">
        Special categories of personal information
      </Typography>
      <br />
      11. Generally, we do not collect any special categories of personal
      information, such as information that reveals racial or ethnic origin,
      political opinions, religious or philosophical belief, trade union
      membership, genetic data, biometric data, health status, sex life or
      sexual orientation. However, occasionally this type of information may be
      relevant to our interactions with you. If such information is required, we
      will only collect and process this type of personal information with your
      explicit consent and for the purposes set out in this Privacy Policy.
      <br />
      <br />
      <Typography variant="h2">
        How and why do we collect information about you
      </Typography>
      <br />
      12. Most of the information we process will be collected directly from
      you, when you:
      <br />
      <br />
      12.1 access one of our digital platforms like our Websites, or any website
      associated with our projects, such as HTTPS://FUTUREVERSE.COM
      <br />
      <br />
      12.2 access any social media platforms, rooms or servers that we have
      administrative rights to
      <br />
      <br />
      12.3 subscribe to any newsletter or publication of Futureverse
      Corporation;
      <br />
      <br />
      12.4 purchase merchandise, products or services from us, through us or
      through third-party services;
      <br />
      <br />
      12.5 participate in, or otherwise attend, any event, marketing campaign,
      competition, promotion or similar event run by Futureverse Corporation;
      <br />
      <br />
      12.6 provide details to us in any feedback or contact us form;
      <br />
      <br />
      12.7 otherwise contact us through social media, email, telephone or other
      means;
      <br />
      <br />
      12.8 apply for employment or a volunteer position with us; or we are
      required to do so by law.
      <br />
      <br />
      13. If you provide us with personal information relating to another
      individual, e.g., a joint applicant, you warrant and represent to us that
      you have obtained that individual's authorisation to provide us with their
      personal information and have informed them of the terms of this Privacy
      Policy.
      <br />
      <br />
      14. When you use our Websites, we may collect non-personally identifiable
      information that is sent to us by your computer, mobile device or other
      access device. The information that is sent to us may include your
      computer IP address, referral URL, geo-location and data about the
      webpages that you access.
      <br />
      <br />
      15. If you choose not to provide personal information to us on request you
      may be ineligible to participate in certain events or competitions run by
      Futureverse Corporation, or we may be unable to provide certain Services
      to you, or it may affect the quality of those Services. Please contact us
      if you are usure what information is important and how this might affect
      you.
      <br />
      <br />
      16. We will only use and disclose your personal information in accordance
      with your authorisation and/or for the purposes set out in this Privacy
      Policy, which shall include:
      <br />
      <br />
      a. to provide you with access to and use of our Services, including but
      not limited to, helping you view, explore, create or modify NFTs, using
      our tools and, at your own discretion, connect directly with us or others
      to purchase, sell, or transfer NFTs on public blockchain networks;
      <br />
      <br />
      b. use in accordance with permissions granted through your Futureverse
      Account;
      <br />
      <br />
      c. to communicate with you (for example to provide customer support or to
      ask you for feedback about our Services);
      <br />
      <br />
      d. to facilitate your use of our Services and help provide a more
      personalised experience;
      <br />
      <br />
      e. to facilitate, develop, run and improve events, and competitions
      operated by Futureverse Corporation;
      <br />
      <br />
      f. where you qualify for other assets in the future from other parts of
      our eco system (including the Futureverse) with our affiliates and related
      companies so that they can communicate with you regarding those other
      assets, allocations for air drops etc;
      <br />
      <br />
      g. to research and help improve and enhance our Services;
      <br />
      <br />
      h. to undertake regulatory compliance and administrative functions
      associated with our business;
      <br />
      <br />
      i. to conduct market analysis and perform data analytics on customer
      behaviour and insights in relation to our Services;
      <br />
      <br />
      j. to comply with any legal obligations or as otherwise permitted by the
      Privacy Act 2020;
      <br />
      <br />
      k. subject to you providing your consent (in accordance with the
      Unsolicited Electronic Messages Act 2007), sending you electronic messages
      to promote and market our Services; and
      <br />
      <br />
      l. for any other purpose expressly authorised by you.
      <br />
      <br />
      17. Where you consent to us using your personal information for marketing
      and promotional communications, you can opt out at any time by notifying
      us at <a href="mailto:privacy@futureverse.com">
        PRIVACY@FUTURVERSE.COM
      </a>{' '}
      or by clicking the unsubscribe function included in any of our marketing
      communications.
      <br />
      <br />
      <Typography variant="h2">
        Who we may disclose your personal information to
      </Typography>
      <br />
      18. In carrying out the purposes set out above, we may disclose your
      personal information to:
      <br />
      <br />
      a. any subsidiaries, joint ventures, or other companies under our common
      control (Affiliates), in which case we will require our Affiliates to
      honour this Privacy Policy;
      <br />
      <br />
      b. any service providers that we have engaged to provide a service to us
      in relation to our Services, such as third parties who provide us with IT,
      marketing or customer support services;
      <br />
      <br />
      c. our professional advisors, including but not limited to, accountants,
      insurers and lawyers;
      <br />
      <br />
      d. any other person or organisation that you have authorised us to
      disclose your information to; and/or
      <br />
      <br />
      e. government departments, regulators, and any other third party where
      such disclosure is permitted under the Privacy Act and/or any other
      applicable law.
      <br />
      <br />
      <Typography variant="h2">Transfer of information overseas</Typography>
      <br />
      19. We generally hold your information in New Zealand. However, certain
      personal information may be transferred and/or stored outside of New
      Zealand by our third party service providers or staff or contractors
      working remotely. If we need to disclose your personal information to
      third parties outside of New Zealand, we will comply with our obligations
      under the Privacy Act in relation to offshore disclosures of personal
      information including, if necessary, ensuring that those third parties are
      subject to privacy obligations that overall provide comparable safeguards
      to those in the Privacy Act.
      <br />
      <br />
      20. Where information relating to individuals residing in the EU/UK is
      transferred outside of the European Economic Area, UK or New Zealand, it
      will be:
      <br />
      <br />
      a. to a related company that is subject to binding corporate rules;
      <br />
      <br />
      b. to a country or organisation that has 'adequacy' for the purpose of
      Article 45 of the GDPR or under the UKGDPR; or
      <br />
      <br />
      c. transferred subject to the European Commission's model contracts for
      the transfer of personal data to third countries (i.e., the standard
      contractual clauses) and relevant UK standards.
      <br />
      <br />
      <Typography variant="h2">Payment card details</Typography>
      <br />
      21. We do not collect or store any payment card details. Where we offer an
      online payment processing service through our Websites, we use a Payment
      Card Industry Data Security Standard compliant hosted payment service to
      process any payment card transactions. Your payment card details will only
      be collected and held securely by that third party payment processor.
      <br />
      <br />
      <Typography variant="h2">
        Access, correction and retention of your personal information
      </Typography>
      <br />
      <br />
      <br />
      22. You agree that any personal information you give to us will be
      accurate, correct and up to date.
      <br />
      <br />
      23. You are entitled to request access to, or correction of, the personal
      information we hold about you by contacting us at
      <a href="mailto:privacy@futureverse.com">PRIVACY@FUTURVERSE.COM</a>.
      <br />
      <br />
      24. We cannot edit or delete any information that is stored on a
      blockchain, as we do not have custody or control over any blockchains. The
      information stored on a blockchain may include purchases, sales, and
      transfers related to your blockchain address and NFTs held at that
      address.
      <br />
      <br />
      25. We will only retain your personal information for as long as it is
      required to achieve the purposes set out in this Privacy Policy or as
      otherwise required by law.
      <br />
      <br />
      <Typography variant="h2">
        EU/UK data subject rights under the GDPR and UKGDPR
      </Typography>
      <br />
      26. If you reside in the EU or UK at the time your personal information is
      collected by Futureverse Corporation, you may have certain additional
      rights in relation to the personal information we hold about you. These
      additional rights include:
      <br />
      <br />
      a. erasure;
      <br />
      <br />
      b. restriction of processing; and
      <br />
      <br />
      c. data portability.
      <br />
      <br />
      27. If you wish to submit a request in regard to any these rights, please
      contact us at{' '}
      <a href="mailto:privacy@futureverse.com">PRIVACY@FUTURVERSE.COM</a>
      <br />
      <br />
      Verifying your identity
      <br />
      <br />
      27.1 To protect your privacy and security, we may also take reasonable
      steps to verify your identity before granting access to personal
      information or making corrections. We may refuse access to or correction
      of your personal information for any reason permitted by applicable
      privacy law. Security of information
      <br />
      <br />
      28. Although we take reasonable steps to ensure personal information in
      our possession is protected and held securely, we do not make any
      warranties in relation to the security of any information you disclose or
      transmit to us, and we are not responsible for the theft, destruction, or
      inadvertent disclosure of your personal information where our security
      measures have been breached. Any transmission of personal information is
      conducted at your own risk.
      <br />
      <br />
      <Typography variant="h2">Links to other sites</Typography>
      <br />
      29. Our Websites may have links or references to third party websites or
      material. Our Privacy Policy does not apply to those websites, and any
      information collected by such third parties is governed by that third
      party's privacy practices or policies. We accept no responsibility or
      liability for the content or privacy practices of any third-party
      websites.
      <br />
      <br />
      <Typography variant="h2">How to contact us</Typography>
      <br />
      30. If you have any queries or concerns about our Privacy Policy or our
      handling of your personal information please contact our data protection
      officer at Futurevese Corporation Limited, 17 South Street, Newton,
      Auckland CBD, 1010, New Zealand or by emailing us at
      <a href="mailto:privacy@futureverse.com">PRIVACY@FUTURVERSE.COM</a>
      .
      <br />
      <br />
      31. If we are unable to satisfactorily resolve your concerns about our
      handling of your personal information, you can contact:
      <br />
      <br />
      a. the New Zealand Office of the Privacy Commissioner at: PO Box 10-094,
      The Terrace, Wellington 6143, phone 0800 803 909,
      <a href="https://privacy.org.nz/">https://privacy.org.nz/</a>
      ; or
      <br />
      <br />
      b. if you are based in the EU/UK, your local supervisory authority.
      <br />
      <br />
    </>
  )
}
