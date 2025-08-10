<template>
  <div class="console">
    <h1>Console</h1>

    <div class="gpt-box">
      <textarea v-model="prompt" placeholder="Ask GPT…" rows="4"></textarea>
      <button @click="send" :disabled="loading || !prompt.trim()">
        {{ loading ? 'Sending…' : 'Send' }}
      </button>
    </div>

    <pre class="reply" v-if="reply">{{ reply }}</pre>

    <div class="debug">
      <div><strong>Status:</strong> {{ lastStatus ?? '—' }}</div>
      <div class="url"><strong>URL:</strong> {{ lastURL || '—' }}</div>
      <div><strong>Error:</strong> {{ lastError || '—' }}</div>
    </div>

    <button class="logout" @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API } from '../lib/api'

const router = useRouter()
const prompt = ref('')
const reply = ref('')
const loading = ref(false)
const lastStatus = ref(null)
const lastURL = ref('')
const lastError = ref('')

async function send () {
  loading.value = true
  reply.value = ''
  lastError.value = ''
  lastStatus.value = null
  lastURL.value = `${API}/gpt`

  try {
    const res = await fetch(lastURL.value, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt.value })
    })

    lastStatus.value = res.status
    const data = await res.json().catch(() => ({}))

    if (res.ok && data && data.ok) {
      reply.value = data.text || '(empty response)'
    } else {
      reply.value = `Error [${res.status}]: ${data?.error || 'Unknown error'}`
      lastError.value = data?.error || `HTTP ${res.status}`
    }
  } catch (e) {
    lastError.value = e?.message || String(e)
    reply.value = `Network error: ${lastError.value}`
    lastStatus.value = '(failed)'
  } finally {
    loading.value = false
  }
}

function logout () {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.console { max-width: 720px; margin: 2.5rem auto; padding: 1.25rem; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
.gpt-box { display: grid; gap: .75rem; }
textarea { width: 100%; padding: .6rem .75rem; border: 1px solid #d0d7de; border-radius: 8px; outline: none; }
textarea:focus { border-color: #0969da; box-shadow: 0 0 0 3px rgba(9,105,218,.15); }
button { padding: .6rem 1rem; border: 0; border-radius: 8px; cursor: pointer; font-weight: 600; }
.reply { margin-top: 1rem; background: #f6f8fa; padding: .75rem; border-radius: 8px; white-space: pre-wrap; }
.debug { margin-top: 1rem; font-size: .9rem; color: #444; }
.debug .url { word-break: break-all; }
.logout { margin-top: 1rem; background: #eee; }
</style>
