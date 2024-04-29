<script setup lang="ts">
definePage({
  meta: {
    icon: 'mdi-timeline-clock',
    title: 'Changelog',
    drawerIndex: 3,
  },
})

const changelog = [
  {
    title: 'v1.0',
    text: 'The first version of the website is publised. It includes dynamic sessions (pick number of puzzless and elo range) with timers, hints and stats. You can also visit individuals puzzles by their id. We also have a changelog page to keep track of updates.',
    color: 'bg-purple-lighten-2',
    icon: 'mdi-home-floor-1',
    size: 'large'
  },
  // Add more entries here...
];

</script>

<template>
  <v-timeline align="start" density="compact" line-color="green">
    <v-timeline-item
      v-for="(entry, index) in changelog"
      :key="index"
      :dot-color="entry.color"
      :size="entry.size"
      fill-dot
    >
    <template v-slot:opposite>
        <div
          :class="`pt-1 headline font-weight-bold text-${entry.color}`"
          v-text="entry.title"
        ></div>
      </template>
      <div>
        <h2 :class="`mt-n1 headline font-weight-light mb-4 text-${entry.color}`">
          {{entry.title}}
        </h2>
        <div>
          {{entry.text}}
        </div>
      </div>
    </v-timeline-item>
  </v-timeline>
</template>
<style scoped>
.v-timeline {
  height: auto; /* Adjust as needed */
}

.v-timeline-item {
  height: auto; /* Adjust as needed */
}
</style>
