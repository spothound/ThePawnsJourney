<script setup>
import { onMounted } from 'vue'
import { googleOneTap, decodeCredential } from 'vue3-google-login'

onMounted(() => {
  googleOneTap()
    .then((response) => {
      // This promise is resolved when user selects an account from the the One Tap prompt
      console.log('Handle the response', decodeCredential(response.credential))
      const user = decodeCredential(response.credential)
    })
    .catch((error) => {
      console.log('Handle the error', error)
    })
})
</script>

<template>
  <div>One-Tap prompt will be shown once this component is mounted</div>
</template>
