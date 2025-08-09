<template>
  <div class="login">
    <h1>Login</h1>

    <div class="field">
      <label>Username</label>
      <input v-model="username" placeholder="administrator" />
    </div>

    <div class="field">
      <label>Password</label>
      <input v-model="password" type="password" placeholder="••••••••" />
    </div>

    <button @click="login" :disabled="loading">
      {{ loading ? 'Logging in…' : 'Login' }}
    </button>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 👇 your live backend API
const API = 'https://zion-mainframe-backend-production.up.railway.app'

const username = ref('administrator') // prefill for convenience
const password = ref('')
const loading = ref(false)
const error = ref('')

async function login() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Please enter both fields'
    return
  }
  loading.value = true
  try {
    const resp = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })
    const data = await resp.json().catch(() => ({}))
    if (!resp.ok || !data?.success) {
      error.value = data?.message || 'Invalid credentials'
      return
    }

    // minimal session: store who logged in
    localStorage.setItem('userEmail', data.username || username.value)

    // go to console
    router.push('/console')
  } catch (e) {
    error.value = 'Network error: ' + (e?.message || e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login { max-width: 360px; margin: 6rem auto; display: grid; gap: 1rem; }
.field { display: grid; gap: .25rem; }
input { padding: .6rem .75rem; border: 1px solid #ccc; border-radius: 8px; }
button { padding: .7rem 1rem; border: none; border-radius: 8px; cursor: pointer; }
.error { color: #c0392b; }
</style>
