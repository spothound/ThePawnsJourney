<template>
  <v-footer app>
    <v-spacer />
    <v-defaults-provider
      :defaults="{ VBtn: { variant: 'text', size: 'x-small' } }"
    >
      <v-btn href="https://www.buymeacoffee.com/fnavarro" target="_blank">
        <v-icon left>mdi-coffee</v-icon>
        Buy me a coffee
      </v-btn>
    </v-defaults-provider>
  </v-footer>
</template>

<style>
.v-footer {
  padding: 0px 10px !important;
  > .v-btn--icon {
    .v-icon {
      height: 1.25em;
      width: 1.25em;
    }
  }
}
</style>
