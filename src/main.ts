import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from '@/App.vue'
import { router } from '@/router'
import { i18n } from '@/shared/i18n'
import { pinia } from '@/shared/providers/pinia'
import { queryClient } from '@/shared/providers/vue-query'
import '@/style.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(VueQueryPlugin, {
  queryClient,
})

app.mount('#app')
