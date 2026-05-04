import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { router } from '@/router'
import { i18n } from '@/shared/i18n'
import { queryClient } from '@/shared/providers/vue-query'
import '@/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(VueQueryPlugin, {
  queryClient,
})

app.mount('#app')
