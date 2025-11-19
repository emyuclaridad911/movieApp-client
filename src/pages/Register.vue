<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";
import api from "../api";

const router = useRouter();
const notyf = new Notyf();

const username = ref("");
const email = ref("");
const password = ref("");
const isEnabled = ref(false);

watch([username, email, password], ([u, e, p]) => {
  isEnabled.value = u !== "" && e !== "" && p !== "";
});

async function handleRegister() {
  try {
    const res = await api.post("/users/register", {
      username: username.value,
      email: email.value,
      password: password.value,
    });

    notyf.success(res.data.message || "Registered successfully!");
    username.value = "";
    email.value = "";
    password.value = "";

    router.push({ path: "/login" });
  } catch (err) {
    if (err.response?.status === 400) {
      notyf.error(err.response.data.message || "Registration failed");
    } else {
      console.error(err);
      notyf.error("Registration failed. Please contact admin.");
    }
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister" class="container mt-5 w-50">
    <h1 class="mb-4 text-center">Register</h1>

    <div class="mb-3">
      <label for="username" class="form-label">Username</label>
      <input v-model="username" type="text" class="form-control" id="username" />
    </div>

    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input v-model="email" type="email" class="form-control" id="email" />
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input v-model="password" type="password" class="form-control" id="password" />
    </div>

    <button type="submit" class="btn btn-success w-100" :disabled="!isEnabled">
      Register
    </button>
  </form>
</template>
