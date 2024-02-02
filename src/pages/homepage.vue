<script setup lang="ts">
import router from '@/plugins/router';
definePage({
  meta: {
    icon: 'mdi-home',
    title: 'Home',
    drawerIndex: 0,
  },
})

const levels = ['0_500', '500_1000', '1000_1500', '1500_2000', '2000_2500', '2500_3000', '3000_3500']

function setEloRange(min: number, max: number) {
  localStorage.setItem('eloRange', JSON.stringify(`${min}_${max}`))
}

</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card class="pa-2" outlined>
          <v-img src="@/assets/logo.png" alt="App logo" class="logo" contain></v-img>
          <v-card-title class="headline font-kanit">Welcome to The Pawn's Journey</v-card-title>
          <v-card-text>This app is designed to help you improve your chess tactics. It uses puzzles from the Lichess public database.</v-card-text>
          <v-card-text>Select a level (elo range) and the app will provide puzzles suitable for that level.</v-card-text>
          <v-card-text>All the app's logic runs in your browser, not on a server or with a database. This means it won't store any data about your results (except locally in your browser storage data to track which puzzles you've solved). If you play on different devices, you may see some puzzles you've already solved, but since the purpose of this app is practice, repetition is beneficial.</v-card-text>
          <v-card-text>If you like this project and want to support it, consider <a href="https://github.com/spothound/ThePawnsJourney" target="_blank">visiting the project on GitHub</a> and opening an issue, proposing changes, etc. Alternatively, you can email me at navarromoralesdev@gmail.com</v-card-text>
          <v-card-text>If you find this website useful and want to show your appreciation: </v-card-text><v-btn href="https://www.buymeacoffee.com/fnavarro" target="_blank" color="primary" dark><v-icon left>mdi-coffee</v-icon>Buy me a coffee</v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card class="pa-2" outlined>
          <v-card-title class="headline">Choose Your Elo Level</v-card-title>
          <v-row>
            <v-col cols="12" class="mx-auto mb-3" v-for="level in levels" :key="level">
              <v-btn variant="outlined" @click="router.push(`/training_${level}`)" color="primary" dark>{{ level.replace('_','-') }}</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.logo {
  width: 200px;
  height: 200px;
  margin: auto;
}
</style>
