<script setup lang="ts">
import { ref } from 'vue'
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

const numberOfPuzzles = ref(100);
const eloRange = ref([0, 500]);
const isLoading = ref(false);
const errorMessage = ref('');

const fetchWithRetry = async (url: string, options: any = {}, retries: number = 5, delay: number = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response.json();
      } else {
        console.log('Network response was not ok:', response);
        throw new Error('Network response was not ok', );
      }
    } catch (error) {
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw error;
      }
    }
  }
};

const submitForm = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const getPuzzles = async (eloMin: number, eloMax: number, numberOfPuzzles: number) => {
      const response = await fetchWithRetry(`${apiUrl}/puzzles/rating/${eloMin}/${eloMax}?limit=${numberOfPuzzles}`, {}, 5, 6000);
      return response;
    };
    const puzzleCollection = await getPuzzles(eloRange.value[0], eloRange.value[1], numberOfPuzzles.value);
    console.log('Puzzle collection:', toRaw(puzzleCollection)); // Convert proxy to raw object
    if (puzzleCollection.length === 0) {
      errorMessage.value = 'The current range is not valid.';
      return;
    } else {
      errorMessage.value = '';
      localStorage.setItem('puzzleCollection', JSON.stringify(toRaw(puzzleCollection))); // Store raw object
      window.location.href = '/TrainingByRating';
    }
  } catch (error) {
    console.error('Error fetching puzzles:', error);
    errorMessage.value = 'An error occurred while fetching puzzles. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

const predefinedRangesElo = [[0, 500], [500, 1000], [1000, 1500], [1500, 2000], [2000, 2500], [2500, 3000], [3000, 3500]];
const predefinedRangesN = [1, 10, 20, 50, 100, 200, 300];

const selectELORange = (range: number[]) => {
  eloRange.value = range;
}

const selectNRange = (npuzzles: number) => {
  numberOfPuzzles.value = npuzzles;
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
        <v-btn :loading="isLoading" @click="submitForm">Start Session</v-btn>
      </div>
        <br>
        <v-alert
          v-if="errorMessage"
          density="compact"
          color="error"
          icon="$error"
          title="Error!">
          {{ errorMessage }}
        </v-alert>
        <v-alert
          v-if="isLoading"
          title="Patience"
          type="info"
          variant="tonal"
        >This is a free service and the backend is down by default and takes a few seconds to start up when users start using it. You may experience a delay when starting a new session if you're the only person using the service at the moment.
      </v-alert>
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
.error-message {
  color: red;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}
</style>
