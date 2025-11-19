<script setup>
import { computed } from "vue";
import { useGlobalStore } from "../stores/global";
import Movies from "./Movies.vue";
import AdminDashboard from "./AdminDashboard.vue";

const global = useGlobalStore();

const isAdmin = computed(() => global.user.isAdmin);
</script>

<template>
  <div>
    <Movies v-if="!isAdmin" />
    <AdminDashboard v-else />
  </div>
</template>
