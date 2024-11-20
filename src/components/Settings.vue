<template>
  <div class="p-6 space-y-8">
    <!-- Update Configuration Section -->
    <div
      class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div class="flex items-start justify-between">
        <!-- Left side - Text content -->
        <div class="space-y-2">
          <h2 class="text-xl font-semibold text-slate-800">
            Update Configuration
          </h2>
          <p class="text-slate-600 max-w-lg">
            Update your extension settings with a single click. All your preferences will be applied immediately.
          </p>
        </div>

        <!-- Right side - Update button -->
        <button
          @click="updateConfig"
          :disabled="isDisabled"
          class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transform hover:-translate-y-0.5 transition-all duration-300 group shadow-sm hover:shadow-blue-200 hover:shadow-lg"
        >
          <!-- Animated icon -->
          <svg
            class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span class="font-medium">Update Settings</span>
        </button>
      </div>

      <!-- Optional: Add status indicator -->
      <div v-if="configStatus" class="mt-4 flex items-center gap-2 text-sm text-green-600">
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Settings are up to date</span>
      </div>
    </div>

    <!-- Current Configuration Display -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800">
          Current Configuration
        </h3>
        <span class="text-sm text-slate-500">Last updated: {{ lastTimeUpdated }}</span>
      </div>

      <!-- Configuration preview -->
      <div class="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
        <!-- Settings list -->
        <div class="space-y-2">
          <div
            v-for="(feature, key) in configFeatures"
            :key="key"
            class="flex items-center justify-between py-2 border-b border-slate-100"
          >
            <span class="text-slate-600">{{ key }}</span>
            <span :class="{'text-green-600': feature, 'text-red-600': !feature}">
              {{ feature ? 'Enabled' : 'Disabled' }}
            </span>
          </div>
        </div>

        <!-- Optional: Add expand button for full config -->
        <button
          class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
          @click="showFullConfig"
        >
          View full configuration
        </button>
      </div>
    </div>

    <!-- Add modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      @click="isModalOpen = false"
    >
      <!-- Modal content -->
      <div
        class="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] mx-4 overflow-hidden transform transition-all duration-300 animate-modal-enter"
        @click.stop
      >
        <!-- Modal header -->
        <div
          class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 class="text-lg font-semibold text-slate-800">
            Full Configuration
          </h3>
          <button
            @click="isModalOpen = false"
            class="text-slate-400 hover:text-slate-600 transition-colors duration-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal body -->
        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <!-- Configuration sections -->
          <div class="space-y-6">
            <!-- General Settings -->
            <div class="space-y-4">
              <h4 class="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                General Settings
              </h4>
              <div class="bg-slate-50 rounded-lg p-4 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-slate-600">Version</span>
                  <span class="font-mono text-slate-800">1.0.0</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-600">Last Updated</span>
                  <span class="font-mono text-slate-800">{{ lastDateUpdated }}</span>
                </div>
              </div>
            </div>

            <!-- Feature Settings -->
            <div class="space-y-4">
              <h4 class="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Feature Settings
              </h4>
              <div class="bg-slate-50 rounded-lg p-4 space-y-3">
                <div class="flex items-center justify-between" v-for="(feature, key) in configFeatures" :key="key">
                  <span class="text-slate-600">{{ key }}</span>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                   {{ feature ? 'Enabled' : 'Disabled' }}
                </span>
                </div>
              </div>
            </div>

            <!-- Advanced Settings -->
            <div class="space-y-4">
              <h4 class="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Advanced Settings
              </h4>
              <div class="bg-slate-50 rounded-lg p-4 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-slate-600">Cache Duration</span>
                  <span class="font-mono text-slate-800">30 minutes</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-600">Rate Limit</span>
                  <span class="font-mono text-slate-800">100 requests/hour</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-600">Timeout</span>
                  <span class="font-mono text-slate-800">5000ms</span>
                </div>
              </div>
            </div>

            <!-- Raw JSON -->
            <div class="space-y-4">
              <h4
                class="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                <span>Raw JSON Configuration</span>
                <button
                  @click="copyToClipboard"
                  class="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors duration-300 flex items-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy JSON
                </button>
              </h4>
              <pre class="bg-slate-900 rounded-lg p-4 overflow-x-auto">
              <code class="text-sm font-mono text-slate-100">
{
  "version": "0.0.1",
  "features": {
    "translation": true,
    "crawlUrl": true,
    "textSummary": true,
    "speechToText": true
  },
  "advanced": {
    "cacheDuration": 1800,
    "rateLimit": 100,
    "timeout": 5000
  }
}</code>
            </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Message -->
  <Transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transform transition ease-in duration-300"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 z-50"
    >
      <div class="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span class="font-medium">Copied to clipboard!</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const showToast = ref(false)
const isModalOpen = ref(false)
const configStatus = ref(false)
const configFeatures = ref({
  'Translation Feature': false,
  'Crawl URL Feature': false,
  'Text Summary': false,
  'Speech to Text': false
})
const isDisabled = ref(false)
const lastTimeUpdated = ref('2 hours ago')
const lastDateUpdated = ref(new Date().toLocaleTimeString())

chrome.storage.sync.get(['settings'], (result) => {
  if (result.settings) {
    configStatus.value = true
    isDisabled.value = true
    Object.keys(configFeatures.value).forEach((key) => {
      configFeatures.value[key] = true
    })
  }
})

const updateConfig = async () => {
  const url = 'https://manguonmopodcast.b-cdn.net/setting.json'
  try {
    const response = await fetch(url)
    const data = await response.json()
    const lastUpdated = new Date().toLocaleTimeString()
    if (data) {
      chrome.storage.sync.set({ settings: data }, () => {
        configStatus.value = true

        Object.keys(configFeatures.value).forEach((key) => {
          configFeatures.value[key] = true
        })
        lastTimeUpdated.value = lastUpdated + ' ago'
        lastDateUpdated.value = lastUpdated
      })
    }
  } catch (error) {
    console.error('Failed to update configuration:', error)
  }
}

const showFullConfig = () => {
  isModalOpen.value = !isModalOpen.value
}

const copyToClipboard = () => {
  const json = `{
  "version": "0.0.1",
  "features": {
    "translation": true,
    "crawlUrl": true,
    "textSummary": true,
    "speechToText": true
  },
  "advanced": {
    "cacheDuration": 1800,
    "rateLimit": 100,
    "timeout": 5000
  }
}`
  navigator.clipboard.writeText(json)

  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>
<style scoped></style>
