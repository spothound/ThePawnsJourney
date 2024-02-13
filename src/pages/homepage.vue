<script setup lang="ts">
definePage({
  meta: {
    icon: 'mdi-home',
    title: 'Home',
    drawerIndex: 0,
  },
})
// this file contains the images paths and the quotes
import data from '@/data/quotes.json';
// generate as many random quotes as images
const randomQuotes = data.quotes.sort(() => Math.random() - 0.5).slice(0, data.images.length);
function setEloRange(min: number, max: number) {
  localStorage.setItem('eloRange', JSON.stringify(`${min}_${max}`))
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-2" outlined>
          <v-carousel cycle height="300" hide-delimiter-background show-arrows="hover" class="rounded-md">
            <v-carousel-item v-for="(image, i) in data.images" :key="i">
              <v-sheet height="100%">
                <div :style="{ backgroundImage: `url(${image})` }"
                  class="d-flex fill-height flex-column justify-center align-center text-center cover font-nunito">
                  <div class="text-h5 text-overlay mx-2 mb-2 font-bold">
                    {{ randomQuotes[i].text }}
                  </div>
                  <!-- add paddint top -->
                  <div class="text-h6 p-2 text-overlay">
                    - {{ randomQuotes[i].author }} -
                  </div>
                </div>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
          <v-card-title class="headline font-kanit text-blue-500 font-bold mt-3">Welcome to The Pawn's
            Journey</v-card-title>
          <v-card-text>This application is designed to help you improve your chess tactics by using puzzles from the
            public Lichess database. Choose a level (elo rank) and the application will provide you with puzzles adapted
            to that
            level.</v-card-text>
          <v-card-text>All the logic of the application runs in your browser, not on a server or with a database. This
            means that it will not store any data about your results (except locally in your browser's storage data to
            track the puzzles you have solved).</v-card-text>
          <v-card-text>
            So if you play on different devices, you may see some puzzles you have already solved, but as the purpose of
            this
            app is practice, repetition is beneficial.
          </v-card-text>
        </v-card>
        <!-- <v-card class="pa-2" outlined>
          <v-card-title class="headline">Choose Your Elo Level</v-card-title>
          <v-row>
            <v-col v-for="level in levels" :key="level" class="mx-auto mb-3" cols="12">
              <v-btn variant="outlined" color="primary" dark @click="router.push(`/training_${level}`)">{{
                level.replace('_', '-') }}</v-btn>
            </v-col>
          </v-row>
        </v-card> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.cover {
  background-size: cover;
  background-position: center;
}

.text-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 5px;
}

.v-btn.v-btn--elevated {
  background-color: rgba(148, 163, 184, 0.8);
  font-size: 1.2rem;
}

.v-btn__content svg {
  color: white;
}
</style>