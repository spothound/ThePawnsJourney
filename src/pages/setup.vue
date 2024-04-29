<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();
const apiUrl = import.meta.env.VUE_APP_API_URL || 'https://api.thepawnsjourney.live';
definePage({
  meta: {
    icon: 'mdi-new-box',
    title: 'New Session',
    drawerIndex: 0,
  },
})
const isRangeInvalid = ref(false) // Add this line
const numberOfPuzzles = ref(100)
const eloRange = ref([0, 400])
const submitForm = async () => {
  const getPuzzles = async (eloMin: number, eloMax: number, numberOfPuzzles: number) => {
    const response = await fetch(`${apiUrl}/puzzles/rating/${eloMin}/${eloMax}?limit=${numberOfPuzzles}`);    const puzzleColection = await response.json();
    return puzzleColection;
  }
  const puzzleColection = await getPuzzles(eloRange.value[0], eloRange.value[1], numberOfPuzzles.value);
  if (puzzleColection.length === 0) {
    isRangeInvalid.value = true;
    return;
  }else{
    isRangeInvalid.value = false;
    localStorage.setItem('puzzleColection', JSON.stringify(puzzleColection));
    window.location.href = '/TrainingByRating';
  }
}

const predefinedRangesElo = [[0, 500], [500, 1000], [1000, 1500], [1500, 2000], [2000, 2500], [2500, 3000], [3000, 3500]]
const predefinedRangesN = [1, 10, 20, 50, 100, 200, 300]


const selectELORange = (range: number[]) => {
  eloRange.value = range
}

const selectNRange = (npuzzles: number) => {
  numberOfPuzzles.value = npuzzles
}

</script>

<template>
  <v-sheet width="80%" class="mx-auto">
    <v-form ref="form">
      <label class="form-label">Number of puzzles:</label>
      <v-slider v-model="numberOfPuzzles" min="1" max="300" step="1" thumb-label="always"></v-slider>
      <v-btn v-for="(npuzzles, index) in predefinedRangesN" :key="index" class="range-button" @click="selectNRange(npuzzles)">
          {{ npuzzles }}
        </v-btn>
      <label class="form-label">ELO range:</label>
      <v-range-slider v-model="eloRange" min="0" max="3500" step="1" thumb-label="always" />
      <div class="predefined-ranges">
        <v-btn v-for="(range, index) in predefinedRangesElo" :key="index" class="range-button" @click="selectELORange(range)">
          {{ range[0] }} - {{ range[1] }}
        </v-btn>
      </div>
      <div style="display: flex; justify-content: center;">
        <v-btn @click="submitForm">Start Session</v-btn>
      </div>
      <p v-if="isRangeInvalid">The current range is not valid.</p>
    </v-form>
  </v-sheet>
</template>

<style scoped>
.range-button {
  background-color: #4CAF50;
  color: white;
  margin: 5px;
}
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
