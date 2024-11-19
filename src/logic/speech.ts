import OpenAI from 'openai';
import { SpeechCreateParams } from 'openai/resources/audio'

export const speech = async (
  text: string,
  voice: string,
  model: string,
)=> {
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

    const response = await client.audio.speech.create(<SpeechCreateParams>{
      model: model,
      voice: voice,
      input: text,
    });

    // Convert response to base64 string
    const buffer = await response.arrayBuffer();
    const base64Audio = btoa(
      new Uint8Array(buffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    return `data:audio/mp3;base64,${base64Audio}`;

    /** download the audio file
    const blob = new Blob([await response.arrayBuffer()], { type: 'audio/mp3' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-audio.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
     */
  }
}