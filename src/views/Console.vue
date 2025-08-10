<template>
  <div class="console">
    <h2>Console View</h2>

    <div class="actions">
      <button @click="checkAuth" :disabled="loading">
        {{ loading ? 'Checking…' : 'Verify session' }}
      </button>
      <button @click="clearLogs" :disabled="loading">Clear</button>
    </div>

    <pre class="log">{{ logs.join('\n') }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Your live backend
const API = 'https://zion-mainframe-backend-production.up.railway.app'

const logs = ref(['[Console ready]'])
const loading = ref(false)

function log(...args) {
  logs.value.push(args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '))
}

function clearLogs() {
  logs.value = ['[Console ready]']
}

async function authFetch(path, opts = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    ...(opts.headers || {}),
    // attach token if present
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
  const res = await fetch(`${API}${path}`, { ...opts, headers })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = text }
  return { ok: res.ok, status: res.status, data }
}

async function checkAuth() {
  loading.value = true
  logs.value = ['[Console ready]']
  try {
    log('Reading token from localStorage…')
    const token = localStorage.getItem('token')
    if (!token) {
      log('❌ No token found. Go back and log in.')
      loading.value = false
      return
    }
    log('✅ Token found (first 32):', token.slice(0, 32) + '…')

    // Try common “who am I” endpoints. Keep whichever exists in your API.
    log('→ GET /auth/me')
    let r = await authFetch('/auth/me', { method: 'GET' })
    log(`Status ${r.status}`, r.data)
    if (!r.ok) {
      log('→ GET /auth/profile')
      r = await authFetch('/auth/profile', { method: 'GET' })
      log(`Status ${r.status}`, r.data)
    }

    // Example protected API call (change to a real one you have)
    log('→ GET /api/secure (example)')
    const r2 = await authFetch('/api/secure', { method: 'GET' })
    log(`Status ${r2.status}`, r2.data)

  } catch (e) {
    log('❌ Error:', e?.message || e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.console { max-width: 800px; margin: 2rem auto; display: grid; gap: 1rem; }
.actions { display: flex; gap: .5rem; }
button { padding: .6rem .9rem; border: none; border-radius: 8px; cursor: pointer; }
.log { background: #0b1020; color: #cde3ff; padding: 1rem; border-radius: 8px; min-height: 240px; white-space: pre-wrap; }
</style>
