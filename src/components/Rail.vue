<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ChevronRight } from 'lucide-vue-next'
import HorizontalSlider from '@/components/HorizontalSlider.vue'
import Tile from '@/components/Tile.vue'

type RailItem = {
  id: number | string
  title: string
  genres: string[]
  image?: {
    medium?: string | null
    original?: string | null
  } | null
  rating: number | string
}

export type RailBrowseMore = {
  categorySlug: string
  showBrowseMore: boolean
}

const props = withDefaults(
  defineProps<{
    title: string
    items: RailItem[]
    // Caps tiles in the rail
    maxItems?: number
    browseMore?: RailBrowseMore
  }>(),
  {
    maxItems: 20,
    browseMore: undefined,
  }
)

const { t } = useI18n()
const fallbackImageUrl = 'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png'

const visibleItems = computed(() => props.items.slice(0, props.maxItems))

const showBrowseMoreHeaderLink = computed(() => {
  const { categorySlug, showBrowseMore } = props.browseMore ?? {}
  return Boolean(showBrowseMore && categorySlug)
})

const showBrowseMoreTile = computed(() => {
  const { categorySlug, showBrowseMore } = props.browseMore ?? {}
  return Boolean(showBrowseMore && categorySlug && props.items.length > props.maxItems)
})
</script>

<template>
  <section
    :aria-label="t('common.components.rail.showsAriaLabel', { title })"
    class="group/rail relative"
    data-testid="shows-rail"
  >
    <header class="mb-4 flex items-center gap-x-6 gap-y-2 sm:gap-x-8">
      <h2 class="font-header text-foreground sm:text-header-sm text-lg leading-7 font-semibold">
        {{ title }}
      </h2>

      <RouterLink
        v-if="showBrowseMoreHeaderLink"
        :to="{ name: 'browse', params: { category: browseMore!.categorySlug } }"
        class="text-muted hover:text-foreground focus-visible:ring-ring xs:text-sm inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition focus-visible:ring-2 focus-visible:outline-none"
      >
        <span>{{ t('common.actions.seeMore') }}</span>
        <ChevronRight aria-hidden="true" class="h-4 w-4" />
      </RouterLink>
    </header>

    <HorizontalSlider
      :left-arrow-aria-label="t('common.components.rail.scrollLeftAriaLabel')"
      :right-arrow-aria-label="t('common.components.rail.scrollRightAriaLabel')"
    >
      <RouterLink
        v-for="show in visibleItems"
        :key="show.id"
        :to="{ name: 'show-details', params: { id: show.id } }"
        class="rail-tile-link"
      >
        <Tile
          :image-url="show.image?.medium || show.image?.original || fallbackImageUrl"
          :genres="show.genres"
          :rating="show.rating"
          :title="show.title"
        />
      </RouterLink>

      <RouterLink
        v-if="showBrowseMoreTile"
        :to="{ name: 'browse', params: { category: browseMore!.categorySlug } }"
        :aria-label="t('common.components.rail.seeMoreTileAriaLabel')"
        class="rail-tile-link"
      >
        <div class="rail-see-more-tile group" data-testid="see-more-tile">
          <span
            class="font-header text-foreground sm:text-header-sm text-sm leading-6 font-semibold whitespace-nowrap"
          >
            {{ t('common.actions.seeMore') }}
          </span>
          <ChevronRight
            aria-hidden="true"
            class="text-muted h-6 w-6 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </div>
      </RouterLink>
    </HorizontalSlider>
  </section>
</template>

<style scoped>
@reference '../style.css';
@config '../../tailwind.config.ts';

.rail-tile-link {
  @apply w-poster-tile-sm sm:w-poster-tile-md md:w-poster-tile-lg xl:w-poster-tile-xl block shrink-0 snap-start rounded-2xl focus-visible:outline-none;
}

.rail-see-more-tile {
  @apply border-border bg-surface h-poster-tile-sm sm:h-poster-tile-md md:h-poster-tile-lg xl:h-poster-tile-xl max-w-poster-tile-sm sm:max-w-poster-tile-md md:max-w-poster-tile-lg xl:max-w-poster-tile-xl relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border px-3 py-4 text-center shadow-xl;
}
</style>
