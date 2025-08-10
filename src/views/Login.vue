<template>
  <div class="page">
    <div class="wrap">
      <!-- Logo spans the card width, keeps aspect ratio -->
      <img class="logo" src="/neurosharp-logo.png" alt="NeuroSharp" draggable="false" />

      <!-- White card like your sample -->
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
/* page background stays dark */
.page {
  min-height: 100vh;
  margin: 0;
  background: radial-gradient(1200px 800px at 20% 10%, #1f2937 0%, rgba(17,24,39,0.9) 40%, #0b0f1a 100%),
              linear-gradient(135deg, #0b0f1a 0%, #1a1f2b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  color: #fff; /* for tagline */
}

/* card width; logo matches this */
.wrap { width: 100%; max-width: 440px; text-align: center; }

/* logo as wide as the card; keep aspect ratio */
.logo {
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto 20px;
  user-select: none;
}

/* white box like your sample */
.card {
  background: #ffffff;
  color: #111827; /* dark text inside card */
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.15);
  text-align: left;
}

.title {
  margin: 0 0 16px;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: #111827;
}

.field { margin-bottom: 14px; }
.label { display: block; font-size: 13px; margin-bottom: 6px; color: #374151; }

.passrow { position: relative; }

.input {
  width: 100%;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  color: #111827;
  outline: none;
  transition: border .15s, box-shadow .15s, background .15s;
  box-sizing: border-box;
}
.input::placeholder { color: #6b7280; }
.input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,.15);
  background: #ffffff;
}

.eye {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  height: 32px; padding: 0 10px; border: 0; border-radius: 8px;
  background: transparent; color: #4b5563; cursor: pointer;
}

/* blue primary button */
.btn {
  width: 100%;
  margin-top: 8px;
  padding: 12px 14px;
  border: 0;
  border-radius: 10px;
  font-weight: 700;
  background: #2563eb;     /* blue */
  color: #ffffff;
  cursor: pointer;
  transition: filter .15s ease, transform .05s ease, box-shadow .15s ease;
}
.btn:hover { filter: brightness(1.05); box-shadow: 0 8px 18px rgba(37,99,235,.25); }
.btn:active { transform: translateY(1px); }
.btn:disabled { opacity: .6; cursor: default; }

.spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
  display: inline-block; margin-right: 8px; vertical-align: -2px;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error { margin-top: 10px; color: #b91c1c; text-align: center; font-size: 13px; }

/* tagline under card (white on dark bg) */
.tagline { margin-top: 14px; color: rgba(255,255,255,0.8); font-size: 13px; }
.tagline strong { color: #fff; }
</style>
