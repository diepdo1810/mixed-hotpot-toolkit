export const translate = async (
  text: string,
  source: string,
  target: string,
  format: string,
  alternatives: number
) => {
  interface Settings {
    api: string;
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
    const api = settings.api;

    const res = await fetch(api, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: source,
        target: target,
        format: format,
        alternatives: alternatives,
        api_key: ''
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();

    return data;
  }
}
