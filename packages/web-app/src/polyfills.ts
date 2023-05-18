// This is to fix wallet(other than metamask) connect issue.
// Followed the example https://github.com/rainbow-me/rainbowkit/tree/main/examples/with-vite
import { Buffer } from 'buffer'

window.global = window.global ?? window
window.Buffer = window.Buffer ?? Buffer
window.process = window.process ?? { env: {} } // Minimal process polyfill

export {}
