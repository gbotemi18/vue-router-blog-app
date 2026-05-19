<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: null,
  },
  pageNumber: {
    type: Number,
    default: 1,
  },
})

const paddedIndex = computed(() => {
  return props.index === null ? null : String(props.index).padStart(2, '0')
})

const statusClass = computed(() => {
  const status = props.post.status?.toLowerCase()

  return status ? `post-card__status post-card__status--${status}` : 'post-card__status'
})

const postLocation = computed(() => {
  const query = props.pageNumber > 1 ? { page: String(props.pageNumber) } : {}

  return {
    name: 'post-detail',
    params: { postId: props.post.id, slug: props.post.slug },
    query,
  }
})
</script>

<template>
  <RouterLink class="post-card" :to="postLocation">
    <div class="post-card__top">
      <span v-if="paddedIndex" class="post-card__index">{{ paddedIndex }}</span>

      <div class="post-card__meta">
        <span>{{ post.publishedLabel }}</span>
        <span :class="statusClass">{{ post.status || 'POST' }}</span>
      </div>
    </div>

    <div class="post-card__body">
      <p class="eyebrow">{{ post.category || 'General' }}</p>
      <h3 class="post-card__title">{{ post.title }}</h3>
      <p class="post-card__excerpt">{{ post.excerpt }}</p>
    </div>

    <div class="post-card__footer">
      <span class="post-card__cta">Open article</span>
      <span class="read-time">{{ post.readTime }} min read</span>
    </div>
  </RouterLink>
</template>
