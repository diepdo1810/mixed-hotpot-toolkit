<script setup>
import { ref } from 'vue'
import { translate } from '~/logic/translate'
import { app } from '~/logic/firecrawl'
import Button from '~/components/form/form-button.vue'
import Loading from '~/components/loading/loading.vue'

const isLoaded = ref(false)
const isDisabled = ref(false)
const result = ref('')
const isCrawl = ref(false)
const url = ref('')
const exclude = ref('')
const include = ref('')

const translateData = async () => {
  isLoaded.value = true
  isDisabled.value = true
  const text = result.value
  let texts = text.split('\n')

  if (texts.length === 0) {
    isLoaded.value = false
    isDisabled.value = false
    return
  }

  texts = texts.filter((item) => item.trim() !== '')
  texts = texts.map((item) => item.replace(/\(https?:\/\/.*\)/g, ''))

  let translatedText = ''

  for (const item of texts) {
    try {
      const res = await translate(item, 'en', 'vi', 'text', 50)
      translatedText += res.translatedText + '\n\n'
      result.value = translatedText
    } catch (error) {
      console.error('Error translating text:', error)
    }
  }

  isLoaded.value = false
  isDisabled.value = false
}

const toogleFirecrawl = () => {
  isCrawl.value = !isCrawl.value
}

const firecrawler = async () => {
  isLoaded.value = true
  isDisabled.value = true
  const types = {
    formats: ['markdown', 'html']
  }

  if (include.value) {
    types.includeTags = include.value.split(',')
  }

  if (exclude.value) {
    types.excludeTags = exclude.value.split(',')
  }

  if (!url.value) {
    isLoaded.value = false
    isDisabled.value = false
    return
  }

  const scrapeResponse = await app.scrapeUrl(url.value, types)
  if (scrapeResponse) {
    result.value = scrapeResponse.markdown
    isLoaded.value = false
    isDisabled.value = false
    isCrawl.value = false
  }
}
</script>

<template>
  <form>
    <div
      class="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
    >
      <div
        class="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600"
      >
        <div
          class="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600"
        >
          <div class="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
            <Button text="CC" :events="'translate'" @translate="translateData">
              <template v-slot:icon>
                <svg
                  class="w-4 h-4 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.855 10.322a2.476 2.476 0 1 1 .133-4.241m6.053 4.241a2.475 2.475 0 1 1 .133-4.241M2 1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"
                  ></path>
                </svg>
              </template>
            </Button>
          </div>

          <div
            class="flex flex-wrap items-center space-x-1 rtl:space-x-reverse sm:ps-4"
          >
            <Button
              text="FIRE"
              :events="'toogleFirecrawl'"
              @toogleFirecrawl="toogleFirecrawl"
            >
              <template v-slot:icon>
                <svg
                  class="w-4 h-4 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18.122 17.645a7.185 7.185 0 0 1-2.656 2.495 7.06 7.06 0 0 1-3.52.853 6.617 6.617 0 0 1-3.306-.718 6.73 6.73 0 0 1-2.54-2.266c-2.672-4.57.287-8.846.887-9.668A4.448 4.448 0 0 0 8.07 6.31 4.49 4.49 0 0 0 7.997 4c1.284.965 6.43 3.258 5.525 10.631 1.496-1.136 2.7-3.046 2.846-6.216 1.43 1.061 3.985 5.462 1.754 9.23Z"
                  />
                </svg>
              </template>
            </Button>
          </div>

          <div class="col-12">
            <div class="flex items-center max-w-sm mx-auto" v-if="isCrawl">
              <label for="simple-fire" class="sr-only">Fire</label>
              <div class="relative w-full">
                <div
                  class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 18V6l8 6-8 6Z"
                    />
                  </svg>
                </div>
                <input
                  v-model="url"
                  :disabled="isDisabled"
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="enter url (ex: https://firecrawl.dev)"
                />
              </div>
              <button
                @click.prevent="firecrawler"
                type="submit"
                class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  class="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span class="sr-only">Fire Crawl</span>
              </button>
            </div>

            <div class="flex items-center max-w-sm mx-auto mt-2" v-if="isCrawl">
              <label for="simple-fire" class="sr-only">Exclude Tags</label>
              <div class="relative w-full">
                <div
                  class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 18V6l8 6-8 6Z"
                    />
                  </svg>
                </div>
                <input
                  v-model="exclude"
                  :disabled="isDisabled"
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Exclude Tags script (ex: .inarticle-wrapper, #nl-container)"
                />
              </div>
            </div>

            <div class="flex items-center max-w-sm mx-auto mt-2" v-if="isCrawl">
              <label for="simple-fire" class="sr-only">Include Only Tags</label>
              <div class="relative w-full">
                <div
                  class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 18V6l8 6-8 6Z"
                    />
                  </svg>
                </div>
                <input
                  v-model="include"
                  :disabled="isDisabled"
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Include Only Tags script (ex: .inarticle-wrapper, #nl-container)"
                />
              </div>
            </div>
          </div>
        </div>
        <Button text="Full screen" :events="'fullscreen'">
          <template v-slot:icon>
            <svg
              class="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 19 19"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
              />
            </svg>
          </template>
        </Button>
      </div>

      <div class="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
        <textarea
          v-model="result"
          id="editor"
          rows="8"
          class="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
          placeholder="Add text to translate..."
          required
          :disabled="isDisabled"
        ></textarea>

        <Loading :isLoaded="isLoaded" text="Loading..."></Loading>
      </div>
    </div>
  </form>
</template>
