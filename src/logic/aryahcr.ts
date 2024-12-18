export const translate = async (
  text: string,
  source: string,
  target: string
) => {
  interface Settings {
    aryahcr: string;
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

// export const summary = async ()