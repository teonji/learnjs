<template>
  <div class="font-mono h-screen bg-purple-600 text-white overflow-auto">
    <div class="container p-32 m-auto text-right">
      <h1 class="text-6xl pb-16">
        FINE
      </h1>
    </div>
  </div>
</template>

<script>
import learntMixin from '../../mixins/learnt'
import { getChapters, getLearntCode, getLearntCookie } from '../../utils'
export default {
  name: 'CourseEndPage',
  mixins: [learntMixin],
  async asyncData ({ $content, redirect, req }) {
    try {
      const learnt = getLearntCookie(req)
      const chapters = await getChapters($content)
      if (!chapters.every(c => learnt.includes(getLearntCode(c.path)))) {
        return redirect('/course')
      }
    } catch (e) {
      return redirect('/course')
    }
  }
}
</script>
