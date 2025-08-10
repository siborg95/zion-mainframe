<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center p-6">
    <!-- build badge (optional) -->
    <div v-if="buildLabel" class="fixed top-4 right-4 text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/80 ring-1 ring-white/15">
      BUILD {{ buildLabel }}
    </div>

    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="flex flex-col items-center mb-6">
        <img
          src="/neurosharp-logo.png"
          alt="NeuroSharp"
          class="h-14 w-auto opacity-90"
          draggable="false"
        />
      </div>

      <!-- Card -->
      <div class="rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/10 p-8">
        <h1 class="text-white text-2xl font-semibold text-center">NeuroSharp Console</h1>
        <p class="text-white/60 text-sm text-center mt-1 mb-6">Sign in to continue</p>

        <div class="space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-sm text-white/80 mb-1">Username</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <!-- user icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5a7.5 7.5 0 0115 0" />
                </svg>
              </span>
              <input
                v-model="username"
                type="text"
                autocomplete="username"
                placeholder="administrator"
                class="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 text-white placeholder-white/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm text-white/80 mb-1">Password</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <!-- lock icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3" />
                  <rect x="5.25" y="10.5" width="13.5" height="9" rx="2" />
                </svg>
              </span>
              <input
                :type="showPwd ? 'text' : 'password'"
                v-model="password"
                autocomplete="current-password"
                placeholder="••••••••••••"
                class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 text-white placeholder-white/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button type="button" @click="showPwd = !showPwd" class="absolute inset-y-0 right-3 flex items-center text-white/60 hover:text-white transition">
                <!-- eye icon -->
                <svg v-if="!showPwd" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12Z" />
                  <circle cx="12" cy="12" r="3.75" />
                </svg>
                <!-- eye-off -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M6.45 6.6C3.9 8.4 2.25 12 2.25 12s3.75 7.5 9.75 7.5c2.07 0 3.9-.48 5.46-1.29M10.2 10.35A3.75 3.75 0 0015.6 15.8" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button
            :disabled="loading"
            @click="doLogin"
            class="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold bg-white text-gray-900 hover:bg-white/90 disabled:opacity-60 transition"
          >
            <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
              <path class="opacity-75" d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3"></path>
            </svg>
            <span>{{ loading ? 'Signing in…' : 'Sign in' }}</span>
          </button>

          <!-- Error -->
          <p v-if="error" class="text-sm text-red-300 text-center">{{ error }}</p>
        </div>
      </div>

      <!-- Tagline -->
      <p class="mt-5 text-center text-white/60 text-sm select-none">Powered by <span class="text-white">Quantum Core</span></p>
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

// optional build label (set VITE_BUILD in Railway if you want)
const buildLabel = import.meta.env.VITE_BUILD || ''

const API = import.meta.env.VITE_API_URL || ''  // must be set in Railway frontend

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
