<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import ErrorBoundary from './components/ErrorBoundary.vue'
import LoadingState from './components/LoadingState.vue'

const THEME_STORAGE_KEY = 'field-notes-theme'

const route = useRoute()
const router = useRouter()
const theme = ref('light')
const viewVersion = ref(0)

const pageTitle = computed(() => {
  if (route.name === 'post-detail') {
    return 'Read at your own pace'
  }

  if (route.name === 'not-found') {
    return 'Nothing useful at this address'
  }

  return 'Field Notes'
})

const pageCopy = computed(() => {
  if (route.name === 'post-detail') {
    return 'A clean reading view for a single post, with an easy path back to the list when you are done.'
  }

  if (route.name === 'not-found') {
    return 'The route is missing, but the app will still point you back to somewhere sensible.'
  }

  return 'A small reading list pulled from a live API, with straightforward navigation and clean loading states.'
})

const loadingLabel = computed(() => {
  if (route.name === 'post-detail') {
    return 'Loading article...'
  }

  if (route.name === 'not-found') {
    return 'Checking this page...'
  }

  return 'Loading posts...'
})

const themeButtonLabel = computed(() => {
  return theme.value === 'dark' ? 'Light mode' : 'Dark mode'
})

const themeButtonHint = computed(() => {
  return theme.value === 'dark'
    ? 'Switch to light mode'
    : 'Switch to dark mode'
})

const activeViewKey = computed(() => `${route.fullPath}:${viewVersion.value}`)

function applyTheme(value) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.theme = value
  document.documentElement.style.colorScheme = value
}

function setTheme(value) {
  theme.value = value
  applyTheme(value)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, value)
  }
}

function preferredTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push({ name: 'home' })
}

function retryView(resetError) {
  viewVersion.value += 1
  resetError()
}

function toggleTheme() {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}

onMounted(() => {
  setTheme(preferredTheme())
})
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink class="brand" :to="{ name: 'home' }">Field Notes</RouterLink>

      <nav class="topbar__actions" aria-label="Primary">
        <button
          class="ghost-button theme-toggle"
          type="button"
          :aria-label="themeButtonHint"
          @click="toggleTheme"
        >
          {{ themeButtonLabel }}
        </button>
        <button class="ghost-button" type="button" @click="goBack">
          Previous page
        </button>
        <RouterLink class="ghost-link" :to="{ name: 'home' }">Home</RouterLink>
      </nav>
    </header>

    <main class="layout">
      <section class="hero-panel">
        <p class="eyebrow">Vue Router blog</p>

        <div class="hero-panel__content">
          <div>
            <h1>{{ pageTitle }}</h1>
            <p class="hero-copy">{{ pageCopy }}</p>
          </div>

          <dl class="hero-stats">
            <div>
              <dt>Data</dt>
              <dd>Live API content</dd>
            </div>
            <div>
              <dt>Routes</dt>
              <dd>Lazy loaded views</dd>
            </div>
            <div>
              <dt>Recovery</dt>
              <dd>Errors and 404s</dd>
            </div>
          </dl>
        </div>
      </section>

      <RouterView v-slot="{ Component }">
        <ErrorBoundary :reset-key="activeViewKey">
          <Suspense timeout="0">
            <component :is="Component" :key="activeViewKey" />

            <template #fallback>
              <LoadingState :label="loadingLabel" />
            </template>
          </Suspense>

          <template #error="{ error, resetError }">
            <section class="panel panel--error">
              <p class="eyebrow">
                {{ error.status === 404 ? '404' : 'Loading error' }}
              </p>
              <h2>
                {{
                  error.status === 404
                    ? 'That post could not be found.'
                    : 'This page did not load properly.'
                }}
              </h2>
              <p class="error-copy">
                {{
                  error.message ||
                  'Something went wrong while loading this page.'
                }}
              </p>

              <div class="action-row">
                <button
                  class="solid-button"
                  type="button"
                  @click="retryView(resetError)"
                >
                  Try again
                </button>
                <button class="ghost-button" type="button" @click="goBack">
                  Previous page
                </button>
                <RouterLink
                  class="ghost-link"
                  :to="{ name: 'home' }"
                  @click="resetError()"
                >
                  Home
                </RouterLink>
              </div>
            </section>
          </template>
        </ErrorBoundary>
      </RouterView>
    </main>
  </div>
</template>
