<template>
  <div v-if="loaded" class="h-screen flex flex-col mt-8 md:mt-0">
    <button v-if="showRun" class="absolute right-4 bottom-28 z-20 text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" @click="run">
      Run
      <svg aria-hidden="true" class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
      </svg>
    </button>
    <button type="button" class="absolute md:right-2 md:top-4 bottom-28 md:bottom-auto z-20 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="toggleHelp">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    </button>
    <ace-editor
      ref="code"
      :value="innerValue"
      theme="monokai"
      lang="javascript"
      @init="editorInit"
      @input="input"
    />
  </div>
</template>

<script>
export default {
  name: 'CodeEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    verify: {
      type: String,
      default: ''
    },
    help: {
      type: String,
      default: ''
    },
    next: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      annotations: [],
      innerValue: this.value.replace(/;/g, ''),
      loaded: false,
      edited: false,
      showRun: false
    }
  },
  computed: {
    errors () {
      return this.annotations.filter(item => item.type === 'error')
    },
    verifyFn () {
      return '() => {' + this.innerValue + ';\n\n ' + this.verify + '}'
    },
    verifyTest () {
      try {
        // eslint-disable-next-line no-eval
        return eval(this.verifyFn)()
      } catch (e) {
        return e.message
      }
    }
  },
  mounted () {
    const _self = this
    _self.height = window.innerHeight - 400
    _self.loaded = true

    _self.$nextTick(() => {
      _self.$refs.code.editor.getSession().on('changeAnnotation', () => {
        const annotations = _self.$refs.code.editor.getSession().getAnnotations()
        _self.annotations = annotations
        _self.$emit('annotations', annotations)
      })
      _self.$refs.code.editor.addEventListener('blur', () => {
        return this.$emit('input', _self.innerValue)
      }, true)
    })
  },
  methods: {
    editorInit () {
      require('brace/ext/searchbox')
      require('brace/ext/language_tools')
      require('brace/mode/javascript')
      require('brace/theme/monokai')
    },
    input (event) {
      this.innerValue = event
      this.edited = true
      if (event === '') {
        this.annotations = []
      }
      this.showRun = true
    },
    run () {
      this.showRun = false
      this.$emit('verify', {
        errors: this.errors,
        verify: this.verifyTest,
        edited: this.edited,
        content: this.innerValue
      })
    },
    async toggleHelp () {
      this.innerValue = this.help.replace(/;/g, '')
      await this.run()
    }
  }
}
</script>
