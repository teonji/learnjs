<template>
  <div class="bg-purple-300 font-mono">
    <div class="w-9/12 m-auto py-16 min-h-screen flex items-center justify-center">
      <div class="text-center pt-8 text-purple-900">
        <h1 class="text-9xl font-bold text-purple-400">
          {{ statusCode }}
        </h1>
        <h1 class="text-6xl font-medium py-8">
          oops! {{ statusCode === 404 ? 'Pagina non trovata' : 'Errore inaspettato' }}
        </h1>
        <p v-if="statusCode === 404" class="text-2xl pb-8 px-12 font-medium">
          La pagina che stai cercando non esiste.
        </p>
        <nuxt-link to="/" class="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-900">
          Home
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorLayout',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  computed: {
    statusCode () {
      return (this.error && this.error.statusCode) || 500
    },
    message () {
      return this.error.message
    }
  }
}
</script>
