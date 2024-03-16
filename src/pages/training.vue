<script setup lang="ts">
definePage({
  meta: {
    icon: 'mdi-numeric-0',
    title: 'Training Session',
    drawerIndex: 0,
  },
})
const router = useRouter();
const puzzleColection = JSON.parse(localStorage.getItem('puzzleColection') as string);
if (!puzzleColection) {
  window.location.href = '/Setup';
}
</script>

<template>
  <div class="wrapper full-size">
    <TrainingSession/>
  </div>
</template>

<style scoped>
.full-size {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
