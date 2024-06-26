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
const eloRange = ref([0, 500]);
const isLoading = ref(false);
const errorMessage = ref('');
const infoAlert = ref('');
const patienceMessage = "This is a free service and the backend is down by default and takes a few seconds to start up when users start using it. You may experience a delay when starting a new session if you're the only person using the service at the moment."

infoAlert.value = patienceMessage;


const submitForm = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  isRangeInvalid.value = false;

  const getPuzzles = async (eloMin: number, eloMax: number, numberOfPuzzles: number, retries: number = 10, delay: number = 5000) => {
    for (let i = 0; i < retries; i++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 1 minute timeout

      try {
        const response = await fetch(`${apiUrl}/puzzles/rating/${eloMin}/${eloMax}?limit=${numberOfPuzzles}`, { signal: controller.signal });
        clearTimeout(timeoutId); // Clear the timeout if the request completes in time
        const puzzleCollection = await response.json();
        return puzzleCollection;
      } catch (error) {
        if (i < retries - 1) {
          infoAlert.value = patienceMessage + ` Retrying... Attempt ${i + 1} of ${retries}`;
          await new Promise(res => setTimeout(res, delay)); // Wait before retrying
        } else {
          if (error instanceof Error) {
            errorMessage.value = error.message;
          }
          throw error; // Rethrow the error after exhausting retries
        }
      }
    }
  }

  try {
    const puzzleCollection = await getPuzzles(eloRange.value[0], eloRange.value[1], numberOfPuzzles.value);
    if (puzzleCollection.length === 0) {
      isRangeInvalid.value = true;
    } else {
      localStorage.setItem('puzzleCollection', JSON.stringify(puzzleCollection));
      window.location.href = '/TrainingByRating';
    }
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    }
  } finally {
    isLoading.value = false; // Ensure loading state is reset
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
        >{{ infoAlert }}
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
</style>
