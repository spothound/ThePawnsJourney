<template>
  <v-footer app>
    <v-spacer />
    <v-defaults-provider :defaults="{ VBtn: { variant: 'text', size: 'x-small' } }">
      <div class="text-caption pt-6 pb-1 pt-md-0 text-center" style="white-space: nowrap">
        <a href="https://github.com/spothound/ThePawnsJourney" target="_blank">
          <v-icon icon="mdi-github" size="x-large" class="drawer-footer-icon" color="primary" />
        </a>
      </div>
      <div class="text-caption pt-6 pb-1 pt-md-0 text-center" style="white-space: nowrap">

        <a href="https://github.com/spothound/" class="font-weight-bold text-primary" target="_blank">by Francisco
          Navarro</a>
      </div>
      <div class="text-caption pt-6 pb-1 pt-md-0 text-center" style="white-space: nowrap">
        <v-btn href="https://www.buymeacoffee.com/fnavarro" target="_blank">
          <v-icon left>mdi-coffee</v-icon>
          Buy me a coffee
        </v-btn>
      </div>
    </v-defaults-provider>
  </v-footer>
</template>

<style>
.v-footer {
  padding: 0px 10px !important;

  >.v-btn--icon {
    .v-icon {
      height: 1.25em;
      width: 1.25em;
    }
  }
}
</style>
