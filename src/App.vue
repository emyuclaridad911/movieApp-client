<script setup>
import { onBeforeMount } from 'vue';
import { useGlobalStore } from "./stores/global";
import NavbarComponent from './components/NavbarComponent.vue';

const global = useGlobalStore();

onBeforeMount(() => {
  if (localStorage.getItem("token")) {
    global.user.token = localStorage.getItem("token");
    global.user.email = localStorage.getItem("email");
    global.user.isAdmin = localStorage.getItem("isAdmin") === "true";
  }
});
</script>

<template>
  <NavbarComponent />
  <div class="container">
    <router-view />
  </div>
</template>

<style scoped>
</style>
