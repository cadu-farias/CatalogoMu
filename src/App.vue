<template>
  <v-app>
    <component>
      <NavBar v-if="showNavbar" />
      <router-view />
    </component>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showNavbar = computed(() => !route.meta.hideNavbar);

</script>
