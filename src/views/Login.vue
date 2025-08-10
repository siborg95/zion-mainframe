<template>
  <div class="page">
    <div class="wrap">
      <img class="logo" src="/neurosharp-logo.png" alt="NeuroSharp" draggable="false" />
      <div class="card">
        <h1 class="title">Welcome to NeuroSharp Cloud</h1>

        <div class="field">
          <label class="label">Username</label>
          <input class="input" v-model="username" type="text" placeholder="administrator" autocomplete="username" />
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="passrow">
            <input class="input" :type="showPwd ? 'text' : 'password'" v-model="password" placeholder="••••••••••••" autocomplete="current-password" />
            <button type="button" class="eye" @click="showPwd = !showPwd">{{ showPwd ? 'Hide' : 'Show' }}</button>
          </div>
        </div>

        <button class="btn" :disabled="loading" @click="doLogin">
          <span v-if="loading" class="spinner"></span>
          <span>{{ loading ? 'Signing in…' : 'Sign in' }}</span>
        </button>

        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <p class="tagline">Powered by <strong>NeuroSharp Quantum Core</strong></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPwd = ref(false)

const API = import.meta.env.VITE_API_URL || ''

async function doLogin () {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })
    const data = await res.json()
    if (!res.ok || !data?.ok) throw new Error(data?.error || `HTTP ${res.status}`)
    localStorage.setItem('token', data.token)
    router.push('/console')
  } catch (e) {
    error.value = String(e.message || e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* white page, content higher up */
.page {
  min-height: 100vh;
  margin: 0;
  background: #f7f8fb;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 32px 24px 24px;
  box-sizing: border-box;
  color: #111827;
}

/* card width; logo is slightly smaller than this */
.wrap { width: 100%; max-width: 440px; text-align: center; }

/* logo slightly narrower than the card */
.logo {
  width: 90%;
  max-width: 420px;
  height: auto;
  display: block;
  margin: 4px auto 14px;
  user-select: none;
}

/* blue login box */
.card {
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  color: #ffffff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.18);
  text-align: left;
}

.title {
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: #ffffff;
}

.field { margin-bottom: 14px; }
.label { display: block; font-size: 13px; margin-bottom: 6px; color: rgba(255,255,255,0.9); }
.passrow { position: relative; }

/* white inputs on blue card */
.input {
  width: 100%;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  outline: none;
  box-sizing: border-box;
  transition: border .15s, box-shadow .15s, background .15s;
}
.input::placeholder { color: #6b7280; }
.input:focus {
  border-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.35);
  background: #ffffff;
}

.eye {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  height: 32px; padding: 0 10px; border: 0; border-radius: 8px;
  background: transparent; color: #374151; cursor: pointer;
}

.btn {
  width: 100%;
  margin-top: 8px;
  padding: 12px 14px;
  border: 0;
  border-radius: 10px;
  font-weight: 700;
  background: #ffffff;
  color: #0b0f1a;
  cursor: pointer;
  transition: transform .05s ease, box-shadow .15s ease, filter .15s ease;
}
.btn:hover { filter: brightness(0.98); box-shadow: 0 8px 18px rgba(255,255,255,.25); }
.btn:active { transform: translateY(1px); }
.btn:disabled { opacity: .65; cursor: default; }

.spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(0,0,0,0.25); border-top-color: rgba(0,0,0,0.75);
  display: inline-block; margin-right: 8px; vertical-align: -2px;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error { margin-top: 10px; color: #b91c1c; text-align: center; font-size: 13px; }

.tagline { margin-top: 14px; color: #374151; font-size: 13px; }
.tagline strong { color: #111827; }
</style>
