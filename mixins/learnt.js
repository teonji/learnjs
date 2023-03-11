import { getLearntCode, pushLearntCookie } from '../utils'

export default {
  methods: {
    async pushLearnt (data) {
      this.learnt = await pushLearntCookie(data)
    },
    getLearntCode (path) {
      return getLearntCode(path)
    },
    async setLearntCode (path) {
      await this.pushLearnt(getLearntCode(path))
    },
    isLearnt (path) {
      return this.learnt.includes(getLearntCode(path))
    },
    isChapterEnabled (step) {
      const _self = this
      const index = _self.chapters.findIndex(s => s.path === step.path)
      return index === 0 || _self.isLearnt(_self.chapters[index - 1].path)
    },
    findStepIndex (step) {
      return this.steps.findIndex(s => s.path === step.path)
    },
    isStepEnabled (step) {
      const _self = this
      const index = _self.findStepIndex(step)
      return index === 0 || _self.isLearnt(_self.steps[index - 1].path)
    },
    isStepNextEnabled (step) {
      const _self = this
      const index = _self.findStepIndex(step)
      return !_self.steps[index - 1].test || _self.isLearnt(_self.steps[index].path)
    },
    async goNextChapter (step) {
      if (this.isChapterEnabled(step)) {
        await this.$router.push(`/course${step.path}`)
      }
    },
    async goNextStep (step, nextStep, unlock) {
      if (unlock) {
        if (this.next) {
          await this.$router.push(`/course${this.next.path}`)
        } else {
          await this.$router.push('/course/fine')
        }
        await this.setLearnt()
      } else if (this.isStepNextEnabled(nextStep)) {
        await this.setLearntCode(step.path)
        await this.$router.push(`/course${nextStep.path}`)
      }
    },
    async goStep (step) {
      if (this.isStepEnabled(step)) {
        await this.$router.push(`/course${step.path}`)
      }
    },
    async setLearnt () {
      await this.setLearntCode(this.step.path)
      if (!this.nextStep) {
        await this.setLearntCode(this.current.path)
      }
    }
  }
}
