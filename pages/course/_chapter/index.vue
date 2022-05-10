<template>
  <div class="font-mono h-screen bg-pink-500 text-white overflow-auto">
    <div class="absolute w-full top-0 right-0 left-0">
      <div class="flex pl-[40px] items-center h-[80px]">
        <nuxt-link to="/course">
          <i class="fal fa-arrow-alt-left" />
          Corso
        </nuxt-link>
      </div>
    </div>
    <div class="container p-32 m-auto text-right">
      <div class="pb-16">
        <h1 class="text-4xl font-bold">
          {{ chapter.title }}
          <i v-if="isLearnt(chapter.path)" class="fas fa-star" />
        </h1>
        <h2>
          {{ chapter.description }}
        </h2>
      </div>
      <div v-for="(s, i) in steps" :key="i" class="pb-8">
        <div
          class="pb-8"
          :class="isStepEnabled(s) ? 'cursor-pointer' : 'cursor-not-allowed text-gray-300'"
          @click="goStep(s)"
        >
          <div class="text-xl font-bold">
            <i v-if="s.test" class="fas fa-vial" />
            <i v-if="isLearnt(s.path)" class="fas fa-star" />
            {{ s.title }}
          </div>
          <p>{{ s.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkChapters, getChapters, getSteps, getChapter, getLearntCookie } from '../../../utils'
import learntMixin from '../../../mixins/learnt'
export default {
  name: 'CourseChapterPage',
  mixins: [learntMixin],
  async asyncData ({ $content, req, route, redirect }) {
    try {
      const learnt = getLearntCookie(req)
      const chapters = await getChapters($content)
      const redirectChapters = checkChapters(learnt, route.params, chapters)
      if (redirectChapters) {
        return redirect(redirectChapters)
      }
      const chapter = await getChapter($content, route.params.chapter)
      const steps = await getSteps($content, route.params.chapter)
      return {
        learnt,
        chapter: chapter.length ? chapter[0] : null,
        steps
      }
    } catch (e) {
      return redirect('/course')
    }
  }
}
</script>
