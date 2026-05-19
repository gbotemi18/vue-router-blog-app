<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

if (typeof document !== 'undefined') {
  document.title = 'Field Notes | 404'
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push({ name: 'home' })
}
</script>

<template>
  <section class="panel not-found">
    <p class="eyebrow">404</p>
    <h2>That page does not exist.</h2>
    <p class="not-found__copy">
      The link is either broken or no longer available. You can go back or head
      home.
    </p>

    <div class="action-row">
      <RouterLink class="solid-button" :to="{ name: 'home' }">Go home</RouterLink>
      <button class="ghost-button" type="button" @click="goBack">
        Previous page
      </button>
    </div>
  </section>
</template>
