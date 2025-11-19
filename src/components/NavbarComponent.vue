<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
    <div class="container">
      <router-link to="/" class="navbar-brand fw-bold fs-4">MyMovieApp</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center">

          <!-- Home link (always visible) -->
          <li class="nav-item">
            <router-link :class="['nav-link', isActive('/')]" to="/">Home</router-link>
          </li>

          <!-- Movies / Admin Dashboard -->
          <li v-if="global.user.token" class="nav-item">
            <router-link
              :class="['nav-link', isActive('/movies')]"
              to="/movies"
            >
              {{ global.user.isAdmin ? 'Admin Dashboard' : 'Movies' }}
            </router-link>
          </li>

          <!-- Login / Register for guests -->
          <li v-if="!global.user.token" class="nav-item">
            <router-link :class="['nav-link', isActive('/login')]" to="/login">Login</router-link>
          </li>
          <li v-if="!global.user.token" class="nav-item">
            <router-link :class="['nav-link', isActive('/register')]" to="/register">Register</router-link>
          </li>

          <!-- Logout -->
          <li v-if="global.user.token" class="nav-item">
            <button class="btn btn-outline-light ms-lg-3" @click="handleLogout">
              Logout
            </button>
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useGlobalStore } from "../stores/global";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";

const global = useGlobalStore();
const router = useRouter();
const notyf = new Notyf();

function handleLogout() {
  global.clearUserSession();
  notyf.success("Logged out successfully!");
  router.push({ path: "/" });
}

import { useRoute } from "vue-router";
const route = useRoute();
const isActive = (path) => (route.path === path ? "active fw-bold" : "");
</script>

<style scoped>
.navbar-brand {
  letter-spacing: 0.5px;
}
</style>
