<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PostCard from '../components/PostCard.vue'
import {
  POSTS_PER_PAGE,
  NotFoundError,
  fetchPostsPage,
} from '../services/posts'

const route = useRoute()
const currentPage = Number.parseInt(route.params.pageNumber ?? '1', 10)

if (!Number.isInteger(currentPage) || currentPage < 1) {
  throw new NotFoundError('That page does not exist.')
}

const { posts, meta } = await fetchPostsPage(currentPage, POSTS_PER_PAGE)

if (posts.length === 0 && currentPage > 1) {
  throw new NotFoundError('That page does not exist.')
}

const featuredPost = posts[0] ?? null
const archivePosts = posts.slice(1)
const postCountLabel = `${meta.total} ${meta.total === 1 ? 'article' : 'articles'}`
const pageLabel = `Page ${meta.page} of ${meta.totalPages}`

const paginationItems = computed(() => {
  if (meta.totalPages <= 7) {
    return Array.from({ length: meta.totalPages }, (_, index) => index + 1)
  }

  const items = [1]
  const start = Math.max(2, meta.page - 1)
  const end = Math.min(meta.totalPages - 1, meta.page + 1)

  if (start > 2) {
    items.push('gap-left')
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page)
  }

  if (end < meta.totalPages - 1) {
    items.push('gap-right')
  }

  items.push(meta.totalPages)
  return items
})

function padIndex(value) {
  return String(value).padStart(2, '0')
}

function pageRoute(page) {
  return page === 1
    ? { name: 'home' }
    : { name: 'posts-page', params: { pageNumber: String(page) } }
}

function postRoute(post) {
  const query = meta.page > 1 ? { page: String(meta.page) } : {}

  return {
    name: 'post-detail',
    params: { postId: post.id, slug: post.slug },
    query,
  }
}

if (typeof document !== 'undefined') {
  document.title =
    meta.page > 1 ? `Field Notes | Page ${meta.page}` : 'Field Notes'
}
</script>

<template>
  <section class="home-stack">
    <section class="panel panel--tight">
      <div class="masthead">
        <div>
          <p class="eyebrow">Latest posts</p>
          <h2>Browse the archive</h2>
        </div>

        <div class="masthead-meta">
          <p class="section-meta">{{ postCountLabel }}</p>
          <p class="section-meta">{{ pageLabel }}</p>
          <a v-if="archivePosts.length" class="jump-link" href="#archive">
            Jump to archive
          </a>
        </div>
      </div>
    </section>

    <div v-if="featuredPost" class="home-flow">
      <RouterLink
        class="featured-post panel"
        :to="postRoute(featuredPost)"
      >
        <div class="featured-post__index">
          <span class="featured-post__number">{{ padIndex(1) }}</span>
          <div class="featured-post__meta">
            <span>{{ featuredPost.status || 'POST' }}</span>
            <span>{{ featuredPost.publishedLabel }}</span>
          </div>
        </div>

        <div class="featured-post__body">
          <p class="eyebrow">{{ featuredPost.category || 'General' }}</p>
          <h3 class="featured-post__title">{{ featuredPost.title }}</h3>
          <p class="featured-post__copy">{{ featuredPost.excerpt }}</p>

          <div class="featured-post__footer">
            <span class="featured-post__cta">Read article</span>
            <span class="read-time">{{ featuredPost.readTime }} min read</span>
          </div>
        </div>
      </RouterLink>

      <section v-if="archivePosts.length" id="archive" class="panel archive-panel">
        <div class="section-head">
          <div>
            <p class="eyebrow">Archive</p>
            <h2>More to read</h2>
          </div>
          <p class="section-meta">{{ archivePosts.length }} more entries</p>
        </div>

        <div class="archive-grid">
          <PostCard
            v-for="(post, index) in archivePosts"
            :key="post.id"
            :index="index + 2"
            :page-number="meta.page"
            :post="post"
          />
        </div>
      </section>

      <nav
        v-if="meta.totalPages > 1"
        class="panel panel--tight pagination"
        aria-label="Posts pagination"
      >
        <RouterLink
          class="ghost-link pagination__control"
          :class="{ 'is-disabled': !meta.hasPreviousPage }"
          :to="pageRoute(meta.page - 1)"
          :tabindex="meta.hasPreviousPage ? 0 : -1"
          :aria-disabled="!meta.hasPreviousPage"
        >
          Previous
        </RouterLink>

        <div class="pagination__pages">
          <template v-for="item in paginationItems" :key="item">
            <span v-if="typeof item !== 'number'" class="pagination__gap">…</span>
            <RouterLink
              v-else
              class="pagination__page"
              :class="{ 'is-current': item === meta.page }"
              :to="pageRoute(item)"
            >
              {{ item }}
            </RouterLink>
          </template>
        </div>

        <RouterLink
          class="ghost-link pagination__control"
          :class="{ 'is-disabled': !meta.hasNextPage }"
          :to="pageRoute(meta.page + 1)"
          :tabindex="meta.hasNextPage ? 0 : -1"
          :aria-disabled="!meta.hasNextPage"
        >
          Next
        </RouterLink>
      </nav>
    </div>

    <div v-else class="panel empty-panel">
      <p class="eyebrow">No content</p>
      <h2>No posts yet.</h2>
      <p class="empty-copy">Check back later for new entries.</p>
    </div>
  </section>
</template>
