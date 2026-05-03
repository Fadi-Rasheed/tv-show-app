<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BackButton from '@/components/BackButton.vue'
import PersonCredit from '@/components/PersonCredit.vue'
import Rail from '@/components/Rail.vue'
import Rating from '@/components/Rating.vue'
import Spinner from '@/components/Spinner.vue'
import UnderlineTabs from '@/components/UnderlineTabs.vue'
import ShowEpisodesPanel from '@/views/show-details/ShowEpisodesPanel.vue'
import {
  relatedItemsFromGenreRails,
  toCategorySlug,
  useShowDetailQuery,
  useShowsByGenreQuery,
} from '@/shared/api/shows/queries'
import type { Person } from '@/shared/types/person'
import { stripHtml } from '@/shared/utils/html'

const props = defineProps<{
  id: string
}>()

const { t } = useI18n()
const router = useRouter()

const showId = computed(() => {
  const n = Number.parseInt(props.id, 10)
  return Number.isFinite(n) && n > 0 ? n : NaN
})

const invalidRouteId = computed(() => !Number.isFinite(showId.value))

const activeTab = ref<'related' | 'details' | 'episodes'>('related')

const showQuery = useShowDetailQuery(showId.value, 'cast')

const genreRailsQuery = useShowsByGenreQuery()

const relatedRailItems = computed(() => {
  const genres = showQuery.data.value?.genres ?? []
  if (!Number.isFinite(showId.value) || !genres.length) {
    return []
  }

  return relatedItemsFromGenreRails(genreRailsQuery.data.value, {
    excludeId: showId.value,
    genres,
  })
})

const summaryPlain = computed(() => {
  const raw = showQuery.data.value?.summary
  if (!raw) {
    return ''
  }

  return stripHtml(raw)
})

const heroImage = computed(
  () =>
    showQuery.data.value?.image?.original ??
    showQuery.data.value?.image?.medium ??
    'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png'
)

const ratingValue = computed(() => showQuery.data.value?.rating?.average ?? null)

const genresDisplay = computed(() => showQuery.data.value?.genres ?? [])

const castMembers = computed((): Person[] => {
  const list = showQuery.data.value?._embedded?.cast
  if (!list?.length) {
    return []
  }

  const seen = new Set<number>()
  const out: Person[] = []
  for (const c of list) {
    if (seen.has(c.person.id)) {
      continue
    }

    seen.add(c.person.id)
    out.push(c.person)
  }

  return out
})

const tabs = computed(() => [
  { value: 'related', label: t('common.pages.showDetails.tabs.related') },
  { value: 'details', label: t('common.pages.showDetails.tabs.details') },
  { value: 'episodes', label: t('common.pages.showDetails.tabs.episodes') },
])
</script>

<template>
  <main
    class="bg-background text-foreground xs:px-5 min-h-screen px-4 py-5 sm:px-6 sm:py-8 lg:px-8"
    data-testid="show-details-page"
  >
    <div class="mb-5 flex items-center sm:mb-6">
      <BackButton @click="router.back()" />
    </div>

    <section
      v-if="invalidRouteId"
      class="bg-surface border-border rounded-xl border px-4 py-5"
      role="alert"
      data-testid="show-details-invalid"
    >
      <p class="font-medium">{{ t('common.pages.showDetails.invalidId') }}</p>
    </section>

    <section
      v-else-if="showQuery.isLoading.value"
      class="flex min-h-40 items-center justify-center"
      data-testid="show-details-loading"
    >
      <Spinner size="lg" />
      <span class="sr-only">{{ t('common.pages.showDetails.loading') }}</span>
    </section>

    <section
      v-else-if="showQuery.isError.value"
      class="bg-surface border-border rounded-xl border px-4 py-5"
      role="alert"
      data-testid="show-details-error"
    >
      <p class="font-medium">{{ t('common.pages.showDetails.errorTitle') }}</p>
      <p class="text-muted sm:text-body-md mt-2 text-sm">
        {{ t('common.pages.showDetails.errorDescription') }}
      </p>
    </section>

    <template v-else-if="showQuery.data.value">
      <header
        class="relative -mx-4 mb-6 min-h-[220px] overflow-hidden sm:-mx-5 sm:min-h-[280px] lg:-mx-8"
      >
        <img
          :alt="showQuery.data.value.name"
          class="h-full w-full object-cover object-center sm:max-h-[min(50vh,420px)]"
          :src="heroImage"
          loading="eager"
        />
        <div
          class="from-background via-background/85 absolute inset-0 bg-linear-to-t to-transparent"
          aria-hidden="true"
        />
        <div class="absolute inset-x-0 bottom-0 px-4 pt-16 pb-6 sm:px-6 lg:px-8">
          <h1
            class="font-header text-foreground sm:text-header-lg mb-3 text-2xl leading-tight font-bold tracking-tight"
            data-testid="show-details-title"
          >
            {{ showQuery.data.value.name }}
          </h1>

          <p
            v-if="summaryPlain"
            class="text-foreground/95 text-body-md sm:text-body-lg mb-4 max-w-3xl leading-relaxed"
            data-testid="show-details-summary"
          >
            {{ summaryPlain }}
          </p>
          <p v-else class="text-muted text-body-md mb-4">
            {{ t('common.pages.showDetails.noSummary') }}
          </p>

          <div
            class="text-muted sm:text-body-md flex flex-wrap items-center gap-x-3 gap-y-2 text-sm"
          >
            <div
              v-if="genresDisplay.length"
              class="flex flex-wrap items-center gap-2"
              :aria-label="t('common.pages.showDetails.genresAria')"
            >
              <RouterLink
                v-for="genre in genresDisplay"
                :key="genre"
                :to="{ name: 'browse', params: { category: toCategorySlug(genre) } }"
                class="text-foreground hover:text-brand-strong focus-visible:ring-ring decoration-border underline underline-offset-4 transition focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                {{ genre }}
              </RouterLink>
            </div>

            <span
              v-if="genresDisplay.length && ratingValue != null"
              aria-hidden="true"
              class="text-border"
            >
              ·
            </span>

            <div
              v-if="ratingValue != null"
              class="inline-flex items-center gap-2"
              :aria-label="t('common.pages.showDetails.ratingAria')"
            >
              <Rating :value="ratingValue" />
            </div>
            <span v-else class="text-muted">{{ t('common.pages.showDetails.noRating') }}</span>
          </div>
        </div>
      </header>

      <div class="max-w-5xl space-y-6">
        <UnderlineTabs
          v-model="activeTab"
          :tabs="tabs"
          :tablist-aria-label="t('common.pages.showDetails.tabsAria')"
        />

        <section
          v-show="activeTab === 'related'"
          :id="'panel-related'"
          role="tabpanel"
          :aria-labelledby="'tab-related'"
          tabindex="0"
          data-testid="panel-related"
        >
          <div
            v-if="genreRailsQuery.isLoading.value"
            class="flex min-h-32 items-center justify-center"
            data-testid="related-loading"
          >
            <Spinner />
            <span class="sr-only">{{ t('common.pages.showDetails.related.loading') }}</span>
          </div>

          <div
            v-else-if="genreRailsQuery.isError.value"
            class="bg-surface border-border rounded-xl border px-4 py-4"
            role="alert"
            data-testid="related-error"
          >
            <p class="text-sm font-medium">{{ t('common.pages.showDetails.errorTitle') }}</p>
            <p class="text-muted mt-1 text-sm">
              {{ t('common.pages.showDetails.errorDescription') }}
            </p>
          </div>

          <p
            v-else-if="!genresDisplay.length"
            class="text-muted sm:text-body-md text-sm"
            data-testid="related-empty-genre"
          >
            {{ t('common.pages.showDetails.related.empty') }}
          </p>

          <p
            v-else-if="!relatedRailItems.length"
            class="text-muted sm:text-body-md text-sm"
            data-testid="related-empty"
          >
            {{ t('common.pages.showDetails.related.empty') }}
          </p>

          <Rail
            v-else
            :title="t('common.pages.showDetails.related.relatedShows')"
            :items="relatedRailItems"
            :max-items="10"
          />
        </section>

        <section
          v-show="activeTab === 'details'"
          :id="'panel-details'"
          role="tabpanel"
          :aria-labelledby="'tab-details'"
          tabindex="0"
          data-testid="panel-details"
        >
          <div
            class="border-border bg-surface/60 rounded-2xl border px-4 py-5 sm:px-6 sm:py-6"
            data-testid="details-panel"
          >
            <h2 class="font-header text-foreground sm:text-header-sm mb-5 text-lg font-semibold">
              {{ t('common.pages.showDetails.details.sectionTitle') }}
            </h2>

            <dl class="space-y-6">
              <div v-if="castMembers.length">
                <dt class="text-foreground sm:text-body-md mb-2 text-sm font-semibold">
                  {{ t('common.pages.showDetails.details.cast') }}
                </dt>
                <dd class="flex flex-wrap gap-3">
                  <PersonCredit v-for="p in castMembers" :key="p.id" :person="p" />
                </dd>
              </div>
              <p v-else class="text-muted text-sm">
                {{ t('common.pages.showDetails.details.emptyCast') }}
              </p>
            </dl>
          </div>
        </section>

        <ShowEpisodesPanel
          v-if="activeTab === 'episodes'"
          :key="showId"
          :show-id="showId"
        />
      </div>
    </template>
  </main>
</template>
