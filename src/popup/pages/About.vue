<template>
  <div class="max-w-2xl mx-auto p-4 space-y-6">
    <!-- Profile Header -->
    <div class="bg-white rounded-xl shadow-sm p-6 relative">
      <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl"></div>

      <div class="relative flex flex-col items-center">
        <!-- Avatar -->
        <div class="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white
            transition-all duration-300
            hover:scale-105
            hover:shadow-xl
            group">
          <img
            src="https://manguonmopodcast.b-cdn.net/photo.png"
            alt="Profile"
            class="w-full h-full object-cover
           transition-transform duration-300
           group-hover:scale-110
           group-hover:rotate-3"
          />
        </div>

        <!-- Name and Status -->
        <div class="mt-4 text-center">
          <h1 class="text-xl font-semibold text-gray-900
             animate-fade-in-down
             hover:text-blue-600
             transition-colors
             duration-300
             cursor-pointer">By Diep Do</h1>
          <p class="text-sm text-gray-500
            animate-fade-in-up
            hover:text-green-600
            transition-colors
            duration-300">Software Developer</p>
        </div>

        <!-- Quick Stats -->
        <div class="flex items-center space-x-6 mt-4">
          <div class="text-center
              transform
              hover:scale-110
              transition-transform
              duration-300
              hover:shadow-lg
              p-2
              rounded-lg">
            <div class="text-xl font-semibold text-gray-900
                animate-pulse-slow">NA
            </div>
            <div class="text-xs text-gray-500
                animate-fade-in-right">Projects
            </div>
          </div>

          <div class="text-center
              transform
              hover:scale-110
              transition-transform
              duration-300
              hover:shadow-lg
              p-2
              rounded-lg">
            <div class="text-xl font-semibold text-gray-900
                animate-pulse-slow">NA
            </div>
            <div class="text-xs text-gray-500
                animate-fade-in-right
                delay-100">Followers
            </div>
          </div>

          <div class="text-center
              transform
              hover:scale-110
              transition-transform
              duration-300
              hover:shadow-lg
              p-2
              rounded-lg">
            <div class="text-xl font-semibold text-gray-900
                animate-pulse-slow">NA
            </div>
            <div class="text-xs text-gray-500
                animate-fade-in-right
                delay-200">Following
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 gap-4">
      <button
        @click="toggleFollow"
        :class="[
        'flex items-center justify-center space-x-2 p-3',
        'rounded-lg transition-all duration-300',
        'transform hover:scale-105 hover:shadow-lg active:scale-95',
        'group relative overflow-hidden',
        isFollowed
          ? 'bg-red-500 text-white'
          : 'bg-green-500 text-white'
      ]">
      <span
        class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
        :class="isFollowed ? 'bg-red-600' : 'bg-green-600'"
      ></span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 transition-transform group-hover:rotate-12"
          :class="{ 'text-white': isFollowed }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path
            :d="isFollowed
            ? 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'
            : 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'"
          ></path>
        </svg>
        <span
          class="relative z-10"
          :class="{ 'animate-pulse-fast': isFollowed }">
        {{ isFollowed ? 'Followed' : 'Follow me' }}
      </span>
      </button>

      <button
        @click="toggleFavorite"
        :class="[
        'flex items-center justify-center space-x-2 p-3',
        'rounded-lg transition-all duration-300',
        'transform hover:scale-105 hover:shadow-lg active:scale-95',
        'group relative overflow-hidden',
        isFavorited
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      ]">
      <span
        class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
        :class="isFavorited ? 'bg-green-600' : 'bg-red-600'"
      ></span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 transition-transform group-hover:rotate-12"
          :class="{ 'text-white': isFavorited }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        <span
          class="relative z-10"
          :class="{ 'animate-pulse-fast': isFavorited }">
        {{ isFavorited ? 'Favorited' : 'Favourite' }}
      </span>
      </button>
    </div>

    <!-- Profile Sections -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- About Section -->
      <div class="bg-white rounded-xl shadow-sm p-6 space-y-4
              hover:scale-105 transition-all duration-500 ease-in-out
              hover:shadow-2xl hover:border-l-4 hover:border-blue-500
              animate-fade-in-up">
        <h2 class="text-lg font-semibold text-gray-900
               animate-bounce-slow">About</h2>
        <div class="space-y-3">
          <div class="flex items-center space-x-3 text-sm
                  transform hover:translate-x-2 transition-transform duration-300
                  hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400
                                                      animate-pulse" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="text-gray-600">Living in <span class="font-medium text-gray-900
                                                        hover:text-blue-700 transition-colors">Vietnam</span></span>
          </div>
          <div class="flex items-center space-x-3 text-sm
                  transform hover:translate-x-2 transition-transform duration-300
                  hover:text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400
                                                      animate-pulse" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-gray-600">Joined the tech world in <span class="font-medium text-gray-900
                                                                     hover:text-green-700 transition-colors">September 2021</span></span>
          </div>
        </div>
      </div>

      <!-- Main Convenient Features -->
      <div class="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-900">Main Convenient Features</h2>
        <div class="space-y-4">
          <div
            class="feature-item opacity-0 translate-x-[-20px] transition-all duration-500 ease-out hover:bg-gray-50 hover:shadow-sm rounded-lg p-2 group">
            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xs">
                1
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">Text-to-Speech Conversion</p>
                <p class="text-xs text-gray-600">Sometimes listening is easier than reading. Convert text to natural
                  speech effortlessly.</p>
              </div>
            </div>
          </div>

          <div
            class="feature-item opacity-0 translate-x-[-20px] transition-all duration-500 ease-out hover:bg-gray-50 hover:shadow-sm rounded-lg p-2 group">
            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xs">
                2
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">Easy Data Download</p>
                <p class="text-xs text-gray-600">Quickly download information in text format with just a few clicks.</p>
              </div>
            </div>
          </div>

          <div
            class="feature-item opacity-0 translate-x-[-20px] transition-all duration-500 ease-out hover:bg-gray-50 hover:shadow-sm rounded-lg p-2 group">
            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-xs">
                3
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">Intelligent Text Summarization</p>
                <p class="text-xs text-gray-600">Grasp key content instantly without reading entire documents.</p>
              </div>
            </div>
          </div>

          <div
            class="feature-item opacity-0 translate-x-[-20px] transition-all duration-500 ease-out hover:bg-gray-50 hover:shadow-sm rounded-lg p-2 group">
            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-xs">
                4
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">One-Click Translation</p>
                <p class="text-xs text-gray-600">Instantly translate documents between multiple languages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Section -->
    <div class="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <h2 class="text-lg font-semibold text-gray-900">Privacy</h2>

      <!-- Privacy Settings -->
      <div class="flex items-center justify-between hover:bg-gray-50 transition-all duration-300 rounded-lg p-2 group">
        <div>
          <h3 class="text-sm font-medium text-gray-900 transition-transform group-hover:translate-x-1">Personal
            Information Protection</h3>
          <p class="text-xs text-gray-500 transition-opacity group-hover:opacity-80">Keep your personal information safe
            and ensure your data is protected from unauthorized access.</p>
        </div>
        <button
          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-blue-500 hover:scale-105 active:scale-95"
          role="switch" aria-checked="true">
      <span
        class="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out hover:shadow-lg"></span>
        </button>
      </div>

      <!-- Two-Factor Auth -->
      <div class="flex items-center justify-between hover:bg-gray-50 transition-all duration-300 rounded-lg p-2 group">
        <div>
          <h3 class="text-sm font-medium text-gray-900 transition-transform group-hover:translate-x-1">Enhanced
            Security</h3>
          <p class="text-xs text-gray-500 transition-opacity group-hover:opacity-80">Utilize advanced authentication
            measures to safeguard your account and personal data.</p>
        </div>
        <button
          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-blue-500 hover:scale-105 active:scale-95"
          role="switch" aria-checked="true">
      <span
        class="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out hover:shadow-lg"></span>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const isFollowed = ref(false)
const isFavorited = ref(false)
const showFireworks = ref(false)

const triggerFireworks = () => {
  showFireworks.value = true
  setTimeout(() => {
    showFireworks.value = false
  }, 1500)
}

const toggleFollow = async () => {
  isFollowed.value = !isFollowed.value
  triggerFireworks()

  await chrome.storage.sync.set({
    followed: isFollowed.value
  })
}

const toggleFavorite = async () => {
  isFavorited.value = !isFavorited.value
  triggerFireworks()

  await chrome.storage.sync.set({
    favorited: isFavorited.value
  })
}

onMounted(async () => {
  const result = await chrome.storage.sync.get(['followed', 'favorited'])
  isFollowed.value = result.followed || false
  isFavorited.value = result.favorited || false
})
</script>
<style scoped>
@keyframes fadeInSlide {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.feature-item:nth-child(1) {
  animation: fadeInSlide 0.5s forwards;
  animation-delay: 0.1s;
}

.feature-item:nth-child(2) {
  animation: fadeInSlide 0.5s forwards;
  animation-delay: 0.2s;
}

.feature-item:nth-child(3) {
  animation: fadeInSlide 0.5s forwards;
  animation-delay: 0.3s;
}

.feature-item:nth-child(4) {
  animation: fadeInSlide 0.5s forwards;
  animation-delay: 0.4s;
}
.firework {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle,
  rgba(255,255,255,1) 0%,
  rgba(255,100,100,1) 50%,
  rgba(255,0,0,0) 100%
  );
  border-radius: 50%;
  animation: firework 1.5s ease-out infinite;
  opacity: 0;
}
</style>
