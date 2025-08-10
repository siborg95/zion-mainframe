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

      <button type="submit" :disabled="loading">
        {{ loading ? "Logging in…" : "Login" }}
      </button>

      <button type="button" class="secondary" @click="forceContinue">Force Continue</button>

      <p v-if="msg" class="msg">{{ msg }}</p>
    </form>

    <div class="debug">
      <div><strong>Status:</strong> {{ lastStatus ?? "—" }}</div>
      <div class="url"><strong>URL:</strong> {{ lastURL || "—" }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
// hard-wire API to remove any env confusion
const API = "https://zion-mainframe-backend-production.up.railway.app";

const username = ref("");
const password = ref("");
const loading  = ref(false);
const msg = ref("");
const lastStatus = ref(null);
const lastURL = ref("");

async function handleLogin () {
  msg.value = "";
  loading.value = true;
  lastURL.value = `${API}/auth/login`;
  lastStatus.value = null;

  try {
    const res = await fetch(lastURL.value, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.value, password: password.value })
    });
    lastStatus.value = res.status;
    const dat
