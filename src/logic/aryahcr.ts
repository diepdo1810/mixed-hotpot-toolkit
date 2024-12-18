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

export const translate = async (
  text: string,
  source: string,
  target: string
) => {

  const settings: Settings = await getSettings()

  if (settings) {
    const api = settings.aryahcr

    console.log(api)
    try {
      const postResponse = await fetch(api, {
        method: 'POST',
        body: JSON.stringify({
          text: text,
          source: source,
          target: target
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (!postResponse.ok) throw new Error(`Error: ${postResponse.statusText}`)

      const postData = await postResponse.json()

      let id = postData.id
      let data = true
      let responseData = null

      while (data) {
        await new Promise(r => setTimeout(r, 1000))

        const getResponse = await fetch(`${api}/${encodeURIComponent(id)}`)

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
    } catch (error) {
      console.error(error)
    }
  }
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
    console.log('Payload:', payload);
    console.log('Headers:', headers);
    console.log('URL:', url);
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
          console.log('Streaming:', result);
        }
      }
    }

    return { code: 500, status: false, message: 'INTERNAL_SERVER_ERROR' };
  }

  const settings: Settings = await getSettings()

  if (settings) {
    const api = settings.aryahcr

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
}