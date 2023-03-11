<template>
  <div class="font-mono h-screen bg-purple-600 text-white overflow-auto">
    <div class="absolute w-full top-0 right-0 left-0">
      <div class="flex pl-4 md:pl-[40px] items-center h-[80px]">
        <nuxt-link to="/course" class="flex items-center">
          <svg
            class="w-8 h-8 mr-2"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Corso
        </nuxt-link>
      </div>
    </div>
    <div class="container p-4 md:p-32 mt-24 md:mt-0 m-auto">
      <div class="pb-16">
        <h1 class="text-4xl font-bold">
          // {{ chapter.title }}
          <!--          <i v-if="isLearnt(chapter.path)" class="fas fa-star" />-->
        </h1>
      </div>
      <div v-for="(s, i) in steps" :key="i" class="pb-8">
        <div
          class="pb-8"
          :class="isStepEnabled(s) ? 'cursor-pointer' : 'cursor-not-allowed opacity-30'"
          @click="goStep(s)"
        >
          <div class="text-xl font-bold flex">
            <!--            <i v-if="isLearnt(s.path)" class="fas fa-star" />-->
            // {{ s.title }}
            <svg
              v-if="s.test"
              class="w-8 h-8 ml-4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
            </svg>
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
