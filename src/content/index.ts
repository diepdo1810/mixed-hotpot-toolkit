/* eslint-disable no-console */
import { onMessage } from 'webext-bridge'

console.info('[mixed-hot-pot-toolkits] Hello from content script')

// communication example: send previous tab title from background page
onMessage('tab-prev', ({ data }) => {
  console.log(`[mixed-hot-pot-toolkits] Navigate from page "${data.title}"`)
})
