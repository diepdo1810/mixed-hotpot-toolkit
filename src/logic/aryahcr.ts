interface Settings {
  aryahcr: string;
}

export const getSettings = (): Promise<Settings> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get('settings', (data) => {
      resolve(data.settings)
    })
  })
}

export const fetchPostData = async (url?: string, payload?: any, urlId?: string) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) throw new Error(`Error: ${response.statusText}`)

    return await handleEvents(url, response, urlId)
  } catch (error) {
    console.error('Error:', error)
  }
}

export const handleEvents = async (url?: string, response?: Response, urlId?: string) => {
  const postData = await response.json()

  let id = postData.id
  let data = true
  let responseData = null

  while (data) {
    await new Promise(r => setTimeout(r, 1000))

    console.log(urlId ? 'have urlId true' : 'have urlId false')

    const getResponse = await fetch(`${urlId ?? url}/${encodeURIComponent(id)}`)

    if (!getResponse.ok) throw new Error(`Error: ${getResponse.statusText}`)
    responseData = await getResponse.json()

    console.log(responseData)

    switch (responseData.status) {
      case 'pending':
        data = true
        break
      case 'error':
      case 'completed':
      case 'not_found':
        data = false
        break
    }
  }

  return responseData
}

export const translate = async (
  text: string,
  source: string,
  target: string
) => {
  console.log(text, source, target)

  const settings: Settings = await getSettings()
  console.log(settings)

  if (settings) {
    const api = settings.aryahcr

    const payload = {
      text: text,
      source: source,
      target: target,
    }

    return await fetchPostData(api, payload)
  }
}

export const keyword = async (
  prompt: string,
  markdown: boolean = false,
) => {
  const url = 'https://nexra.aryahcr.cc/api/chat/gptweb'
  const urlId = 'https://nexra.aryahcr.cc/api/chat/task'

  const response = await fetchPostData(url, { prompt, markdown }, urlId)

  return response.gpt
}

interface Payload {
  messages?: string[];
  stream?: boolean;
  markdown?: boolean;
  model?: string;
}

export const agent = async (
  messages: string[],
  stream: boolean = true,
  markdown: boolean = false,
  model: string = 'gpt-4o'
): Payload => {
  type ChatResult = {
    code?: number;
    status?: boolean;
    error?: string;
    message?: string;
    finish?: boolean;
  };

  const fetchStreamData = async (url: string, payload: any, headers: HeadersInit) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (!response.body) throw new Error('ReadableStream not supported.');

      return handleStreamEvents(response.body.getReader());
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const processChunk = (chunk: string, tmp: string | null): [ChatResult | null, string | null] => {
    const messages = chunk.split('');
    let result: ChatResult | null = null;
    let partial = tmp;

    for (const message of messages) {
      try {
        result = JSON.parse(partial ? partial + message : message);
        partial = null; // Reset tmp on success
      } catch {
        partial = partial ? partial + message : message;
      }
    }

    return [result, partial];
  }

  const handleStreamEvents = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    let chat: ChatResult | null = null;
    let error: ChatResult | null = null;
    let tmp: string | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const [result, partial] = processChunk(chunk, tmp);
      tmp = partial;

      if (result) {
        if (!chat) chat = {};
        if (result.finish) {
          console.log('Stream finished:', result);

          return result;
        } else {
          chat = { ...chat, ...result };
        }
      }
    }

    return { code: 500, status: false, message: 'INTERNAL_SERVER_ERROR' };
  }

  try {
    const headers = { 'Content-Type': 'application/json' };

    const payload = {
      messages: messages,
      stream: stream,
      markdown: markdown,
      model: model,
    };

    return fetchStreamData('https://nexra.aryahcr.cc/api/chat/complements', payload, headers);
  } catch (error) {
    console.error(error);
  }
}