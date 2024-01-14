<script setup lang="ts">
import router from '@/plugins/router';
definePage({
  meta: {
    icon: 'mdi-home',
    title: 'Homepage',
    drawerIndex: 0,
  },
})

function setEloRange(min: number, max: number) {
  localStorage.setItem('eloRange', JSON.stringify(`${min}_${max}`))
}
const levels = ['500_1000', '1000_1500', '1500_2000', '2000_2500', '2500_3000', '3000_3500']
</script>

<template>
<v-container>
  <v-row class="text-center">
    <v-col cols="12">
      <img src="@/assets/logo.png" alt="App logo" class="logo">
    </v-col>
  </v-row>
  <v-row class="text-center">
    <v-col cols="12">
      <h1>The pawn's Jouney</h1>
    </v-col>
  </v-row>
  <v-row class="text-center">
    <v-col cols="12">
      <p>This app is designed to help you train easy chess tactics in your browser. It uses <strong>puzzless from Lichess public database</strong>.</p>
      <p>You can pick a level (elo range) and the app will let you play infinite puzzless for that level.</p>
      <p>So far, all the logic/code of the app runs in your browser (not in a server, not with a database), this means it won't store any data about your results (except locally in your browser storage to know which ones you have solved) and every time you pick a new level the puzzless will be randomized and the progress reset.</p>
      <p>If you like this project and want to support it consider <a href="https://github.com/spothound/ThePawnsJourney" target="_blank">visiting the project in GitHub</a> and opening an issue/ticket or writting to me at navarromoralesdev@gmail.com</p>
    </v-col>
  </v-row>
  <v-row class="text-center">
    <v-col cols="12">
      <div class="text-h4">PICK AN ELO LEVEL</div>
    </v-col>
  </v-row>
  <v-row class="text-center">
    <v-col cols="12" sm="6" md="4" lg="3" xl="2" class="mx-auto mb-3" v-for="level in levels" :key="level">
      <v-btn variant="outlined" @click="router.push(`/training_${level}`)">{{ level }}</v-btn>
    </v-col>
  </v-row>
</v-container>
</template>

<style scoped>
.logo {
  width: 200px;
  height: 200px;
}
</style>
