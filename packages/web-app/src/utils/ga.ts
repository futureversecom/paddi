declare global {
  interface Window {
    dataLayer: object[]
  }
}
/**
 * Important: For some reason this needs to remain a function and
 * arguments of type IArguments needs to be pushed to dataLayer.
 * De-constructed args will not work.
 * @see IArguments
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(..._args: any) {
  // Reporting an event should never fail the app.
  // Make sure prerequisites are available.
  window.dataLayer = window.dataLayer || []
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments)
}

type TagEventParams = {
  page_view: 'page_title'
  nav_click: 'nav_label'
  button_click: 'button_name' | 'page_title'
  control_interaction: 'control_name' | 'control_value' | 'page_title'
  field_submit: 'field_name' | 'string' | 'page_title'
  wallet_connected: 'wallet'
  wallet_txn: 'contract' | 'method' | 'gas_fee'
}

export const reportEvent = <E extends keyof TagEventParams>(
  event: E,
  params: { [K in TagEventParams[E]]: string } & Record<string, string>,
) => {
  gtag('event', event, params)
}
