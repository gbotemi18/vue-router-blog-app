<script setup>
defineProps({
  label: {
    type: String,
    default: 'Loading content...',
  },
})
</script>

<template>
  <section class="panel loading-panel" aria-live="polite" aria-busy="true">
    <div class="spinner" aria-hidden="true"></div>
    <div>
      <p class="eyebrow">Loading</p>
      <h2>{{ label }}</h2>
      <p class="loading-panel__copy">
        The page is on its way.
      </p>
    </div>
  </section>
</template>
