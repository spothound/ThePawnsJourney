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
  <v-row class="text-center">
    <v-col cols="12">
      <img src="@/assets/logo.png" alt="App logo" class="logo">
    </v-col>
  </v-row>
  <v-row class="text-center">
    <v-col cols="12">
      <h1>The Pawn's Journey</h1>
    </v-col>
  </v-row>
  <v-row class="text-center">
    <v-col cols="12">
      <p>This app is designed to help you train easy chess tactics in your browser. It uses <strong>puzzles from Lichess public database</strong>.</p>
      <p>You can pick a level (elo range) and the app will let you play different puzzles for that level.</p>
      <p>So far, all the logic/code of the app runs in your browser (not in a server, nor with a database), this means it won't store any data about your results (except locally in your browser storage data to know which ones you have solved). If you play on different devices you may get some puzzles that you have already played but since the purpose of this is practice, who cares.</p>
      <p>If you like this project and want to support it, consider <a href="https://github.com/spothound/ThePawnsJourney" target="_blank">visiting the project in GitHub</a> and opening an issue/ticket, propose changes, etc; or send me an email to navarromoralesdev@gmail.com</p>
      <v-btn href="https://www.buymeacoffee.com/fnavarro" target="_blank"><v-icon left>mdi-coffee</v-icon>Buy me a coffee</v-btn> if you find this website useful for your practice and want to thank me!
    </v-col>
  </v-row>
  <v-row class="text-center">
    <v-col cols="12">
      <div class="text-h4">PICK AN ELO LEVEL</div>
    </v-col>
  </v-row>
  <v-row class="text-center">
    <v-col cols="12" sm="6" md="4" lg="3" xl="2" class="mx-auto mb-3">
      <v-btn variant="outlined" @click="router.push(`/training`)">Training</v-btn>
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
