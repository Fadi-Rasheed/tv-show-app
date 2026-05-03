<script setup lang="ts">
import { computed } from 'vue'
import BackButton from '@/components/BackButton.vue'
import { useRoute, useRouter } from 'vue-router'

type NavElement = {
  label: string
  to: string
}

defineProps<{
  elements: NavElement[]
}>()

const route = useRoute()
const router = useRouter()

const showBackButton = computed(() => route.path !== '/')

function goBack() {
  router.go(-1)
}
</script>

<template>
  <header class="border-border/80 bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
    <nav
      class="xs:px-5 mx-auto flex w-full max-w-6xl items-center px-4 py-3 sm:px-6 lg:px-8"
      aria-label="Primary navigation"
    >
      <BackButton :visible="showBackButton" @click="goBack" />
      <ul class="m-0 list-none flex items-center gap-2 p-0" role="list">
        <li v-for="element in elements" :key="element.to">
          <RouterLink
            :to="element.to"
            class="text-muted hover:text-foreground focus-visible:ring-brand/70 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            active-class="bg-brand/20 text-brand-strong"
            exact-active-class="bg-brand/20 text-brand-strong"
          >
            {{ element.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
