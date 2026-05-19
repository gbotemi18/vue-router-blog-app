<script setup>
import { useRoute } from 'vue-router'
import { fetchPostById } from '../services/posts'

const route = useRoute()
const post = await fetchPostById(route.params.postId)

if (typeof document !== 'undefined') {
  document.title = `Field Notes | ${post.title}`
}
</script>

<template>
  <article class="panel article-panel">
    <header class="article-panel__header">
      <p class="eyebrow">Article</p>
      <h2>{{ post.title }}</h2>
      <div class="article-meta">
        <span>{{ post.category || 'General' }}</span>
        <span>{{ post.publishedLabel }}</span>
        <span>{{ post.readTime }} min read</span>
      </div>
      <p class="article-intro">{{ post.excerpt }}</p>
    </header>

    <div class="article-body">
      <p v-for="(paragraph, index) in post.paragraphs" :key="`${post.id}-${index}`">
        {{ paragraph }}
      </p>
    </div>
  </article>
</template>
