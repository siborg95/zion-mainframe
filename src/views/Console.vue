<template>
  <div class="console">
    <h1>Console</h1>
    <div class="tag">Build: v1</div>

    <div class="statusline">
      <strong>Health:</strong> {{ health }}
    </div>

    <div class="gpt-box">
      <textarea v-model="prompt" placeholder="Ask GPT…" rows="4"></textarea>
      <div class="row">
        <button @click="send" :disabled="loading || !prompt.trim()">
          {{ loading ? 'Sending…' : 'Send' }}
        </button>
        <button @click="sendHello" :disabled="loading">Test “Hello”</button>
      </div>
    </div>

    <pre class="reply" v-if="reply">{{ reply }}</pre>

    <div class="debug">
      <div><strong>Status:</strong> {{ lastStatus ?? '—' }}</div>
      <div class="url"><strong>URL:</strong> {{ lastURL || '—' }}</div>
      <div><strong>Error:</strong> {{ lastError || '—' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { API } from '../lib/api'

const prompt = ref('')
const reply = ref('')
const loading = ref(false)
const lastStatus = ref(null)
const lastURL = ref('')
const lastError = ref('')
const health = ref('checking…')

onMounted(async () => {
  try {
    const r = await fetch(`${API}/health`)
    health.value = r.ok ? 'ok' : `bad (${r.status})`
  } catch (e) {
    health.value = 'offline'
  }
})

async function callGPT(text) {
  loading.value = true
  reply.value = ''
  lastError.value = ''
  lastStatus.value = null
  lastURL.value = `${API}/gpt`

  try {
    const res = await fetch(lastURL.value, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text })
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

function send () { callGPT(prompt.value) }
function sendHello () { callGPT('Say hello from Zion.') }
</script>

<style scoped>
.console { max-width: 720px; margin: 2.5rem auto; padding: 1.25rem; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
.tag { display:inline-block; font-size:.8rem; color:#555; background:#f1f1f1; padding:.2rem .5rem; border-radius:6px; margin-bottom:.5rem; }
.statusline { margin:.5rem 0 1rem; }
.gpt-box { display: grid; gap: .75rem; }
.row { display:flex; gap:.5rem; }
textarea { width: 100%; padding: .6rem .75rem; border: 1px solid #d0d7de; border-radius: 8px; outline: none; }
textarea:focus { border-color: #0969da; box-shadow: 0 0 0 3px rgba(9,105,218,.15); }
button { padding: .6rem 1rem; border: 0; border-radius: 8px; cursor: pointer; font-weight: 600; }
.reply { margin-top: 1rem; background: #f6f8fa; padding: .75rem; border-radius: 8px; white-space: pre-wrap; }
.debug { margin-top: 1rem; font-size: .9rem; color: #444; }
.debug .url { word-break: break-all; }
</style>
