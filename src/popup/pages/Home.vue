<template>
  <div class="p-4 bg-gradient-to-br from-white to-slate-50 shadow-lg rounded-lg transform hover:scale-[1.01] transition-all duration-300">
    <!-- Extension Title with hover effect and animation -->
    <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-500">
      Mixed Hotpot Hero Toolkit
    </h1>
    <p class="mt-1 text-sm text-slate-500 hover:text-slate-700 transition-colors duration-300">
      An all-in-one toolkit extension, leveraging open-source technologies for translation, data crawling, summarization, and text-to-speech conversion.
    </p>
    <hr class="my-4 border-t border-slate-200 hover:border-slate-300 transition-colors duration-300" />

    <!-- Features Section -->
    <p class="text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors duration-300">Features</p>
    <ul class="mt-3 space-y-3">
      <!-- Feature items with hover effects -->
      <li class="flex items-center p-2 hover:bg-slate-50 rounded-lg transition-all duration-300 transform hover:translate-x-1 hover:shadow-sm group">
        <input type="checkbox" class="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded cursor-not-allowed" checked disabled/>
        <label class="text-slate-600 group-hover:text-slate-800 transition-colors duration-300">Translation Feature</label>
      </li>

      <li class="flex items-center p-2 hover:bg-slate-50 rounded-lg transition-all duration-300 transform hover:translate-x-1 hover:shadow-sm group">
        <input type="checkbox" class="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded cursor-not-allowed" checked disabled/>
        <label class="text-slate-600 group-hover:text-slate-800 transition-colors duration-300">Crawl URL Feature</label>
      </li>

      <li class="flex items-center p-2 hover:bg-slate-50 rounded-lg transition-all duration-300 transform hover:translate-x-1 hover:shadow-sm group">
        <input type="checkbox" class="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded cursor-not-allowed" checked disabled/>
        <label class="text-slate-600 group-hover:text-slate-800 transition-colors duration-300">Text summary Feature</label>
      </li>

      <li class="flex items-center p-2 hover:bg-slate-50 rounded-lg transition-all duration-300 transform hover:translate-x-1 hover:shadow-sm group">
        <input type="checkbox" class="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded cursor-not-allowed" checked disabled/>
        <label class="text-slate-600 group-hover:text-slate-800 transition-colors duration-300">Speech to text Feature</label>
      </li>

      <li class="flex items-center p-2 hover:bg-slate-50 rounded-lg transition-all duration-300 transform hover:translate-x-1 hover:shadow-sm group">
        <input type="checkbox" class="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded cursor-not-allowed" checked disabled/>
        <label class="text-slate-600 group-hover:text-slate-800 transition-colors duration-300">Combine Crawl and Translate</label>
      </li>

      <li class="flex items-center p-2 hover:bg-slate-50 rounded-lg transition-all duration-300 transform hover:translate-x-1 hover:shadow-sm group">
        <input type="checkbox" class="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded cursor-not-allowed" checked disabled/>
        <label class="text-slate-600 group-hover:text-slate-800 transition-colors duration-300">Combine Crawl and Summary</label>
      </li>

      <li class="flex items-center p-2 hover:bg-slate-50 rounded-lg transition-all duration-300 transform hover:translate-x-1 hover:shadow-sm group">
        <input type="checkbox" class="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded cursor-not-allowed" checked disabled/>
        <label class="text-slate-600 group-hover:text-slate-800 transition-colors duration-300">Combine Crawl and Summary and Speech to text</label>
      </li>
    </ul>

    <!-- Footer Section with animation -->
    <div class="mt-6 text-sm text-slate-400 hover:text-slate-600 transition-colors duration-300">
      <p class="inline-flex items-center space-x-1">
        <span>Powered by</span>
        <span class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">
        Vite & Vue 3
      </span>
      </p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped></style>
