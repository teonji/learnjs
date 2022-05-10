<template>
  <div class="font-mono h-screen bg-purple-600 text-white overflow-auto">
    <div class="container p-32 m-auto text-right">
      <h1 class="text-6xl pb-16">
        // Corso Javascript
      </h1>
      <div v-for="(c, i) in chapters" :key="i" class="pb-8">
        <div
          :class="isChapterEnabled(c) ? 'cursor-pointer' : 'cursor-not-allowed text-gray-300'"
          @click="goNextChapter(c)"
        >
          <h2 class="text-xl font-bold">
            {{ c.title }}
            <i v-if="isLearnt(c.path)" class="fas fa-star" />
          </h2>
          <p>{{ c.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import learntMixin from '../../mixins/learnt'
import { getChapters, getLearntCookie } from '../../utils'
export default {
  name: 'CoursePage',
  mixins: [learntMixin],
  async asyncData ({ $content, redirect, req }) {
    try {
      const learnt = getLearntCookie(req)
      const chapters = await getChapters($content)
      return {
        learnt,
        chapters
      }
    } catch (e) {
      return redirect('/')
    }
  }
}
</script>
