<template>
  <div class="font-mono h-screen bg-orange-500 text-white overflow-auto">
    <div class="container p-4 md:p-32 m-auto text-right">
      <h1 class="text-6xl pb-16">
        FINE
      </h1>
    </div>
  </div>
</template>

<script>
import learntMixin from '../../mixins/learnt'
import { getChapters, getLearntCode, getLearnt } from '../../utils'
export default {
  name: 'CorsoEndPage',
  mixins: [learntMixin],
  async asyncData ({ $content, redirect }) {
    try {
      const learnt = await getLearnt()
      const chapters = await getChapters($content)
      if (!chapters.every(c => learnt.includes(getLearntCode(c.path)))) {
        return redirect('/corso')
      }
    } catch (e) {
      return redirect('/corso')
    }
  }
}
</script>
