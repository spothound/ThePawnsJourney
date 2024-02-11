<script setup lang="ts">
definePage({
  meta: {
    icon: 'mdi-home',
    title: 'Home',
    drawerIndex: 0,
  },
})
import router from '@/plugins/router';
// import { ref } from 'vue';
// import { definePage } from 'vite-plugin-ssr/vue';

const levels = ['0_500', '500_1000', '1000_1500', '1500_2000', '2000_2500', '2500_3000', '3000_3500'];

const images = [
  'src/assets/bg1.jpg',
  'src/assets/bg2.jpg',
  'src/assets/bg3.jpg',
  'src/assets/bg4.jpg',
  'src/assets/bg5.jpg'
];

const quotes = [
  { text: "Every chess master was once a beginner.", author: "Irving Chernev" },
  { text: "If you wish to succeed, you must brave the risk of failure.", author: "Garry Kasparov" },
  { text: "Chess is an infinitely complex game, which one can play in infinitely numerous & varied ways.", author: "Vladimir Kramnik" },
  { text: "You can only get good at chess if you love the game.", author: "Bobby Fischer" },
  { text: "Without the element of enjoyment, it is not worth trying to excel at anything.", author: "Magnus Carlsen" }
];

// const slides = ref(quotes.map(quote => `${quote.text} - ${quote.author}`));

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
            <v-carousel-item v-for="(quote, i) in quotes" :key="i">
              <v-sheet height="100%">
                <div :style="{ backgroundImage: `url(${images[i]})` }"
                  class="d-flex fill-height flex-column justify-center align-center text-center cover font-nunito">
                  <div class="text-h5 text-overlay mx-2 mb-2 font-bold">
                    {{ quote.text }}
                  </div>
                  <!-- add paddint top -->
                  <div class="text-h6 p-2 text-overlay">
                    - {{ quote.author }}
                  </div>
                </div>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
          <v-card-title class="headline font-kanit text-blue-500 font-bold">Welcome to The Pawn's Journey</v-card-title>
          <v-card-text>This app is designed to help you improve your chess tactics. It uses puzzles from the Lichess
            public database.</v-card-text>
          <v-card-text>Select a level (elo range) and the app will provide puzzles suitable for that level.</v-card-text>
          <v-card-text>All the app's logic runs in your browser, not on a server or with a database. This means it won't
            store any data about your results (except locally in your browser storage data to track which puzzles you've
            solved). If you play on different devices, you may see some puzzles you've already solved, but since the
            purpose of this app is practice, repetition is beneficial.</v-card-text>
          <v-card-text>If you like this project and want to support it:</v-card-text>
          <v-card-text><v-btn href="https://github.com/spothound/ThePawnsJourney" target="_blank" color="primary"
              dark><v-icon left>mdi-github</v-icon>visiting the project on GitHub</v-btn></v-card-text>
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