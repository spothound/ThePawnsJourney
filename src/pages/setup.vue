<script setup lang="ts">
import { ref, defineEmits } from 'vue'
const router = useRouter();
const apiUrl = import.meta.env.VUE_APP_API_URL || 'https://api.thepawnsjourney.live';

definePage({
  meta: {
    icon: 'mdi-new-box',
    title: 'New Session',
    drawerIndex: 0,
  },
})

const numberOfPuzzles = ref(10)
const eloRange = ref([0, 500])

const submitForm = async () => {

  const getPuzzles = async (eloMin: number, eloMax: number, numberOfPuzzles: number) => {
    const response = await fetch(`${apiUrl}/puzzles/rating/${eloMin}/${eloMax}?limit=${numberOfPuzzles}`);    const puzzleColection = await response.json();
    return puzzleColection;
  }

  const puzzleColection = await getPuzzles(eloRange.value[0], eloRange.value[1], numberOfPuzzles.value);
  localStorage.setItem('puzzleColection', JSON.stringify(puzzleColection));
  window.location.href = '/Training';
}
</script>

<template>
  <v-sheet width="300" class="mx-auto">
    <v-form ref="form">
      <label class="form-label">Number of puzzles:</label>
      <v-slider v-model="numberOfPuzzles" min="10" max="500" step="10" thumb-label="always"></v-slider>
      <label class="form-label">ELO range:</label>
      <v-range-slider v-model="eloRange" min="0" max="3000" step="100" thumb-label="always" />
      <div style="display: flex; justify-content: center;">
        <v-btn @click="submitForm">Start Session</v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<style scoped>
.full-size {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.session-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.form-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}
</style>
