<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const { t } = useI18n()

const navElements = computed(() => [
  { label: t('common.navigation.home'), to: '/' },
  {
    label: t('common.navigation.search'),
    to: '/search',
    icon: 'search' as const,
  },
])
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <NavBar :elements="navElements" />
    <RouterView :key="route.path" />
  </div>
</template>
