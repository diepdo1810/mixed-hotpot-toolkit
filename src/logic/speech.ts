import OpenAI from 'openai';
import { SpeechCreateParams } from 'openai/resources/audio'

export const speech = async (
  text: string,
  le: string = 'vi',
)=> {
  try {
    const pronunciationApi = 'https://dict.youdao.com/dictvoice?audio='

    const response = await fetch(`${pronunciationApi}${text}&le=${le}` );

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
  } catch (error) {
    console.error(error)
  }
}