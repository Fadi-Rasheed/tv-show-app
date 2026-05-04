<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import BackButton from '@/components/BackButton.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

type NavElement = {
  label: string
  to: string
  icon?: 'search'
}

defineProps<{
  elements: NavElement[]
}>()

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const isHomePage = computed(() => route.name === 'home')

function goBack() {
  router.go(-1)
}
</script>

<template>
  <header class="border-border/75 bg-background/75 sticky top-0 z-40 border-b backdrop-blur">
    <nav
      class="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 p-4 sm:gap-4 sm:px-8"
      aria-label="Primary navigation"
    >
      <div class="flex min-w-0 items-center gap-2 justify-self-start sm:gap-3">
        <RouterLink
          to="/"
          class="text-foreground hover:text-brand-strong focus-visible:ring-brand/70 inline-flex min-w-0 items-center gap-2 rounded-lg py-1 pr-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          :aria-label="t('common.app.homeLinkAria')"
        >
          <img src="/favicon.svg" width="32" height="32" alt="" class="h-8 w-8 shrink-0" />
          <span class="font-display text-header-sm xs:inline hidden tracking-tight">{{
            t('common.app.name')
          }}</span>
        </RouterLink>
        <BackButton v-if="!isHomePage" @click="goBack" />
      </div>
      <ul
        class="my-0 flex shrink-0 list-none items-center justify-center gap-4 justify-self-center p-0 sm:gap-10"
        role="list"
      >
        <li v-for="element in elements" :key="element.to">
          <RouterLink
            :to="element.to"
            class="text-muted hover:bg-muted/50 hover:text-foreground focus-visible:ring-brand/70 text-md inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            active-class="bg-brand/15 text-brand-strong ring-brand/30 shadow-sm ring-1"
            exact-active-class="bg-brand/15 text-brand-strong ring-brand/30 shadow-sm ring-1"
          >
            <Search
              v-if="element.icon === 'search'"
              class="h-4 w-4 shrink-0 text-current opacity-90"
              aria-hidden="true"
            />
            {{ element.label }}
          </RouterLink>
        </li>
      </ul>
      <div aria-hidden="true" />
    </nav>
  </header>
</template>
