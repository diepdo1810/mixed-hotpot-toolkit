<script setup>
import { ref } from 'vue'
import { fire } from '~/logic/firecrawl'
import { summary } from '~/logic/summary'
import { speech } from '~/logic/speech'
import { useLocalStorage } from '@vueuse/core'
import { marked } from 'marked';
import { translate } from '~/logic/aryahcr'

const isLoaded = ref(false)
const isDisabled = ref(false)
const result = ref('')
const isCrawl = ref(false)
const url = ref('')
const exclude = ref('')
const include = ref('')
const isSummary = ref(false)
const models = ref({
  options: [
    { value: '', label: 'Choose Models' },
    { value: 'ch', label: 'Cohere' },
    { value: 'op', label: 'Open AI' },
    { value: 'gm', label: 'Gemini' }
  ]
})
const selectedModel = ref('')
const isSpeech = ref(false)
const audioSrc = ref('')
const voice = ref('namminh')
const voices = ref(
  ['henry', 'bwyneth', 'snoop', 'mrbeast', 'gwyneth', 'cliff', 'guy', 'jane', 'matthew', 'benwilson', 'henry', 'bwyneth', 'snoop', 'mrbeast', 'gwyneth', 'benwilson', 'cliff', 'presidential', 'guy', 'jane', 'matthew', 'carly', 'kyle', 'kristy', 'oliver', 'tasha', 'joe', 'lisa', 'george', 'emily', 'rob', 'russell', 'benjamin', 'jenny', 'aria', 'joanna', 'nate', 'mary', 'salli', 'joey', 'ryan', 'sonia', 'oliver', 'amy', 'michael', 'thomas', 'libby', 'narrator', 'brian', 'natasha', 'william', 'freya', 'ken', 'olivia', 'aditi', 'abeo', 'ezinne', 'luke', 'leah', 'willem', 'adri', 'fatima', 'hamdan', 'hala', 'rana', 'bassel', 'bashkar', 'tanishaa', 'kalina', 'borislav', 'joana', 'enric', 'xiaoxiao', 'yunfeng', 'xiaomeng', 'yunjian', 'xiaoyan', 'yunze', 'zhiyu', 'hiumaan', 'wanlung', 'hiujin', 'hsiaochen', 'hsiaoyu', 'yunjhe', 'srecko', 'gabrijela', 'antonin', 'vlasta', 'christel', 'jeppe', 'colette', 'maarten', 'laura', 'ruben', 'dena', 'arnaud', 'anu', 'kert', 'blessica', 'angelo', 'harri', 'selma', 'denise', 'henri', 'celeste', 'claude', 'sylvie', 'jean', 'charline', 'gerard', 'ariane', 'fabrice', 'katja', 'christoph', 'louisa', 'conrad', 'vicki', 'daniel', 'giorgi', 'eka', 'athina', 'nestoras', 'avri', 'hila', 'madhur', 'swara', 'noemi', 'tamas', 'gudrun', 'gunnar', 'gadis', 'ardi', 'irma', 'benigno', 'elsa', 'gianni', 'palmira', 'diego', 'imelda', 'cataldo', 'bianca', 'adriano', 'mayu', 'naoki', 'nanami', 'daichi', 'shiori', 'keita', 'daulet', 'aigul', 'sunhi', 'injoon', 'jimin', 'bongjin', 'seoyeon', 'ona', 'leonas', 'everita', 'nils', 'osman', 'yasmin', 'sagar', 'hemkala', 'iselin', 'finn', 'pernille', 'farid', 'dilara', 'agnieszka', 'marek', 'zofia', 'brenda', 'donato', 'yara', 'fabio', 'leila', 'julio', 'camila', 'thiago', 'fernanda', 'duarte', 'ines', 'cristiano', 'alina', 'emil', 'dariya', 'dmitry', 'tatyana', 'maxim', 'viktoria', 'lukas', 'petra', 'rok', 'sameera', 'thilini', 'saul', 'vera', 'arnau', 'triana', 'gerardo', 'carlota', 'luciano', 'larissa', 'lupe', 'hillevi', 'mattias', 'sofie', 'rehema', 'daudi', 'pallavi', 'valluvar', 'saranya', 'kumar', 'kani', 'surya', 'venba', 'anbu', 'mohan', 'shruti', 'premwadee', 'niwat', 'emel', 'ahmet', 'gul', 'salman', 'uzma', 'asad', 'polina', 'ostap', 'hoaimy', 'namminh', 'orla', 'colm']
)
const fillCrawl = ref('')

const fillCrawls = ref([
  {
    name: 'dantri.com.vn',
    incl: '.singular-content',
    excl: ''
  },
  {
    name: 'www.indiehackers.com',
    incl: '.post-page__content',
    excl: ''
  }
])

const showToast = ref(false)
const messToast = ref('')
const isToastSuccess = ref(false)

useLocalStorage('result', result, { listenToStorageChanges: true })
const convertedHtml = ref('')

watch(() => url.value, (value) => {
  if (value) {
    // example value: https://www.indiehackers.com/post/40-open-source-gems-to-replace-your-saas-subscriptions-f733b8e166

    const url = new URL(value)
    const hostname = url.hostname

    const fill = fillCrawls.value.find((item) => item.name === hostname)

    fillCrawl.value = fill?.name || ''
    include.value = fill?.incl || ''
    exclude.value = fill?.excl || ''
  }
})

watch(() => showToast.value, (value) => {
  if (value) {
    setTimeout(() => {
      showToast.value = false
    }, 1500)
  }
})

convertedHtml.value = marked(result.value)

const translateData = async () => {
  isLoaded.value = true
  isDisabled.value = true
  isCrawl.value = false
  isSpeech.value = false
  isSummary.value = false

  if (!result.value) {
    handleCrawlError('Please enter the text!')
    return
  }

  const text = result.value

  try {
    const res = await translate(text, 'en', 'vi')
    result.value = res.translate.result
    handleCrawlSuccess('Translate text successfully')
  } catch (error) {
    handleCrawlError('Please check Settings to see if updates have been applied.')
  }
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

const usedNumbers = new Set();

const getUniqueRandomNumber = (max = 1000) => {
  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * max);
  } while (usedNumbers.has(randomNumber));
  usedNumbers.add(randomNumber);
  return randomNumber;
}

const openFullscreen = () => {
  const random = getUniqueRandomNumber();
  chrome.tabs.create({ url: `./options/index.html?tabId=${random}` }, (tab) => {
    if (chrome.runtime.lastError) {
      console.error('Error creating tab:', chrome.runtime.lastError);
      return;
    }
    console.log('Tab created with ID:', tab.id);
    useLocalStorage('tabId', tab.id);
    // add tabId on url
    const url = chrome.runtime.getURL(`options/index.html?tabId=${tab.id}`);
    chrome.tabs.update(tab.id, { url });
  });
}

const handleCrawlSuccess = (message) => {
  isLoaded.value = false;
  isDisabled.value = false;
  isToastSuccess.value = true;
  showToast.value = true;
  messToast.value = message;
};

const handleCrawlError = (message) => {
  isLoaded.value = false;
  isDisabled.value = false;
  isToastSuccess.value = false;
  showToast.value = true;
  messToast.value = message;
};

const firecrawler = async () => {
  isLoaded.value = true;
  isDisabled.value = true;

  const types = {
    formats: ['markdown', 'html'],
    includeTags: include.value?.split(',') || [],
    excludeTags: exclude.value?.split(',') || []
  };

  if (!url.value) {
    handleCrawlError('Please enter the URL!');
    return;
  }

  isCrawl.value = false;

  try {
    const scrapeResponse = await fire(url.value, types);
    result.value = scrapeResponse.markdown;
    handleCrawlSuccess('Crawl web successfully');
  } catch (error) {
    handleCrawlError('Please check Settings to see if updates have been applied.');
  }
};

const summaryData = async () => {
  isLoaded.value = true
  isDisabled.value = true

  if (models.value?.length === 0) {
    handleCrawlError('Please choose a model!');
    return;
  }

  if (!result.value) {
    handleCrawlError('Please enter the text!');
    return;
  }

  const text = result.value
  const texts = text.split('\n')

  if (texts.length === 0) {
    handleCrawlError('Please enter the text!');

    return
  }

  let prompt = 'Sử dụng @docs để phân tích và tóm tắt tài liệu một cách kỹ lưỡng. Không chỉ bao gồm các điểm chính mà còn xác định bất kỳ khoảng trống hoặc lĩnh vực nào cần cải thiện. Sau khi tóm tắt, hãy đưa ra các khuyến nghị khả thi dựa trên phân tích. Trả lời bằng tiếng Việt'
  isSummary.value = false

  try {
    result.value = await summary(prompt, text, selectedModel.value)
    handleCrawlSuccess('Summary text successfully')
  } catch (error) {
    handleCrawlError('Please check Settings to see if updates have been applied.')
  }
}

const speechData = async () => {
  isLoaded.value = true
  isDisabled.value = true
  if (!result.value) {
    handleCrawlError('Please enter the text!')
    return
  }

  try {
    isSpeech.value = false
    audioSrc.value = await speech(result.value)
    handleCrawlSuccess('Speechify text successfully')
  } catch (error) {
    handleCrawlError('Please check Settings to see if updates have been applied.')
  }
}

</script>

<template>
  <div class="container mx-auto max-w-2xl px-2 py-4">
    <div class="bg-white shadow-lg rounded-xl overflow-hidden">
      <!-- Toolbar and animation -->
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-3">
        <div class="grid grid-cols-5 gap-2">
          <!-- Translate -->
          <ActionButton
            iconPath="M8.855 10.322a2.476 2.476 0 1 1 .133-4.241m6.053 4.241a2.475 2.475 0 1 1 .133-4.241M2 1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"
            @click="translateData"
            tooltipText="Translate text"
            viewBox="0 0 20 16"
            buttonClass="bg-white text-gray-800"
          />

          <!-- Fire crawl -->
          <ActionButton
            iconPath="M18.122 17.645a7.185 7.185 0 0 1-2.656 2.495 7.06 7.06 0 0 1-3.52.853 6.617 6.617 0 0 1-3.306-.718 6.73 6.73 0 0 1-2.54-2.266c-2.672-4.57.287-8.846.887-9.668A4.448 4.448 0 0 0 8.07 6.31 4.49 4.49 0 0 0 7.997 4c1.284.965 6.43 3.258 5.525 10.631 1.496-1.136 2.7-3.046 2.846-6.216 1.43 1.061 3.985 5.462 1.754 9.23Z"
            @click="toogleFirecrawl"
            tooltipText="Crawl Web"
            viewBox="0 0 24 24"
            :buttonClass="isCrawl ? 'bg-green-500 text-white' : 'bg-white text-gray-800'"
          />

          <!-- Summary -->

          <ActionButton
            iconPath="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"
            @click="toogleSummary"
            tooltipText="Summary Text"
            viewBox="0 0 24 24"
            :buttonClass="isSummary ? 'bg-purple-500 text-white' : 'bg-white text-gray-800'"
            class="hidden"
          />

          <!-- Speech -->
          <ActionButton
            iconPath="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
            @click="toogleSpeech"
            tooltipText="Speechify Text"
            viewBox="0 0 24 24"
            :buttonClass="isSpeech ? 'bg-orange-500 text-white' : 'bg-white text-gray-800'"
            class="hidden"
          />

          <!-- Fullscreen -->
          <ActionButton
            iconPath="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
            @click="openFullscreen"
            tooltipText="Fullscreen"
            viewBox="0 0 19 19"
          />
        </div>
      </div>

      <!-- Options section -->
      <div class="p-4">
        <!-- Options Firecrawl -->
        <div v-if="isCrawl" class="space-y-3 animate-fade-in">
          <input
            v-model="url"
            type="text"
            :disabled="isDisabled"
            placeholder="enter url (ex: https://firecrawl.dev)"
            class="w-full p-2 border border-green-200 rounded focus:ring-1 focus:ring-green-500 text-sm"
          />
          <div class="grid hidden">
            <select
              v-model="fillCrawl"
              class="w-full p-2 border border-green-200 rounded focus:ring-1 focus:ring-green-500 text-sm"
            >
              <option v-for="item in fillCrawls" :key="item.name" :value="item.incl">
                {{ item.name }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <input
              v-model="include"
              type="text"
              placeholder="Include (ex: .inarticle-wrapper)"
              class="w-full p-2 border border-green-200 rounded focus:ring-1 focus:ring-green-500 text-sm"
            />
            <input
              v-model="exclude"
              type="text"
              placeholder="Exclude (ex: #nl-container)"
              class="w-full p-2 border border-green-200 rounded focus:ring-1 focus:ring-green-500 text-sm"
            />
          </div>
          <button
            @click="firecrawler"
            class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-all transform active:scale-95 text-sm"
          >
            Crawl Web
          </button>
        </div>

        <!-- Options Summary -->
        <div v-if="isSummary" class="space-y-3 animate-fade-in">
          <div class="grid grid-cols-4 gap-2">
            <label
              v-for="model in models.options"
              :key="model.value"
              class="flex items-center space-x-1 p-2 bg-purple-50 rounded cursor-pointer hover:bg-purple-100 transition-all text-center justify-center text-sm"
              :class="selectedModel === model.value ? 'ring-1 ring-purple-500' : ''"
            >
              <input
                type="radio"
                :value="model.value"
                v-model="selectedModel"
                class="hidden"
              />
              <span>{{ model.label }}</span>
            </label>
          </div>

          <button
            @click="summaryData"
            :disabled="!selectedModel"
            class="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Summary Text
          </button>
        </div>

        <!-- Options Speech -->
        <div v-if="isSpeech" class="space-y-3 animate-fade-in">
          <select
            v-model="voice"
            class="w-full p-2 border border-orange-200 rounded focus:ring-1 focus:ring-orange-500 text-sm"
          >
            <option v-for="item in voices" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
          <button
            @click="speechData"
            class="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition-all transform active:scale-95 text-sm"
          >
            Speechify Text
          </button>
        </div>

        <!-- Textarea main -->
        <textarea
          v-model="result"
          rows="8"
          class="mt-3 w-full p-3 border border-blue-100 rounded focus:ring-1 focus:ring-blue-500 transition-all bg-blue-50/50 text-gray-800 placeholder-gray-500 text-sm"
          placeholder="Enter text here ..."
          :disabled="isDisabled"
          v-if="!convertedHtml"
        ></textarea>

        <div
          v-if="convertedHtml"
          class="preview-container w-full h-96 p-4 border rounded-lg overflow-auto
                   animate-fade-in dark:bg-gray-700 dark:text-gray-200"
          v-html="convertedHtml"
        ></div>

        <!-- button clear -->
        <button
          @click="result = ''"
          class="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-all transform active:scale-95 text-sm mt-2"
        > Clear </button>

        <!-- Audio Player -->
        <div v-if="audioSrc" class="mt-3 animate-bounce-in bg-orange-50 p-2 rounded">
          <audio
            controls
            class="w-full rounded"
            :src="audioSrc"
          />
        </div>

        <!-- Loading Indicator -->
        <Loading :isLoaded="isLoaded" />
      </div>
    </div>
  </div>

  <!-- Toast Message -->
  <Toast :text="messToast" :isShow="showToast" :isSuccess="isToastSuccess" />
</template>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.1);
  }
  70% {
    opacity: 1;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-bounce-in {
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}
</style>