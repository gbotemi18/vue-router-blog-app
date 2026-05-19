<script setup>
defineProps({
  post: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="post-card">
    <div class="post-card__meta">
      <span>{{ post.category || 'General' }}</span>
      <span>{{ post.publishedLabel }}</span>
    </div>

    <div>
      <h3>{{ post.title }}</h3>
      <p class="post-card__excerpt">{{ post.excerpt }}</p>
    </div>

    <div class="post-card__footer">
      <RouterLink
        class="link-pill"
        :to="{ name: 'post-detail', params: { postId: post.id } }"
      >
        Read article
      </RouterLink>
      <span class="read-time">{{ post.readTime }} min read</span>
    </div>
  </article>
</template>
