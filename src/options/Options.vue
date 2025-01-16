<template>
  <div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6" v-if="convertedHtml">
    <div class="flex w-full max-w-4xl space-x-8 h-[calc(100vh-3rem)]">
      <!-- Left Panel -->
      <div class="flex flex-col bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95
                  transform transition-all duration-300 overflow-hidden">
        <div class="flex justify-between items-center flex-shrink-0">
          <h1 class="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 animate-fade-in">
            Full screen
          </h1>
          <div class="flex space-x-2">
            <button
              @click="speechData"
              :disabled="isDisabled"
              class="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
               text-white px-4 py-3 rounded-xl
               shadow-lg hover:shadow-xl
               transform hover:-translate-y-0.5 active:translate-y-0
               transition-all duration-150 ease-in-out
               flex items-center justify-center relative
               disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'from-green-600 to-green-700': isSpeech }"
            >
              <!-- Loading Spinner -->
              <div v-if="isLoaded && !isSpeech"
                   class="absolute inset-0 flex items-center justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>

              <!-- Speaking Animation -->
              <div v-if="isSpeech" class="absolute inset-0 rounded-xl">
                <div class="absolute inset-0 rounded-xl animate-ping bg-green-400 opacity-20"></div>
                <div class="absolute inset-0 rounded-xl animate-pulse bg-green-400 opacity-10"></div>
              </div>

              <!-- Speaker Icon -->
              <svg
                v-show="!isLoaded || isSpeech"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 transition-transform duration-150"
                :class="{ 'animate-pulse': isSpeech }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            </button>

            <!-- Hidden audio element -->
            <audio
              ref="audioPlayer"
              class="hidden"
              @ended="handleAudioEnded"
              @error="handleAudioError"
            ></audio>

            <button
              @click="translateMessage"
              class="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl
                     shadow-lg hover:shadow-xl
                     transform hover:-translate-y-0.5 active:translate-y-0
                     transition-all duration-150 ease-in-out
                     flex items-center gap-3"
            >
              <svg
                class="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-150"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 8L10 13M4 14L10 8L12 5M2 5H14M7 2H8M12.913 17H20.087M12.913 17L11 21M12.913 17L15.7783 11.009C16.0092 10.5263 16.1246 10.2849 16.2826 10.2086C16.4199 10.1423 16.5801 10.1423 16.7174 10.2086C16.8754 10.2849 16.9908 10.5263 17.2217 11.009L20.087 17M20.087 17L22 21"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                />
              </svg>
              <span class="group-hover:translate-x-0.5 transition-transform duration-150">Translate</span>
            </button>
          </div>
        </div>

        <!-- Content area with overflow handling -->
        <div class="flex-1 overflow-y-auto">
          <div class="prose prose-lg dark:prose-invert max-w-none animate-slide-up" v-html="convertedHtml"></div>
        </div>
      </div>

      <!-- Right Panel -->
      <div id="app">
        <!-- icon right -->
        <div id="chatToggle" @click="handleChatToggle" class="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full cursor-pointer shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </div>

        <!-- Form chat  -->
        <div id="chatContainer" class="fixed bottom-20 right-4 w-full max-w-md bg-white rounded-lg shadow-lg" v-if="isChatOpen">
          <div class="p-4 border-b border-gray-200">
            <h1 class="text-center text-xl font-semibold text-gray-800">
              Agent newspaper
            </h1>
            <button id="closeChatBtn" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700" @click="handleChatToggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="flex justify-center mx-3 mt-3">
            <span
              class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium">
              Keywords: {{ keys.length }}
            </span>
          </div>

          <div class="bg-gray-50/50 dark:bg-gray-700/30 rounded-xl p-4 mb-6 backdrop-blur-sm flex-shrink-0 max-h-48 overflow-y-auto">
            <div class="flex flex-wrap gap-2">
              <span v-for="keyword in keys"
                    :key="keyword"
                    @click="handleKeywordClick(keyword)"
                    class="inline-flex items-center px-4 py-2 rounded-lg
                           text-sm font-medium bg-white dark:bg-gray-800
                           text-blue-600 dark:text-blue-400
                           shadow-sm hover:shadow-md
                           hover:bg-blue-50 dark:hover:bg-gray-700
                           transition-all duration-200 cursor-pointer
                           transform hover:scale-105 hover:-translate-y-0.5">
                {{ keyword }}
              </span>
            </div>
          </div>

          <div class="p-4 space-y-4 h-[440px] overflow-y-auto">
            <div class="flex items-start space-x-2"
                 v-for="(message, index) in messages" :key="index"
                 :class="message?.sender === 'user' ? 'justify-end' : ''">
              <img alt="AI avatar" class="w-10 h-10 rounded-full" v-if="message?.sender !== 'user'"
                   src="https://image.pollinations.ai/prompt/A%20minimalist%20logo%20for%20a%20newspaper%20called%20%22Agent%2C%22%20featuring%20a%20bold%2C%20sans-serif%20font%20for%20the%20text%20%22Agent.%22%20The%20letter%20%22A%22%20is%20stylized%20as%20a%20magnifying%20glass%2C%20symbolizing%20investigation%20and%20discovery.%20The%20color%20palette%20is%20monochrome%20black%20and%20white%2C%20giving%20it%20a%20modern%20and%20professional%20appearance.%20The%20overall%20design%20exudes%20clarity%20and%20authority%2C%20ideal%20for%20a%20high-profile%20news%20publication.?seed=42&model=flux-pro&width=1024&height=1024"/>
              <div class="p-3 rounded-lg max-w-[80%]" :class="message?.sender === 'user' ? 'bg-blue-500' : 'bg-gray-100'">
                <p :class="message?.sender === 'user' ? '' : 'text-gray-700'" v-html="message.text"></p>

              </div>
            </div>
          </div>
          <div class="p-4 border-t border-gray-200">
            <div class="flex items-center space-x-2">
              <textarea
                v-model="newMessage"
                @keyup.enter="sendMessage"
                class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-[50px] max-h-[150px]"
                placeholder="Type a message..."
                rows="1"
                style="overflow-y: auto;"
              ></textarea>
              <button class="bg-blue-500 text-white p-2 rounded-full" @click="sendMessage">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading state -->
  <div v-else class="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6">
    <div class="animate-pulse flex space-x-4">
      <div class="rounded-full bg-blue-400 h-12 w-12"></div>
      <div class="flex-1 space-y-4 py-1">
        <div class="h-4 bg-blue-400 rounded w-3/4"></div>
        <div class="space-y-2">
          <div class="h-4 bg-blue-400 rounded"></div>
          <div class="h-4 bg-blue-400 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { marked } from 'marked'
import { agent, keyword, translate } from '~/logic/aryahcr'
import { speech } from '~/logic/speech'

const result = ref('')
const convertedHtml = ref('')

const messages = ref([])
const newMessage = ref('')

const keys = computed(() => extractKeywords(keywordData.value))
const keywordData = ref('')

// voice
const audioPlayer = ref<HTMLAudioElement | null>(null)
const isLoaded = ref(false)
const isDisabled = ref(false)
const isSpeech = ref(false)

const isChatOpen = ref(false)

const handleChatToggle = () => {
  isChatOpen.value = !isChatOpen.value
}


const handleAudioEnded = () => {
  isSpeech.value = false
  isDisabled.value = false
  isLoaded.value = false
}

const sendMessage = async () => {
  if (newMessage.value.trim() === '') return

  // Add user message
  messages.value.push({
    sender: 'user',
    text: newMessage.value
  })

  const rs = await agent([{
    "role": "user",
    "content": newMessage.value + ' trong tài liệu \n' + result.value
  }], true, true);

  messages.value.push({
    sender: 'bot',
    text: rs.message || 'Có lỗi xảy ra khi xử lý yêu cầu của bạn.'
  });

  // Clear input
  newMessage.value = ''
}

const handleKeywordClick = async (key) => {
  // Add user message
  messages.value.push({
    sender: 'user',
    text: 'Tôi muốn tìm hiểu về từ khóa: ' + key
  })

  try {
    const rs = await agent([{
      "role": "user",
      "content": `Hãy cho tôi biết thông tin về từ khóa "${key}" trong tài liệu \n ${result.value}.`
    }], true, true);


    if (rs.message) {
      messages.value.push({
        sender: 'bot',
        text: rs.message
      });
    }
  } catch (error) {
    console.error('Error fetching information for keyword:', error);
    messages.value.push({
      sender: 'assistant',
      text: 'Xin lỗi, có lỗi xảy ra khi tìm thông tin về từ khóa này.'
    });
  }

  // Clear input
  newMessage.value = ''
}

const extractKeywords = (text) => {
  const lines = text.split('\n');

  const keywordLines = lines.filter(line => line.includes('<code>'));

  return keywordLines.map(line => {
    // remote <p> tag
    line = line.replace(/<\/?p>/g, '');
    const cleanedLine = line.replace(/<\/?code>/g, '');
    return cleanedLine.trim();
  });
}

const getKeywords = async () => {
  // get tabId in url
  const tabId = new URLSearchParams(window.location.search).get('tabId');
  const keywordRs = useLocalStorage(`data-${tabId}`, keywordData);
  if (!keywordRs.value) {
    keywordData.value = await keyword(`
          Find unique shorthand keywords in the following text, and display them in the format <code>keyword</code>:
          ${result.value}

`)

    useLocalStorage(`data-${tabId}`, keywordData.value);
  }

  return keys.value
}

const translateMessage = async () => {
  const text = convertedHtml.value;

  try {
    const res = await translate(text, 'en', 'vi');
    convertedHtml.value = res.translate.result;

    const tabId = new URLSearchParams(window.location.search).get('tabId');
    // save to local storage
    useLocalStorage(`result-vn-${tabId}`, <string>marked(convertedHtml.value));
  } catch (error) {
    console.error('Error translating message:', error);
  }
}

const speechData = async () => {
  try {
    const tabId = new URLSearchParams(window.location.search).get('tabId');
    /**
    const getStoreValue = useLocalStorage(`result-vn-${tabId}`);

    if (getStoreValue.value !== 'undefined') {
      convertedHtml.value = getStoreValue.value;
    }

    const audioSourceStore = await useLocalStorage(`audio-${tabId}`);

    if (audioSourceStore.value !== 'undefined') {
      audioPlayer.value.src = audioSourceStore.value;

      const playPromise = audioPlayer.value.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isSpeech.value = true
            isLoaded.value = false
          })
          .catch(error => {
            console.error('Auto-play failed:', error)
            isDisabled.value = false
            isLoaded.value = false
          })
      }
      return
    } **/

    // console.log("convertedHtml.value", convertedHtml.value.replace(/<\/?[^>]+(>|$)/g, ''));
    const html = convertedHtml.value.replace(/<\/?[^>]+(>|$)/g, '');
    const text = html.replace(/&nbsp;/g, ' ');
    const words = text.split(' ');
    const audioSources = [];

    for (let i = 0; i < words.length; i += 120) {
      const chunk = words.slice(i, i + 120).join(' ');
      const encodeText = encodeURIComponent(chunk);
      const audioSource = await speech(encodeText);
      audioSources.push(audioSource);
    }

    const playAudioSequentially = async (sources) => {
      for (const source of sources) {
        audioPlayer.value.src = source;

        try {
          await audioPlayer.value.play();
          isSpeech.value = true;
          isLoaded.value = false;

          await new Promise((resolve) => {
            audioPlayer.value.onended = resolve;
          });
        } catch (error) {
          console.error('Auto-play failed:', error);
          isDisabled.value = false;
          isLoaded.value = false;
          break;
        }
      }
    };

    if (audioPlayer.value) {
      await playAudioSequentially(audioSources);
    } else {
      isDisabled.value = false;
      isLoaded.value = false;
    }
  } catch (error) {
    console.error('Error speaking text:', error);
  }
}

onMounted(async () => {
  const storeValue = useLocalStorage('result', result);
  result.value = storeValue.value || '';
  convertedHtml.value = <string>marked(result.value);

  await getKeywords();

  messages.value.push({
    sender: 'assistant',
    text: `Keyword: ${keys.value.length}`,
    isFirst: true
  })

  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value.src = ''
  }
})
</script>


<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}

/* Custom scrollbar styling */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(59, 130, 246, 0.2);
  border-radius: 20px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgba(59, 130, 246, 0.4);
}
</style>
