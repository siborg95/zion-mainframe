<template>
  <div class="login">
    <h1>Login (SPA)</h1>
    <form @submit.prevent="handleLogin">
      <div class="field">
        <label>Username</label>
        <input v-model="username" autocomplete="username" />
      </div>
      <div class="field">
        <label>Password</label>
        <input v-model="password" type="password" autocomplete="current-password" />
      </div>
      <button type="submit" :disabled="loading">{{ loading ? "Logging in…" : "Login" }}</button>
      <button type="button" class="secondary" @click="forceContinue">Force Continue</button>
      <p v-if="msg" class="msg">{{ msg }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const API = "https://zion-mainframe-backend-production.up.railway.app";
const username = ref(""); const password = ref(""); const loading = ref(false);
const msg = ref("");

async function handleLogin () {
  msg.value = ""; loading.value = true;
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.value, password: password.value })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data && data.ok) {
      localStorage.setItem("token", data.token || "fake-jwt-token");
      msg.value = "Login OK. Redirecting…";
      router.push("/console");
    } else {
      msg.value = `Error [${res.status}]: ${data?.error || "Login failed"}`;
    }
  } catch (e) {
    msg.value = `Network error: ${e?.message || e}`;
  } finally { loading.value = false; }
}
function forceContinue () { localStorage.setItem("token","dev"); router.push("/console"); }
</script>

<style scoped>
.login { max-width: 420px; margin: 4rem auto; padding: 1.5rem; border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.08); background: #fff; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
.field { margin-bottom: 1rem; }
label { display:block; margin-bottom:.25rem; font-weight:600; }
input { width:100%; padding:.6rem .75rem; border:1px solid #d0d7de; border-radius:8px; outline:none; }
button { width:100%; padding:.7rem 1rem; border:0; border-radius:8px; cursor:pointer; font-weight:600; margin-top:.5rem; }
.secondary { background:#eee; }
.msg { margin-top:.75rem; color:#333; }
</style>
