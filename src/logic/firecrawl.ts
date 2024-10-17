import FirecrawlApp from '@mendable/firecrawl-js'

interface Settings {
  fireCrawl: string
}

const getSettings = (): Promise<Settings> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get('settings', (data) => {
      resolve(data.settings)
    })
  })
}

const settings: Settings = await getSettings()

let fireCrawl = ''
if (settings) {
  fireCrawl = settings.fireCrawl
}

export const app = new FirecrawlApp({
  apiKey: fireCrawl
})
