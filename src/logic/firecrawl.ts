import FirecrawlApp, { ScrapeParams } from '@mendable/firecrawl-js';

export const fire = async (url: string, types: ScrapeParams<any>) => {
  interface Settings {
    fireCrawl: string;
  }

  const getSettings = (): Promise<Settings> => {
    return new Promise((resolve) => {
      chrome.storage.sync.get('settings', (data) => {
        resolve(data.settings);
      });
    });
  };

  const settings: Settings = await getSettings();

  if (settings) {
    const fireCrawl = settings.fireCrawl;

    const app = new FirecrawlApp({
      apiKey: fireCrawl
    });

    const res = await app.scrapeUrl(url, types);
    return res;
  }
};