<script setup>
import PostCard from '../components/PostCard.vue'
import { fetchPosts } from '../services/posts'

const posts = await fetchPosts()
const postCountLabel = `${posts.length} published ${posts.length === 1 ? 'story' : 'stories'}`

if (typeof document !== 'undefined') {
  document.title = 'Field Notes'
}
</script>

<template>
  <section class="panel">
    <div class="section-head">
      <div>
        <p class="eyebrow">Latest posts</p>
        <h2>Recent writing</h2>
      </div>
      <p class="section-meta">{{ postCountLabel }}</p>
    </div>

    <div v-if="posts.length" class="post-grid">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>

    <div v-else class="empty-panel">
      <p class="eyebrow">No content</p>
      <h2>Nothing has been published yet.</h2>
      <p class="empty-copy">Check back later for new posts.</p>
    </div>
  </section>
</template>
