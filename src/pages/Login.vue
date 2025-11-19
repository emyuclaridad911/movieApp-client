<script setup>
import { ref, watch, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";
import { useGlobalStore } from "../stores/global";
import api from "../api";

const router = useRouter();
const notyf = new Notyf();
const global = useGlobalStore();

const email = ref("");
const password = ref("");
const isEnabled = ref(false);

watch([email, password], ([e, p]) => {
  isEnabled.value = e !== "" && p !== "";
});

onBeforeMount(() => {
  if (global.user.token) {
    router.push({ path: "/" });
    notyf.success("Already logged in!");
  }
});

async function handleSubmit() {
  try {
    const res = await api.post("/users/login", {
      email: email.value,
      password: password.value,
    });

    if (res.data.access) {
      global.setUserSession({
        token: res.data.access,
        email: res.data.email,
        isAdmin: res.data.isAdmin,
      });

      notyf.success("Login successful!");
      email.value = "";
      password.value = "";

      router.push({ path: "/" });
    }
  } catch (err) {
    if (err.response?.status === 404) {
      notyf.error("User not found");
    } else if (err.response?.status === 401) {
      notyf.error("Invalid password");
    } else {
      console.error(err);
      notyf.error("Login failed. Please contact admin.");
    }
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="container mt-5 w-50">
    <h1 class="mb-4 text-center">Login</h1>

    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input v-model="email" type="email" class="form-control" id="email" />
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input v-model="password" type="password" class="form-control" id="password" />
    </div>

    <button type="submit" class="btn btn-primary w-100" :disabled="!isEnabled">
      Login
    </button>
  </form>
</template>
