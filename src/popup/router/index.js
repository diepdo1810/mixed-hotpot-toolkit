import { createRouter, createMemoryHistory } from 'vue-router'
import HomeView from '../pages/Home.vue'

const SettingsView = () => import('../pages/Settings.vue')
const AboutView = () => import('../pages/About.vue')
const FeaturesView = () => import('../pages/Feature.vue')

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/features',
      name: 'features',
      component: FeaturesView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    }
  ]
})

export default router
