const API_BASE_URL = 'https://api.oluwasetemi.dev'
export const POSTS_PER_PAGE = 10
export const MAX_VISIBLE_POSTS = 30

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'The requested post could not be found.') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const PLACEHOLDER_WORDS = new Set([
  'aenean',
  'aliquam',
  'bibendum',
  'blandit',
  'condimentum',
  'convallis',
  'curabitur',
  'dapibus',
  'efficitur',
  'eleifend',
  'euismod',
  'fermentum',
  'finibus',
  'fringilla',
  'gravida',
  'hendrerit',
  'iaculis',
  'lacinia',
  'maecenas',
  'mauris',
  'molestie',
  'nullam',
  'ornare',
  'pellentesque',
  'phasellus',
  'porttitor',
  'praesent',
  'pulvinar',
  'quisque',
  'rhoncus',
  'sagittis',
  'scelerisque',
  'sollicitudin',
  'sodales',
  'ullamcorper',
  'ultricies',
  'vehicula',
  'vestibulum',
  'vivamus',
])

const TITLE_PROFILES = [
  {
    pattern: /microservices/i,
    excerpt:
      'A grounded look at service boundaries, ownership, and the tradeoffs that show up when a system starts to split apart.',
    summary:
      'Microservices are useful when they reduce coordination between teams, not when they simply introduce more infrastructure to manage.',
    details:
      'The real work is deciding where a service begins and ends, protecting data ownership, and resisting chatty dependencies that make the whole system fragile.',
    tradeoffs:
      'Once the architecture spreads out, observability, deployment safety, and failure handling matter as much as the code inside any single service.',
    takeaway:
      'Teams usually get the best results by carving out one clear responsibility at a time and keeping their contracts deliberately boring.',
  },
  {
    pattern: /typescript/i,
    excerpt:
      'A practical note on where TypeScript helps most: clearer models, safer refactors, and better boundaries between moving parts.',
    summary:
      'TypeScript pays for itself when it makes intent obvious and catches mistakes before they leak into production.',
    details:
      'The biggest wins usually come from modelling domain shapes well, tightening unsafe edges at the boundaries, and letting the compiler shoulder routine checks.',
    tradeoffs:
      'That benefit fades quickly when types become so clever that they are harder to read than the code they are trying to describe.',
    takeaway:
      'A steady, gradual approach with readable types and sensible defaults usually beats an all-at-once push for maximum strictness.',
  },
  {
    pattern: /caching/i,
    excerpt:
      'A concise read on cache keys, freshness, and the practical tradeoffs behind making data faster to read than to recompute.',
    summary:
      'Caching is less about speed alone and more about deciding what can safely be reused, for how long, and under which key.',
    details:
      'A clean strategy starts with predictable cache boundaries, stable invalidation rules, and a clear understanding of what happens when stale data slips through.',
    tradeoffs:
      'Every cache adds another layer of state, so gains in latency have to be balanced against debugging complexity and the cost of bad invalidation.',
    takeaway:
      'The strongest implementations stay simple: cache only what hurts, measure the result, and keep expiry rules easy to explain.',
  },
  {
    pattern: /error handling/i,
    excerpt:
      'A short, practical take on making failures visible, understandable, and easier to recover from in production systems.',
    summary:
      'Good error handling turns failure from a surprise into a routine part of running software.',
    details:
      'That means raising errors with enough context to act on them, separating user-facing messages from internal detail, and making recovery paths explicit.',
    tradeoffs:
      'Teams often over-focus on catching everything while under-investing in the logs, tracing, and alerting needed to explain what actually happened.',
    takeaway:
      'The goal is not to eliminate failure entirely but to make the system easier to diagnose, safer to retry, and less painful to support.',
  },
  {
    pattern: /graphql/i,
    excerpt:
      'A sensible overview of GraphQL as a schema and resolver problem, not just a query language with nicer ergonomics.',
    summary:
      'GraphQL shines when clients need flexibility, but it only stays pleasant when the schema remains deliberate and the resolver layer stays disciplined.',
    details:
      'The strongest APIs keep field naming consistent, make relationships explicit, and watch closely for accidental N+1 patterns as the graph grows.',
    tradeoffs:
      'Flexibility for the client often shifts complexity onto the server, especially around authorization, caching, and query cost control.',
    takeaway:
      'A well-shaped schema, predictable pagination, and careful resolver boundaries usually matter more than cleverness at the query layer.',
  },
  {
    pattern: /auth|authentication/i,
    excerpt:
      'A practical read on balancing identity, security, and usability without making routine access painful for legitimate users.',
    summary:
      'Authentication work is mostly about reducing risk while keeping the sign-in experience understandable and dependable.',
    details:
      'Strong implementations treat sessions, token expiry, and credential storage as first-class concerns instead of details to patch in later.',
    tradeoffs:
      'The tighter the controls become, the more important it is to smooth out renewal, device trust, and failure recovery for real users.',
    takeaway:
      'Clear flows, boring defaults, and careful handling of secrets usually do more good than stacking on features without a threat model.',
  },
  {
    pattern: /api|rest/i,
    excerpt:
      'A focused piece on API design that values clarity, consistency, and predictable behavior over clever endpoint design.',
    summary:
      'APIs age well when they are easy to read, hard to misuse, and consistent about how they handle success, errors, and change.',
    details:
      'That usually comes down to stable resource naming, explicit validation, and response shapes that clients can depend on without defensive guesswork.',
    tradeoffs:
      'A tidy surface area can take more effort upfront, but it saves far more time once multiple clients and multiple teams start depending on it.',
    takeaway:
      'Good API design is rarely flashy; it is the quiet discipline of making common cases obvious and edge cases manageable.',
  },
  {
    pattern: /testing|test/i,
    excerpt:
      'A grounded note on writing tests that protect the behavior that is expensive to debug after release.',
    summary:
      'Testing matters most when it protects the paths that would be costly, noisy, or risky to validate by hand in production.',
    details:
      'The strongest test suites spend less time asserting framework trivia and more time covering business rules, integration boundaries, and failure paths.',
    tradeoffs:
      'Too many brittle tests can slow a team down, but too little coverage leaves refactors expensive and confidence fragile.',
    takeaway:
      'A compact, trustworthy suite is usually more valuable than a large one that everyone learns to ignore.',
  },
]

const CATEGORY_PROFILES = {
  Tutorial: {
    excerpt:
      'A straightforward walkthrough built around practical steps, sensible defaults, and a clear path from concept to implementation.',
    summary:
      'The best tutorials lower the entry barrier without pretending the hard edges of the topic do not exist.',
    details:
      'They usually work by introducing one idea at a time, showing the shape of the solution early, and avoiding unnecessary detours.',
    tradeoffs:
      'A tutorial becomes more useful when it explains not just what to type, but why one option was chosen over the others.',
    takeaway:
      'Good instructional writing leaves the reader able to keep going alone after the guide ends.',
  },
  Technology: {
    excerpt:
      'A short engineering read with a clear point of view on tradeoffs, design choices, and the practical shape of modern systems.',
    summary:
      'The most useful technology writing gives readers a sharper way to think about a decision, not just a new term to repeat.',
    details:
      'That usually means staying concrete, naming the tradeoffs plainly, and showing how the idea changes real implementation choices.',
    tradeoffs:
      'Readers gain the most when broad concepts are tied back to operating cost, team workflow, and the shape of the code they have to maintain.',
    takeaway:
      'A good piece in this category leaves someone with a clearer mental model and a more careful default stance.',
  },
  Development: {
    excerpt:
      'A practical development note centered on maintainability, implementation details, and the tradeoffs behind everyday engineering work.',
    summary:
      'Development posts are strongest when they stay close to the code and the decisions that make a project easier to change over time.',
    details:
      'Useful writing here tends to focus on boundaries, naming, structure, and the habits that keep complexity from creeping in unnoticed.',
    tradeoffs:
      'The interesting part is rarely the first draft of a solution; it is the discipline needed to keep that solution understandable months later.',
    takeaway:
      'The best advice in this space is usually simple, concrete, and reinforced by the way real teams actually build software.',
  },
}

const DEFAULT_PROFILE = {
  excerpt:
    'A compact technical read focused on clear ideas, practical tradeoffs, and the choices that shape solid software.',
  summary:
    'The best engineering posts make a concrete point early and then spend the rest of the piece earning it.',
  details:
    'They help readers by clarifying the problem, explaining the tradeoffs, and showing which choices matter most in day-to-day work.',
  tradeoffs:
    'Even a short article can be useful when it avoids vague advice and stays anchored to decisions a team can actually make.',
  takeaway:
    'What lasts is not the phrasing but the sharper judgment a reader takes back into the next implementation.',
}

function cleanText(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function slugify(value = '') {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled'
}

function tokenize(text) {
  return cleanText(text).toLowerCase().match(/[a-z]+/g) ?? []
}

function truncateText(value, length = 160) {
  if (value.length <= length) {
    return value
  }

  return `${value.slice(0, length).trimEnd()}...`
}

function estimateReadTime(content) {
  const wordCount = cleanText(content).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(wordCount / 180))
}

function formatCategory(post) {
  return cleanText(post.category || '') || 'General'
}

function formatTags(post) {
  return cleanText(post.tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function joinList(values) {
  if (!values.length) {
    return ''
  }

  if (values.length === 1) {
    return values[0]
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`
  }

  return `${values.slice(0, -1).join(', ')}, and ${values.at(-1)}`
}

function looksLikePlaceholder(text) {
  const words = tokenize(text)

  if (!words.length) {
    return true
  }

  const placeholderHits = words.reduce((count, word) => {
    return count + Number(PLACEHOLDER_WORDS.has(word))
  }, 0)

  return placeholderHits >= 4 && placeholderHits / words.length >= 0.08
}

function sentenceGroups(content) {
  const normalized = cleanText(content)
  const sentences =
    normalized.match(/[^.!?]+[.!?]+/g)?.map((sentence) => sentence.trim()) ??
    []

  if (!sentences.length) {
    return normalized ? [normalized] : []
  }

  const groups = []

  for (let index = 0; index < sentences.length; index += 3) {
    groups.push(sentences.slice(index, index + 3).join(' '))
  }

  return groups
}

function postsFromPayload(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.posts)) {
    return payload.posts
  }

  return []
}

function metaFromPayload(payload, count, page, limit, totalCap = Infinity) {
  const rawTotal = Number(payload?.meta?.total ?? count)
  const total = Math.min(rawTotal, totalCap)
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const currentPage = Number(payload?.meta?.page ?? page)
  const currentLimit = Number(payload?.meta?.limit ?? limit)

  return {
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
    hasNextPage:
      payload?.meta?.hasNextPage ?? currentPage < totalPages,
    hasPreviousPage:
      payload?.meta?.hasPreviousPage ?? currentPage > 1,
  }
}

function parseJson(rawPayload) {
  if (!rawPayload) {
    return null
  }

  try {
    return JSON.parse(rawPayload)
  } catch {
    return null
  }
}

function formatPublishedLabel(post) {
  const candidate = post.publishedAt || post.updatedAt || post.createdAt

  if (!candidate) {
    return 'Recently updated'
  }

  return dateFormatter.format(new Date(candidate))
}

function pickProfile(post) {
  const title = cleanText(post.title || '')

  for (const profile of TITLE_PROFILES) {
    if (profile.pattern.test(title)) {
      return profile
    }
  }

  return CATEGORY_PROFILES[formatCategory(post)] || DEFAULT_PROFILE
}

function buildTagSentence(tags) {
  if (!tags.length) {
    return ''
  }

  return ` It touches on ${joinList(tags.slice(0, 3))}.`
}

function buildGeneratedCopy(post, category, publishedLabel, tags) {
  const profile = pickProfile(post)

  return {
    excerpt: profile.excerpt,
    paragraphs: [
      `${post.title} works best as a piece about judgment rather than novelty. ${profile.summary}`,
      `${profile.details}${buildTagSentence(tags)}`,
      profile.tradeoffs,
      `${profile.takeaway} Filed under ${category.toLowerCase()}, this entry reads like a concise note from ${publishedLabel}.`,
    ],
  }
}

function normalizePost(post) {
  const title = cleanText(post.title || 'Untitled post')
  const category = formatCategory(post)
  const tags = formatTags(post)
  const publishedLabel = formatPublishedLabel(post)
  const body = cleanText(post.content || '')
  const rawExcerpt = cleanText(post.excerpt || '')
  const shouldGenerateBody = looksLikePlaceholder(body)
  const shouldGenerateExcerpt =
    shouldGenerateBody || looksLikePlaceholder(rawExcerpt)

  const generated = shouldGenerateBody
    ? buildGeneratedCopy({ ...post, title }, category, publishedLabel, tags)
    : null
  const paragraphs = generated ? generated.paragraphs : sentenceGroups(body)
  const content = paragraphs.join(' ')
  const excerpt =
    shouldGenerateExcerpt
      ? generated?.excerpt || truncateText(content, 165)
      : rawExcerpt || truncateText(content, 165)

  return {
    ...post,
    title,
    category,
    slug: slugify(post.slug || title),
    excerpt,
    content,
    tagList: tags,
    publishedLabel,
    readTime: estimateReadTime(content),
    paragraphs,
  }
}

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  const rawPayload = await response.text()
  const payload = parseJson(rawPayload)

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error?.message ||
      'The API request could not be completed.'

    if (response.status === 404) {
      throw new NotFoundError(message)
    }

    throw new ApiError(message, response.status)
  }

  return payload
}

export async function fetchPosts() {
  const payload = await request(`/posts?limit=${MAX_VISIBLE_POSTS}`)

  return postsFromPayload(payload)
    .slice(0, MAX_VISIBLE_POSTS)
    .sort((left, right) => {
      const leftDate = new Date(left.publishedAt || left.updatedAt || 0)
      const rightDate = new Date(right.publishedAt || right.updatedAt || 0)
      return rightDate - leftDate
    })
    .map(normalizePost)
}

export async function fetchPostsPage(page = 1, limit = POSTS_PER_PAGE) {
  const maxPage = Math.max(1, Math.ceil(MAX_VISIBLE_POSTS / limit))

  if (page > maxPage) {
    return {
      posts: [],
      meta: {
        total: MAX_VISIBLE_POSTS,
        page,
        limit,
        totalPages: maxPage,
        hasNextPage: false,
        hasPreviousPage: page > 1,
      },
    }
  }

  const payload = await request(`/posts?limit=${limit}&page=${page}`)
  const startIndex = (page - 1) * limit
  const remainingPosts = Math.max(0, MAX_VISIBLE_POSTS - startIndex)
  const posts = postsFromPayload(payload)
    .slice(0, remainingPosts)
    .map(normalizePost)
  const meta = metaFromPayload(
    payload,
    posts.length,
    page,
    limit,
    MAX_VISIBLE_POSTS,
  )

  return { posts, meta }
}

export async function fetchPostById(postId) {
  const payload = await request(`/posts/${encodeURIComponent(postId)}`)
  return normalizePost(payload)
}
