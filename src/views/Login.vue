<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <!-- Logo -->
    <img
      class="h-14 w-auto mb-6 opacity-90"
      src="/neurosharp-logo.png"
      alt="NeuroSharp"
      draggable="false"
    />

    <!-- Card -->
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">Login (SPA)</h1>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
            placeholder="administrator"
            autocomplete="username"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
            placeholder="••••••••••••"
            autocomplete="current-password"
          />
        </div>

        <button
          :disabled="loading"
          @click="doLogin"
          class="w-full rounded-xl px-4 py-2 font-semibold bg-gray-900 text-white hover:bg-black disabled:opacity-60">
          {{ loading ? 'Logging in…' : 'Login' }}
        </button>

        <p v-if="error" class="text-sm text-red-600 text-center">{{ error }}</p>
      </div>
    </div>

    <!-- Footer tagline -->
    <p class="mt-4 text-sm text-gray-500 select-none">Powered by <span class="font-semibold">Quantum Core</span></p>
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

const API = import.meta.env.VITE_API_URL || ''

async function doLogin () {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API}/auth/login`, {
      method:
