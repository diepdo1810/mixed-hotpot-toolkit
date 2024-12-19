import OpenAI from 'openai';

export const keyword = async (
  model: string,
  result: string,
) => {
  interface Settings {
    apiZukijourney: string;
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
    const api = settings.apiZukijourney;

    const client = new OpenAI({
      baseURL: 'https://api.zukijourney.com/v1',
      apiKey: api,
      dangerouslyAllowBrowser: true,
    });

    const response = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'user',
          content: `Find unique shorthand keywords in the following text:
          ${result}

          Note: Only display shorthand keywords using the format <code>keyword</code>. Avoid displaying any duplicate keywords.`,
        }
      ],
    });

    return response.choices[0].message.content;
  }
}