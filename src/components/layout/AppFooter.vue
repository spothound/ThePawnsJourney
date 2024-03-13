<script setup lang="ts">
import { ref } from 'vue';

const icons = ref([
    'mdi-facebook',
    'mdi-twitter',
    'mdi-linkedin',
    'mdi-instagram',
]);
</script>

<template>
    <v-footer class="text-center flex flex-column pb-5">
        <!-- In case of adding social media, uncomment -->
        <!-- <div>
            <v-btn v-for="icon in icons" :key="icon" class="mx-4" :icon="icon" variant="text"></v-btn>
        </div> -->

        <div class="px-2 md:px-6 py-4 my-3 bg-indigo rounded-md max-w-[660px]">
            <div>If you enjoy this project and want to show your support, visit its GitHub repository</div>
            <div>
                <v-btn href="https://github.com/spothound/ThePawnsJourney" target="_blank" dark
                    class="bg-black mx-2 mt-3" :block="false">
                    <v-icon left class="mr-1">mdi-github</v-icon> Pawn's Journey</v-btn>
            </div>
        </div>

        <v-divider></v-divider>

        <div>
            {{ new Date().getFullYear() }} — <strong>The Pawn's Journey</strong>
        </div>
    </v-footer>
</template>
