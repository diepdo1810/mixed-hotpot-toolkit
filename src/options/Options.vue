<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6" v-if="convertedHtml">
    <div class="flex w-full max-w-4xl space-x-8">
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full">
        <h1 class="text-4xl font-bold mb-6 animate-fade-in">Full screen</h1>
        <div class="text-gray-700 dark:text-gray-200 text-left leading-relaxed space-y-4 animate-slide-up" v-html="convertedHtml"></div>
      </div>
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full h-96 flex flex-col">
        <h2 class="text-lg font-semibold mb-4 animate-bounce">Agent</h2>
        <div class="flex-1 overflow-y-auto mb-4 space-y-3">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="flex"
            :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[75%] p-3 rounded-lg text-sm animate-slide-in"
              :class="message.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'">

              <div v-html="message.text"></div>


              <div class="flex flex-wrap gap-2 justify-start mt-2" v-if="keys.length > 0
              && message.sender === 'assistant' && message.isFirst">
                <span
                  v-for="(keyword, index) in keys"
                  :key="index"
                  class="bg-blue-50 text-blue-500 font-medium px-3 py-1 rounded-md hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
                  @click="handleKeywordClick(keyword)"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex space-x-2 animate-slide-up">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="enter your message..."
            class="flex-grow p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="sendMessage"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <div class="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <code class="text-gray-700 dark:text-gray-200 text-lg">40404</code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { marked } from 'marked'
// import { keyword } from '~/logic/keyword'
import { agent, keyword } from '~/logic/aryahcr'

const result = ref('')
const convertedHtml = ref('')

const messages = ref([])
const newMessage = ref('')

const keys = computed(() => extractKeywords(keywordData.value))
const keywordData = ref('')

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


  console.log(rs);

  if (rs.message) {
    messages.value.push({
      sender: 'bot',
      text: rs.message
    });
  }

  // Clear input
  newMessage.value = ''
}

const handleKeywordClick = async (key) => {
  console.log(key);

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

`, true)
    useLocalStorage(`data-${tabId}`, keywordData.value);
  }

  return keys.value
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

})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 1.2s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out;
}
</style>
