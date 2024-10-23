import { GoogleGenerativeAI } from '@google/generative-ai'

export const summary = async (prompt: string, text: string) => {
  interface Settings {
    gemini: string
  }

  const getSettings = (): Promise<Settings> => {
    return new Promise((resolve) => {
      chrome.storage.sync.get('settings', (data) => {
        resolve(data.settings)
      })
    })
  }

  const settings: Settings = await getSettings()
  console.log(settings)
  if (settings) {
    const gemini = settings.gemini
    const genAI = new GoogleGenerativeAI(gemini)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    prompt = prompt + '\n' + text
    const result = await model.generateContent(prompt)

    return result.response.text()
  }
}
