<template>
    <span class="stopwatch">{{ formattedTime }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const startTime = ref(Date.now());
const timeElapsed = ref(0);
let timer: number | undefined = undefined;

const updateTime = () => {
  timeElapsed.value = Date.now() - startTime.value;
};

const stop = () => {
  clearInterval(timer);
  return timeElapsed.value;
};

const restart = () => {
  startTime.value = Date.now();
  timer = setInterval(updateTime, 1);
};


defineExpose({ stop, restart });

onMounted(() => {
  timer = setInterval(updateTime, 1);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});

const formattedTime = computed(() => {
  const totalSeconds = Math.floor(timeElapsed.value / 1000);
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  const milliseconds = Math.floor((timeElapsed.value % 1000) / 10).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
});

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.stopwatch {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.5em;
  color:"primary"
}
</style>
