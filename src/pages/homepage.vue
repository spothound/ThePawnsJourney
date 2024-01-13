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
</script>

<template>
  <v-container>
    <v-row class="home">
    <img src="@/assets/logo.png" alt="App logo" class="logo">
    <h1>The pawn's Jouney</h1>
    <p>This app is designed to help you train easy chess tactics in your browser. It uses <strong>puzzless from Lichess public database</strong>.</p>
    <p>You can pick a level (elo range) and the app will let you play infinite puzzless for that level.</p>
    <p>So far, all the logic/code of the app runs in your browser (not in a server, not with a database), this means it won't store any data about your results (except locally in your browser storage to know which ones you have solved) and every time you pick a new level the puzzless will be randomized and the progress reset.</p>
    <p>If you like this project and want to support it consider <a href="https://github.com/spothound/ThePawnsJourney" target="_blank">visiting the project in GitHub</a> and opening an issue/ticket or writting to me at navarromoralesdev@gmail.com</p>
  </v-row>
  <v-row justify="center">
    <div class="text-h4">PICK AN ELO LEVEL</div>
  </v-row>
  <v-row justify="center">
      <v-btn variant="outlined" @click="router.push('/training_500_1000')">500-1000</v-btn>
      <v-btn variant="outlined" @click="router.push('/training_1000_1500')">1000-1500</v-btn>
      <v-btn variant="outlined" @click="router.push('/training_1500_2000')">1500-2000</v-btn>
      <v-btn variant="outlined" @click="router.push('/training_2000_2500')">2000-2500</v-btn>
      <v-btn variant="outlined" @click="router.push('/training_2500_3000')">2500-3000</v-btn>
      <v-btn variant="outlined" @click="router.push('/training_3000_3500')">3000-3500</v-btn>
    </v-row>
  </v-container>
</template>

<style scoped>
.home {
  width: 80%;
  margin: 0 auto;
}

.logo {
  width: 200px;
  height: 200px;
}
</style>
