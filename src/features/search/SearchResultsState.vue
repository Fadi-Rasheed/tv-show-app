<script setup lang="ts">
import SearchEmptyHintState from '@/features/search/SearchEmptyHintState.vue'
import SearchErrorState from '@/features/search/SearchErrorState.vue'
import SearchLoadingState from '@/features/search/SearchLoadingState.vue'
import SearchNoResultsState from '@/features/search/SearchNoResultsState.vue'
import { computed, type Component } from 'vue'

export type SearchResultsViewState = 'emptyHint' | 'loading' | 'error' | 'noResults'

const props = defineProps<{
  state: SearchResultsViewState
}>()

const stateComponentMap: Record<SearchResultsViewState, Component> = {
  emptyHint: SearchEmptyHintState,
  loading: SearchLoadingState,
  error: SearchErrorState,
  noResults: SearchNoResultsState,
}

const activeStateComponent = computed(() => stateComponentMap[props.state])
</script>

<template>
  <component :is="activeStateComponent" />
</template>
