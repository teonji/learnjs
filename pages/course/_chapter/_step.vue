<template>
  <div class="font-mono text-3xl w-full h-screen bg-green-500 p-[40px] pt-[80px] flex overflow-auto">
    <div class="absolute w-full top-0 right-0 left-0 bg-green-600">
      <div class="flex m-auto justify-center items-center h-[80px]">
        <div>
          <i v-if="isLearnt(step.path)" class="fas fa-star" />
          {{ step.title }}
        </div>
      </div>
    </div>
    <div class="absolute w-full top-0 right-0 left-0">
      <div class="flex justify-between items-center h-[80px]">
        <div class="pl-[40px]">
          <nuxt-link v-if="prevStep" :to="`/course${prevStep.path}`">
            <i class="fal fa-arrow-alt-left" />
            {{ prevStep.slug }}
          </nuxt-link>
          <nuxt-link v-else :to="`/course${current.path}`">
            <i class="fal fa-arrow-alt-left" />
            {{ current.title }}
          </nuxt-link>
        </div>
        <div class="pr-[40px]">
          <div
            v-if="nextStep"
            :class="isStepNextEnabled(nextStep) ? 'cursor-pointer' : 'cursor-not-allowed text-gray-300'"
            @click="goNextStep(step, nextStep)"
          >
            {{ nextStep.slug }}
            <i class="fal fa-arrow-alt-right" />
          </div>
        </div>
      </div>
    </div>
    <div class="m-[100px]" :class="[step.test ? 'w-2/3' : 'w-full', {'pr-[40px]': step.test}]">
      <nuxt-content :document="step" />
    </div>
    <div v-if="step.test" class="w-1/3 mt-[40px]">
      <code-editor
        :value="test"
        :verify="verify"
        :next="next"
        @learnt="setLearnt"
      />
    </div>
  </div>
</template>

<script>
import learntMixin from '../../../mixins/learnt'
import { checkChapters, functionStringify, getChapters, getSteps, getLearntCookie } from '../../../utils'
export default {
  name: 'CourseStepsPage',
  mixins: [learntMixin],
  async asyncData ({ $content, route, redirect, req }) {
    try{
      let test = null
      let verify = null
      const learnt = getLearntCookie(req)
      const chapters = await getChapters($content)
      const steps = await getSteps($content, route.params.chapter)
      const redirectChapters = checkChapters(learnt, route.params, chapters, steps)
      if (redirectChapters) {
        return redirect(redirectChapters)
      }
      const step = await $content(route.params.chapter, route.params.step).fetch()
      if (step.test) {
        const fileRest = require(`~/test/${route.params.chapter}-${route.params.step}.js`).default
        test = functionStringify(fileRest.step)
        verify = functionStringify(fileRest.verify)
      }
      const currentChapterIndex = chapters.findIndex(chapter => chapter.slug === route.params.chapter)
      const stepIndex = steps.findIndex(step => step.slug === route.params.step)
      const prevStep = stepIndex > 0 ? steps[stepIndex - 1] : null
      const nextStep = stepIndex === steps.length - 1 ? null : steps[stepIndex + 1]
      const next = nextStep || chapters[currentChapterIndex + 1]
      return {
        learnt,
        steps,
        chapter: route.params.chapter,
        chapters,
        step,
        test,
        verify,
        current: chapters[currentChapterIndex],
        next,
        prevStep,
        nextStep
      }
    } catch (e) {
      return redirect(`/course/${route.params.chapter}`)
    }
  }
}
</script>
