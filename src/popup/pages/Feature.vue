<script setup>
import { ref } from 'vue'
import { translate } from '~/logic/translate'
import { fire } from '~/logic/firecrawl'
import { summary } from '~/logic/summary'
import { speech } from '~/logic/speech'
import Button from '~/components/form/form-button.vue'
import Loading from '~/components/loading/loading.vue'

const isLoaded = ref(false)
const isDisabled = ref(false)
const result = ref('')
const isCrawl = ref(false)
const url = ref('')
const exclude = ref('')
const include = ref('')
const isSummary = ref(false)
const models = ref([])
const isSpeech = ref(false)
const audioSrc = ref('')
const voice = ref('namminh')
const voices = ref(
  ['henry', 'bwyneth', 'snoop', 'mrbeast', 'gwyneth', 'cliff', 'guy', 'jane', 'matthew', 'benwilson', 'henry', 'bwyneth', 'snoop', 'mrbeast', 'gwyneth', 'benwilson', 'cliff', 'presidential', 'guy', 'jane', 'matthew', 'carly', 'kyle', 'kristy', 'oliver', 'tasha', 'joe', 'lisa', 'george', 'emily', 'rob', 'russell', 'benjamin', 'jenny', 'aria', 'joanna', 'nate', 'mary', 'salli', 'joey', 'ryan', 'sonia', 'oliver', 'amy', 'michael', 'thomas', 'libby', 'narrator', 'brian', 'natasha', 'william', 'freya', 'ken', 'olivia', 'aditi', 'abeo', 'ezinne', 'luke', 'leah', 'willem', 'adri', 'fatima', 'hamdan', 'hala', 'rana', 'bassel', 'bashkar', 'tanishaa', 'kalina', 'borislav', 'joana', 'enric', 'xiaoxiao', 'yunfeng', 'xiaomeng', 'yunjian', 'xiaoyan', 'yunze', 'zhiyu', 'hiumaan', 'wanlung', 'hiujin', 'hsiaochen', 'hsiaoyu', 'yunjhe', 'srecko', 'gabrijela', 'antonin', 'vlasta', 'christel', 'jeppe', 'colette', 'maarten', 'laura', 'ruben', 'dena', 'arnaud', 'anu', 'kert', 'blessica', 'angelo', 'harri', 'selma', 'denise', 'henri', 'celeste', 'claude', 'sylvie', 'jean', 'charline', 'gerard', 'ariane', 'fabrice', 'katja', 'christoph', 'louisa', 'conrad', 'vicki', 'daniel', 'giorgi', 'eka', 'athina', 'nestoras', 'avri', 'hila', 'madhur', 'swara', 'noemi', 'tamas', 'gudrun', 'gunnar', 'gadis', 'ardi', 'irma', 'benigno', 'elsa', 'gianni', 'palmira', 'diego', 'imelda', 'cataldo', 'bianca', 'adriano', 'mayu', 'naoki', 'nanami', 'daichi', 'shiori', 'keita', 'daulet', 'aigul', 'sunhi', 'injoon', 'jimin', 'bongjin', 'seoyeon', 'ona', 'leonas', 'everita', 'nils', 'osman', 'yasmin', 'sagar', 'hemkala', 'iselin', 'finn', 'pernille', 'farid', 'dilara', 'agnieszka', 'marek', 'zofia', 'brenda', 'donato', 'yara', 'fabio', 'leila', 'julio', 'camila', 'thiago', 'fernanda', 'duarte', 'ines', 'cristiano', 'alina', 'emil', 'dariya', 'dmitry', 'tatyana', 'maxim', 'viktoria', 'lukas', 'petra', 'rok', 'sameera', 'thilini', 'saul', 'vera', 'arnau', 'triana', 'gerardo', 'carlota', 'luciano', 'larissa', 'lupe', 'hillevi', 'mattias', 'sofie', 'rehema', 'daudi', 'pallavi', 'valluvar', 'saranya', 'kumar', 'kani', 'surya', 'venba', 'anbu', 'mohan', 'shruti', 'premwadee', 'niwat', 'emel', 'ahmet', 'gul', 'salman', 'uzma', 'asad', 'polina', 'ostap', 'hoaimy', 'namminh', 'orla', 'colm']
)

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
  isSpeech.value = false
  isSummary.value = false
}

const toogleSummary = () => {
  isSummary.value = !isSummary.value
  isSpeech.value = false
  isCrawl.value = false
}

const toogleSpeech = () => {
  isSpeech.value = !isSpeech.value
  isSummary.value = false
  isCrawl.value = false
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

  const scrapeResponse = await fire(url.value, types)
  if (scrapeResponse) {
    result.value = scrapeResponse.markdown
    isLoaded.value = false
    isDisabled.value = false
    isCrawl.value = false
  }
}

const summaryData = async () => {
  if (models.value.length === 0) {
    isLoaded.value = false
    isDisabled.value = false
    return
  }
  isLoaded.value = true
  isDisabled.value = true
  const text = result.value
  const texts = text.split('\n')

  if (texts.length === 0) {
    isLoaded.value = false
    isDisabled.value = false
    return
  }

  let prompt = 'Sử dụng @docs để phân tích và tóm tắt tài liệu một cách kỹ lưỡng. Không chỉ bao gồm các điểm chính mà còn xác định bất kỳ khoảng trống hoặc lĩnh vực nào cần cải thiện. Sau khi tóm tắt, hãy đưa ra các khuyến nghị khả thi dựa trên phân tích. Trả lời bằng tiếng Việt'

  try {
    result.value = await summary(prompt, text, models.value.join(','))
  } catch (error) {
    console.error('Error summarizing text:', error)
  }

  isLoaded.value = false
  isDisabled.value = false
}

const speechData = async () => {
  isLoaded.value = true
  isDisabled.value = true
  if (!result.value) {
    isLoaded.value = false
    isDisabled.value = false
    return
  }

  try {
    audioSrc.value = await speech(
      result.value,
      voice.value,
      'speechify'
    );
  } catch (error) {
    console.error('Error in speech generation:', error);
  } finally {
    isLoaded.value = false;
    isDisabled.value = false;
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

          <div class="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
            <Button text="summary" :events="'toogleSummary'" @toogleSummary="toogleSummary">
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
                    d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"
                  />
                </svg>
              </template>
            </Button>
          </div>

          <div class="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
            <Button text="speech" :events="'toogleSpeech'" @toogleSpeech="toogleSpeech">
              <template v-slot:icon>
                <svg
                  class="w-4 h-4 text-gray-800 dark:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
              </template>
            </Button>
          </div>

          <div class="col-12">
            <div class="flex items-center max-w-sm mx-auto" v-if="isSpeech">
              <form class="max-w-sm mx-auto">
                <select
                  id="countries_multiple"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  v-model="voice">
                  <option v-for="item in voices" :value="item">{{ item }}</option>
                </select>
              </form>
              <button
                @click.prevent="speechData"
                type="submit"
                class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-96-32a96 96 0 1 0 192 0 96 96 0 1 0 -192 0zM96 240c0-35 17.5-71.1 45.2-98.8S205 96 240 96c8.8 0 16-7.2 16-16s-7.2-16-16-16c-45.4 0-89.2 22.3-121.5 54.5S64 194.6 64 240c0 8.8 7.2 16 16 16s16-7.2 16-16z"></path>
                </svg>

                <span class="sr-only">Speech</span>
              </button>
            </div>
          </div>

          <div class="col-12">
            <div class="flex items-center max-w-sm mx-auto" v-if="isSummary">
              <form class="max-w-sm mx-auto">
                <select multiple id="countries_multiple" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                v-model="models">
                  <option selected>Choose Models</option>
                  <option value="ch">Cohere</option>
                  <option value="op">Open AI</option>
                  <option value="gm">Gemini</option>
                </select>
              </form>
              <button
                @click.prevent="summaryData"
                type="submit"
                class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 18.5A2.493 2.493 0 0 1 7.51 20H7.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .92-3.182 2.477 2.477 0 0 1 1.876-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 12 5.5m0 13v-13m0 13a2.493 2.493 0 0 0 4.49 1.5h.01a2.468 2.468 0 0 0 2.403-3.154 2.98 2.98 0 0 0 .847-5.274 2.468 2.468 0 0 0-.921-3.182 2.477 2.477 0 0 0-1.875-3.344A2.5 2.5 0 0 0 14.5 3 2.5 2.5 0 0 0 12 5.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M20 10.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185" />
                </svg>

                <span class="sr-only">Summary</span>
              </button>
            </div>
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

        <div v-if="audioSrc" class="mt-4">
          <audio
            controls
            class="w-full"
            :src="audioSrc"
          >
            Your browser does not support the audio element.
          </audio>
        </div>

        <Loading :isLoaded="isLoaded" text="Loading..."></Loading>
      </div>
    </div>
  </form>
</template>
