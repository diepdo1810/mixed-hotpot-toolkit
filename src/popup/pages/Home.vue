<template>
  <div class="p-4">
    <!-- Extension Title -->
    <h1 class="text-lg font-semibold text-slate-700">d-Extension</h1>
    <p class="mt-1 text-sm text-slate-500">A custom Chrome extension for translation and scraping</p>
    <hr class="my-4" />
    
    <!-- Features Section -->
    <p class="text-sm font-semibold text-slate-600">Features</p>
    <ul class="mt-3 space-y-2">
      <li class="flex items-center">
        <input type="checkbox" id="translation" class="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded" checked/>
        <label for="translation" class="text-slate-600">Translation Feature</label>
      </li>
      <li class="flex items-center">
        <input type="checkbox" id="scrape-url" class="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded" checked/>
        <label for="scrape-url" class="text-slate-600">Scrape URL</label>
      </li>
      <li class="flex items-center">
        <input type="checkbox" id="scrape-translate" class="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded" checked/>
        <label for="scrape-translate" class="text-slate-600">Scrape and Translate</label>
      </li>
    </ul>
    
    <!-- Footer Section -->
    <div class="mt-6 text-sm text-slate-400">
      <p>Powered by Vite & Vue 3</p>
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
