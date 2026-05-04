<script setup lang="ts">
import HomeEmptyState from '@/features/home/HomeEmptyState.vue'
import HomeErrorState from '@/features/home/HomeErrorState.vue'
import HomeLoadingState from '@/features/home/HomeLoadingState.vue'
import { computed, type Component } from 'vue'

export type HomeViewState = 'loading' | 'error' | 'empty'

const props = defineProps<{
  state: HomeViewState
}>()

const stateComponentMap: Record<HomeViewState, Component> = {
  loading: HomeLoadingState,
  error: HomeErrorState,
  empty: HomeEmptyState,
}

const activeStateComponent = computed(() => stateComponentMap[props.state])
</script>

<template>
  <component :is="activeStateComponent" />
</template>
