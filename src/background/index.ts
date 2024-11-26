import { sendMessage, onMessage } from 'webext-bridge'

chrome.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type decleration
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }
  const tab = await chrome.tabs.get(previousTabId)
  previousTabId = tabId
  if (!tab) return

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  await sendMessage(
    'tab-prev',
    { title: tab.title },
    { context: 'content-script', tabId }
  )
})

// @ts-ignore
onMessage('get-current-tab', async () => {
  try {
    const tab = await chrome.tabs.get(previousTabId)
    return {
      title: tab?.id
    }
  } catch {
    return {
      title: undefined
    }
  }
})
