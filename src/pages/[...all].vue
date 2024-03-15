<script lang="ts">
export default defineComponent({
  name: 'ErrorPage',
})
import { ref } from 'vue'

const icon = ref(['mdi-book-search'])
</script>

<template>
  <div class="text-center mt-5">
    <v-icon class="text-9xl mb-4 opacity-60" icon="custom:logo-3-pj" />
    <v-icon class="text-9xl mb-4 opacity-50 text-green-600"
      >mdi-book-search</v-icon
    >
    <p class="xxxs:text-4xl text-8xl font-kanit text-red-800 opacity-90">
      404 Not Found
    </p>
  </div>
</template>
