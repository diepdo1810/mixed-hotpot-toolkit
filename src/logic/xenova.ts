import { pipeline } from '@huggingface/transformers';
import { WaveFile } from 'wavefile';

const pipe = await pipeline('text-to-speech', 'Xenova/mms-tts-vie',  { dtype: 'fp32' });

export const speech = async (text: string)=> {
  return await pipe(text);
}

export const generateAudioUrl = async (text: string) => {
  const output = await speech(text);
  const wav = new WaveFile();
  wav.fromScratch(1, output.sampling_rate, '32f', output.audio);

  const wavBuffer = wav.toBuffer();
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });

  const url = URL.createObjectURL(blob);

  console.log(url);

  return url;
}
