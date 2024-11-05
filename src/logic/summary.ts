import { GoogleGenerativeAI } from '@google/generative-ai'
import ModelClient from '@azure-rest/ai-inference'
import { AzureKeyCredential } from '@azure/core-auth'
import RateLimiter from './rateLimiter'

const rateLimiter = new RateLimiter()

async function initializeRateLimiter() {
  await rateLimiter.loadState()
}

initializeRateLimiter().then(r => console.log('Rate limiter initialized'))

export const summary = async (prompt: string, text: string, model: string) => {
  if (model === '') {
    return
  }

  if (!rateLimiter.canRequest()) {
    console.error('Rate limit exceeded.')
    return
  }

  interface Settings {
    gemini: string,
    githubToken: string
  }

  const getSettings = (): Promise<Settings> => {
    return new Promise((resolve) => {
      chrome.storage.sync.get('settings', (data) => {
        resolve(data.settings)
      })
    })
  }

  const settings: Settings = await getSettings()

  if (settings) {
    let modelName = ''

    if (model === 'ch') {
      modelName = 'Cohere-command-r'
    } else if (model === 'op') {
      modelName = 'gpt-4o-mini'
    } else if (model === 'gm') {
      modelName = 'gemini-1.5-flash'
    }

    if (modelName === 'gemini-1.5-flash') {
      const gemini = settings.gemini
      const genAI = new GoogleGenerativeAI(gemini)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      prompt = prompt + '\n' + text
      const result = await model.generateContent(prompt)

      return result.response.text()
    }

    const endpoint = 'https://models.inference.ai.azure.com'
    // @ts-ignore
    const client = new ModelClient(endpoint, new AzureKeyCredential(settings.githubToken))

    try {
      const response = await client.path('/chat/completions').post({
        body: {
          messages: [
            { role: 'user', content: prompt + '\n' + text }
          ],
          temperature: 1.0,
          top_p: 1.0,
          max_tokens: 4000,
          model: modelName
        }
      })

      rateLimiter.recordRequest()

      if (response.status !== '200') {
        throw response.body.error
      }

      return response.body.choices[0].message.content

    } catch (error) {
      console.error('Error with Azure API:', error)
      throw error
    }
  }
}
