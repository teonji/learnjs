<template>
  <div v-if="loaded" class="h-full">
    <ace-editor
      ref="code"
      :height="height"
      :value="innerValue"
      theme="monokai"
      lang="javascript"
      @init="editorInit"
      @input="input"
    />
    <div
      class="h-[200px] mt-[40px] p-3 overflow-auto"
      :class="{
        'bg-red-500': hasErrorCode,
        'bg-red-300': !hasErrorCode && (edited && verifyTest),
        'bg-blue-300': !hasErrorCode && !edited,
        'bg-green-700': edited && !verifyTest
      }"
    >
      <ul v-if="hasErrorCode">
        <li v-for="(e, i) in errors" :key="i">
          {{ e.text }} (row: {{ e.row + 1 }}, col: {{ e.column + 1 }})
        </li>
      </ul>
      <template v-else-if="edited">
        <span v-if="verifyTest" class="flex items-center justify-center h-full w-full text-center">
          <span>{{ verifyTest }}</span>
        </span>
        <div v-else class="flex items-center justify-center h-full w-full text-center">
          <div>
            <p class="mb-2">
              Grande!
            </p>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="learnt">
              <span v-if="next">
                Vai a {{ next.title }}
              </span>
              <span v-else>
                Vai alla fine
              </span>
            </button>
          </div>
        </div>
      </template>
      <div v-else class="flex items-center justify-center h-full w-full">
        <span>Inizia a scrivere il codice</span>
      </div>
    </div>
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
    next: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      annotations: [],
      innerValue: this.value,
      height: '300',
      loaded: false,
      edited: false
    }
  },
  computed: {
    errors () {
      return this.annotations.filter(item => item.type === 'error')
    },
    hasErrorCode () {
      return this.errors.length > 0
    },
    verifyFn () {
      return '() => {' + this.innerValue + ';\n\n ' + this.verify + '}'
    },
    verifyTest () {
      try {
        // eslint-disable-next-line no-eval
        const val = eval(this.verifyFn)()
        if (val === null) {
          this.$emit('verified', true)
        }
        return val
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
        this.$emit('annotations', [])
      }
    },
    async learnt () {
      await this.$emit('learnt')
      if (this.next) {
        await this.$router.push(`/course${this.next.path}`)
      } else {
        await this.$router.push('/course/fine')
      }
    }
  }
}
</script>
