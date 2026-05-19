<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPostById } from '../services/posts'

const route = useRoute()
const router = useRouter()
const post = await fetchPostById(route.params.postId)

const archivePage = Number.parseInt(route.query.page ?? '1', 10)
const archiveRoute = computed(() => {
  return archivePage > 1
    ? { name: 'posts-page', params: { pageNumber: String(archivePage) } }
    : { name: 'home' }
})

onMounted(() => {
  if (route.params.slug !== post.slug) {
    router.replace({
      name: 'post-detail',
      params: { postId: post.id, slug: post.slug },
      query: route.query,
    })
  }
})

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push(archiveRoute.value)
}

if (typeof document !== 'undefined') {
  document.title = `Field Notes | ${post.title}`
}
</script>

<template>
  <article class="detail-shell">
    <div class="detail-actions">
      <button class="back-link" type="button" @click="goBack">
        <span aria-hidden="true">←</span>
        Previous page
      </button>

      <RouterLink class="all-posts-link" :to="archiveRoute">
        All posts
      </RouterLink>
    </div>

    <section class="panel article-panel">
      <header class="article-panel__header">
        <p class="eyebrow">Article</p>
        <h2>{{ post.title }}</h2>
        <div class="article-meta">
          <span>{{ post.category || 'General' }}</span>
          <span>{{ post.publishedLabel }}</span>
          <span>{{ post.readTime }} min read</span>
          <span>{{ post.status || 'POST' }}</span>
        </div>
        <p class="article-intro">{{ post.excerpt }}</p>
      </header>

      <div class="article-body">
        <p v-for="(paragraph, index) in post.paragraphs" :key="`${post.id}-${index}`">
          {{ paragraph }}
        </p>
      </div>

      <footer class="article-panel__footer">
        <div v-if="post.tagList?.length" class="article-tags">
          <span v-for="tag in post.tagList" :key="tag" class="article-tag">
            {{ tag }}
          </span>
        </div>

        <RouterLink class="all-posts-link" :to="archiveRoute">
          Back to archive
        </RouterLink>
      </footer>
    </section>
  </article>
</template>
