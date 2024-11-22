import 'vue-global-api'
import { createApp } from 'vue'
// @ts-ignore
import router from './router'
import '../styles'
import FullscreenApp from './Fullscreen.vue';

const app = createApp(FullscreenApp)
app.use(router)

app.mount('#app')
