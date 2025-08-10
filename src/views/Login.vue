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

// MUST be set in Railway (frontend service)
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
.page {
  min-height: 100vh;
  margin: 0;
  background: radial-gradient(1200px 800px at 20% 10%, #1f2937 0%, rgba(17,24,39,0.9) 40%, #0b0f1a 100%),
              linear-gradient(135deg, #0b0f1a 0%, #1a1f2b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding: 24px;
  box-sizing: border-box;
}

.wrap { width: 100%; max-width: 440px; text-align: center; }

.logo {
  width: clamp(160px, 40vw, 280px);
  height: auto;
  opacity: 0.9;
  margin: 0 auto 20px;
  user-select: none;
  display: block;
}

.card {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
  backdrop-filter: blur(12px);
  text-align: left;
}

.title { margin: 0; font-size: 22px; font-weight: 600; text-align: center; color: #fff; }

.field { margin-bottom: 14px; }
.label { display: block; font-size: 13px; margin-bottom: 6px; color: rgba(255,255,255,0.85); }

.passrow { position: relative; }

.input {
  width: 100%; padding: 11px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.06); color: #fff; outline: none; transition: border .15s, box-shadow .15s, background .15s; box-sizing: border-box;
}
.input::placeholder { color: rgba(255,255,255,0.45); }
.input:focus { border-color: rgba(255,255,255,0.35); box-shadow: 0 0 0 3px rgba(255,255,255,0.12); background: rgba(255,255,255,0.08); }

.eye {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  height: 30px; padding: 0 10px; border: 0; border-radius: 8px; background: transparent; color: rgba(255,255,255,0.75); cursor: pointer;
}

.btn {
  width: 100%; margin-top: 6px; padding: 12px 14px; border: 0; border-radius: 12px; font-weight: 600;
  background: #fff; color: #0b0f1a; cursor: pointer; transition: transform .05s ease, box-shadow .15s ease, opacity .15s ease;
}
.btn:hover { box-shadow: 0 10px 24px rgba(0,0,0,0.25); }
.btn:active { transform: translateY(1px); }
.btn:disabled { opacity: .6; cursor: default; }

.spinner {
  width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.2); border-top-color: rgba(0,0,0,0.8);
  display: inline-block; margin-right: 8px; vertical-align: -2px; animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error { margin-top: 10px; color: #fca5a5; text-align: center; font-size: 13px; }

.tagline { margin-top: 14px; color: rgba(255,255,255,0.7); font-size: 13px; }
.tagline strong { color: #fff; }
</style>
