<template>
        <v-btn flat icon @click="toggleTheme" size="48"><v-icon>mdi-{{ icon }}</v-icon></v-btn>
  </template>
  

<script setup>
import { useTheme } from 'vuetify'
import { ref } from 'vue';

const theme = useTheme()
let icon = ref('lightbulb-off')

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  icon = theme.global.current.value.dark ? 'lightbulb' : 'lightbulb-off'
}
</script>