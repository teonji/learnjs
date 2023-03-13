<template>
  <div class="font-mono text-xl w-full h-screen text-white px-4 pb-24 pt-12 overflow-auto" :class="[step.test ? 'bg-[#2F3129]' : 'bg-indigo-600']">
    <div class="fixed bottom-0 left-0 z-50 grid w-full h-24 grid-cols-1 px-8 border-t border-gray-200 md:grid-cols-3 bg-gray-700 border-gray-600">
      <div class="items-center justify-center hidden mr-auto text-gray-500 text-gray-400 md:flex">
        <nuxt-link :to="current.slug" class="p-2.5 group rounded-full hover:bg-gray-100 mr-1 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-gray-600 hover:bg-gray-600">
          <svg class="w-5 h-5 text-gray-500 text-gray-300 group-hover:text-gray-900 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </nuxt-link>
        <span class="text-sm">{{ current.title }}</span>
      </div>
      <div class="flex items-center w-full">
        <div class="w-full">
          <div class="flex items-center justify-center mx-auto mb-4">
            <nuxt-link :to="current.slug" class="md:hidden rounded-full hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-gray-600 hover:bg-gray-600">
              <svg class="w-5 h-5 text-gray-500 text-gray-300 group-hover:text-gray-900 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </nuxt-link>
            <div class="flex items-center justify-center mx-auto">
              <nuxt-link :to="prevStep ? `/corso${prevStep.path}` : `/corso${current.path}`" class="p-2.5 group rounded-full hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-gray-600 hover:bg-gray-600">
                <svg class="w-5 h-5 text-gray-500 text-gray-300 group-hover:text-gray-900 group-hover:text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" aria-hidden="true">
                  <path d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z" fill="currentColor" />
                </svg>
              </nuxt-link>
              <button
                :disabled="step.test && !unlock"
                :class="[!step.test ? 'cursor-pointer bg-blue-600 hover:bg-blue-700' : `text-gray-300 ${unlock ? 'bg-green-600 hover:bg-green-700 cursor-pointer' : 'cursor-not-allowed bg-red-600 hover:bg-red-700'}`]"
                class="inline-flex items-center justify-center p-2.5 mx-2 font-medium rounded-full group focus:ring-4 focus:ring-blue-300 focus:outline-none focus:ring-blue-800"
                @click="goNextStep(step, nextStep, unlock, content)"
              >
                <svg v-if="!step.test" class="w-5 h-5 text-white text-gray-300 group-hover:text-gray-900 group-hover:text-white" fill="currentColor" viewBox="0 0 320 512" aria-hidden="true">
                  <path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z" fill="currentColor" />
                </svg>
                <svg
                  v-else
                  fill="none"
                  class="w-5 h-5 text-white text-gray-300 group-hover:text-gray-900 group-hover:text-white"
                  stroke="currentColor"
                  stroke-width="3.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path v-if="!unlock" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  <path v-else d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </button>
            </div>
            <button class="md:hidden rounded-full hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-gray-600 hover:bg-gray-600" @click="toggleMenu">
              <svg class="w-5 h-5 text-gray-500 text-gray-300 group-hover:text-gray-900 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            </button>
          </div>
          <div class="flex items-center justify-between space-x-2">
            <div class="w-full bg-gray-200 rounded-full h-1.5 bg-gray-800">
              <div class="h-1.5 rounded-full" :class="stepPercentage === 100 ? 'bg-green-600' : 'bg-blue-600'" :style="`width: ${stepPercentage}%`" />
            </div>
          </div>
        </div>
      </div>
      <div class="items-center justify-center hidden ml-auto text-gray-500 text-gray-400 md:flex">
        <span class="text-sm">{{ step.title }}</span>
        <button class="p-2.5 group rounded-full hover:bg-gray-100 mr-1 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-gray-600 hover:bg-gray-600" @click="toggleMenu">
          <svg class="w-5 h-5 text-gray-500 text-gray-300 group-hover:text-gray-900 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path clip-rule="evenodd" fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="menu" class="absolute right-0 bottom-28 md:right-8 z-10 bg-white divide-y divide-gray-100 w-full md:w-96 rounded-lg shadow bg-gray-600">
      <ul class="py-2 text-sm text-gray-700 text-gray-200">
        <li v-for="(s, i) in steps" :key="`menu-${i}`" class="flex items-center" :class="steps[i === 0 ? 0 : i - 1].learnt ? 'hover:bg-gray-100 hover:bg-gray-500 hover:text-white' : 'text-gray-500 cursor-not-allowed'">
          <svg
            v-if="s.test"
            class="w-4 h-4 ml-3"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
          </svg>
          <nuxt-link v-if="steps[i === 0 ? 0 : i - 1].learnt" :to="`/corso${s.path}`" class="block px-4 py-2">
            {{ s.title }}
          </nuxt-link>
          <span v-else class="block px-4 py-2">
            {{ s.title }}
          </span>
        </li>
      </ul>
    </div>

    <div class="md:flex">
      <div :class="[step.test ? 'md:w-1/2 md:pr-8 md:pl-4' : 'w-full md:mx-[100px] md:pr-[40px]']">
        <div class="nuxt-content">
          <h1>{{ step.title }}</h1>
        </div>
        <nuxt-content :document="step" :class="{'pb-4': !step.test}" />
        <div
          v-if="step.test"
          class="p-4 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased rounded-lg leading-normal overflow-hidden"
          :class="{
            'bg-red-500': hasErrorCode,
            'bg-red-500': !hasErrorCode && (edited && verifyTest),
            'bg-[#272822]': !hasErrorCode && !edited,
            'bg-green-700': edited && !verifyTest
          }"
        >
          <div class="flex">
            <div v-if="hasErrorCode">
              <div v-for="(e, i) in errors" :key="i">
                <span class="text-green-400">computer:~$</span>
                <span class="flex-1 typing items-center pl-2">
                  {{ e.text }} (row: {{ e.row + 1 }}, col: {{ e.column + 1 }})
                </span>
              </div>
            </div>
            <template v-else-if="edited">
              <span v-if="verifyTest" class="flex items-center h-full w-full">
                <span class="text-green-400 pr-2">computer:~$</span>
                <span>{{ verifyTest }}</span>
              </span>
              <div v-else class="flex items-center justify-center h-full w-full text-center">
                <p class="text-white">
                  Esercizio passato!
                </p>
              </div>
            </template>
            <div v-else class="flex items-center justify-center h-full w-full">
              <span class="text-green-400">computer:~$</span>
              <span class="flex-1 typing items-center pl-2">
                Inizia a scrivere
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="step.test" class="md:w-1/2 md:absolute right-0 top-0">
        <code-editor
          :value="savedTest || test"
          :verify="verify"
          :help="help"
          :next="next"
          @verify="verifyCode"
        />
      </div>
    </div>
  </div>
</template>

<script>
import learntMixin from '../../../mixins/learnt'
import { checkChapters, functionStringify, getChapters, getSteps, getLearnt, getTest } from '../../../utils'
export default {
  name: 'CorsoStepsPage',
  mixins: [learntMixin],
  async asyncData ({ $content, route, redirect }) {
    try {
      let test = null
      let verify = null
      let help = null
      const learnt = getLearnt()
      const chapters = await getChapters($content)
      const steps = await getSteps($content, route.params.chapter)
      const redirectChapters = checkChapters(learnt, route.params, chapters, steps)
      if (redirectChapters) {
        return redirect(redirectChapters)
      }
      const step = await $content(route.params.chapter, route.params.step).fetch()
      if (step.test) {
        const fileRest = require(`~/test/${route.params.chapter}/${route.params.step}.js`).default
        test = functionStringify(fileRest.step)
        verify = functionStringify(fileRest.verify)
        help = functionStringify(fileRest.help)
      }
      const currentChapterIndex = chapters.findIndex(chapter => chapter.slug === route.params.chapter)
      const stepIndex = steps.findIndex(step => step.slug === route.params.step)
      const prevStep = stepIndex > 0 ? steps[stepIndex - 1] : null
      const nextStep = stepIndex === steps.length - 1 ? null : steps[stepIndex + 1]
      const next = nextStep || chapters[currentChapterIndex + 1]

      let savedTest = null
      if (step.test) {
        savedTest = await getTest(step.path.substr(1))
      }

      return {
        learnt,
        steps,
        chapter: route.params.chapter,
        stepIndex,
        chapters,
        step,
        test,
        savedTest,
        edited: !!savedTest,
        content: savedTest || '', // TODO: unificare con variabile savedTest?
        help,
        verify,
        current: chapters[currentChapterIndex],
        next,
        prevStep,
        nextStep
      }
    } catch (e) {
      return redirect(`/corso/${route.params.chapter}`)
    }
  },
  data () {
    return {
      errors: [],
      verifyTest: null,
      menu: false
    }
  },
  computed: {
    stepPercentage () {
      return ((this.stepIndex + 1) / this.steps.length) * 100
    },
    hasErrorCode () {
      return this.errors.length > 0
    },
    unlock () {
      if (this.step.test) {
        return !this.hasErrorCode && this.edited && !this.verifyTest
      } else {
        return false
      }
    }
  },
  methods: {
    toggleMenu () {
      this.menu = !this.menu
    },
    verifyCode ({ errors, verify, edited, content }) {
      this.errors = errors
      this.verifyTest = verify
      this.edited = edited
      this.content = content
    }
  }
}
</script>
