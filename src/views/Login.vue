<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="field">
        <label>Username</label>
        <input v-model="username" autocomplete="username" />
      </div>
      <div class="field">
        <label>Password</label>
        <input v-model="password" type="password" autocomplete="current-password" />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? "Logging in…" : "Login" }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login as apiLogin } from "../lib/api";

const router = useRouter();
const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function handleLogin () {
  error.value = "";
  loading.value = true;
  try {
    const data = await apiLogin(username.value, password.value);
    localStorage.setItem("token", data.token || "fake-jwt-token");
    router.push("/console");
  } catch (e) {
    error.value = e.message || "Login failed";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login { max-width: 420px; margin: 4rem auto; padding: 1.5rem; border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.08); background: #fff; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
.field { margin-bottom: 1rem; }
label { display:block; margin-bottom:.25rem; font-weight:600; }
input { width:100%; padding:.6rem .75rem; border:1px solid #d0d7de; border-radius:8px; outline:none; }
button { width:100%; padding:.7rem 1rem; border:0; border-radius:8px; cursor:pointer; font-weight:600; margin-top:.5rem; }
.error { color:#b00020; margin-top:.75rem; }
</style>
