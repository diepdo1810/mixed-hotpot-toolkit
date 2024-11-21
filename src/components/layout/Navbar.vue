<template>
  <nav class="px-4 py-2.5 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 hover:shadow-md">
    <div class="max-w-2xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <RouterLink
          to="/"
          class="px-3 py-2 rounded-lg inline-flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
          active-class="text-blue-600 bg-blue-50"
        >
          <HeroiconsHome
            class="w-5 h-5 transform transition-transform group-hover:scale-110 group-hover:rotate-3"
          />
          <span class="ml-2 font-medium text-sm opacity-90 group-hover:opacity-100">Home</span>
        </RouterLink>

        <RouterLink
          to="/features"
          class="px-3 py-2 rounded-lg inline-flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
          active-class="text-blue-600 bg-blue-50"
        >
          <HeroiconsChartPie
            class="w-5 h-5 transform transition-transform group-hover:scale-110 group-hover:rotate-3"
          />
          <span class="ml-2 font-medium text-sm opacity-90 group-hover:opacity-100">Features</span>
        </RouterLink>

        <RouterLink
          to="/settings"
          class="px-3 py-2 rounded-lg inline-flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
          active-class="text-blue-600 bg-blue-50"
        >
          <HeroiconsCog6Tooth
            class="w-5 h-5 transform transition-transform group-hover:scale-110 group-hover:rotate-3"
          />
          <span class="ml-2 font-medium text-sm opacity-90 group-hover:opacity-100">Settings</span>
        </RouterLink>
      </div>

      <RouterLink
        to="/about"
        class="px-3 py-2 rounded-lg inline-flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group relative"
        active-class="text-blue-600 bg-blue-50"
      >
        <HeroiconsUser
          class="w-5 h-5 transform transition-transform group-hover:scale-110"
        />
        <div class="absolute -bottom-1 left-1/2 w-1 h-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1/2"></div>
      </RouterLink>
    </div>
  </nav>
</template>
<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.nav-link {
  @apply flex items-center p-1 rounded-md text-slate-500;
}
.router-link-exact-active {
  @apply bg-indigo-50 text-indigo-600;
}
</style>
