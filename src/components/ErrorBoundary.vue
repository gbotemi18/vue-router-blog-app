<script setup>
import { onErrorCaptured, ref, watch } from 'vue'

const props = defineProps({
  resetKey: {
    type: [String, Number],
    default: 0,
  },
})

const capturedError = ref(null)

function resetError() {
  capturedError.value = null
}

onErrorCaptured((error) => {
  capturedError.value =
    error instanceof Error ? error : new Error(String(error))

  return false
})

watch(
  () => props.resetKey,
  () => {
    resetError()
  },
)
</script>

<template>
  <slot v-if="!capturedError" />

  <slot v-else name="error" :error="capturedError" :resetError="resetError">
    <p>{{ capturedError.message }}</p>
  </slot>
</template>
