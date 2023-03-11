<template>
  <div class="font-mono h-screen bg-pink-600 text-white overflow-auto">
    <div class="container p-4 md:p-32 m-auto">
      <h1 class="text-6xl pb-8">
        // Corso Javascript
      </h1>
      <div class="w-full rounded-full h-2.5 bg-gray-700 mb-8">
        <div class="h-2.5 rounded-full" :class="completed === 100 ? 'bg-green-500' : 'bg-white'" :style="`width: ${completed}%`" />
      </div>
      <div v-for="(c, i) in chapters" :key="i" class="pb-8">
        <div
          :class="[isChapterEnabled(c) ? 'cursor-pointer' : 'cursor-not-allowed opacity-30']"
          @click="goNextChapter(c)"
        >
          <h2 class="text-xl font-bold">
            // {{ i + 1 }} - {{ c.title }}
          </h2>
          <p>{{ c.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import learntMixin from '../../mixins/learnt'
import { getChapters, getLearnt } from '../../utils'
export default {
  name: 'CoursePage',
  mixins: [learntMixin],
  async asyncData ({ $content, redirect }) {
    try {
      const learnt = await getLearnt()
      const chapters = await getChapters($content)
      return {
        learnt,
        chapters
      }
    } catch (e) {
      return redirect('/')
    }
  },
  computed: {
    completed () {
      const enabled = this.chapters.filter(c => this.isChapterEnabled(c))
      return (enabled.length / this.chapters.length) * 100
    }
  }
}
</script>
