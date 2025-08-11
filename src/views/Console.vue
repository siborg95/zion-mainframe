<template>
  <div class="shell">
    <!-- Top bar -->
    <header class="bar">
      <div class="left">
        <span class="label">API:</span>
        <span class="api">{{ apiLabel }}</span>
      </div>
      <div class="right">
        <button class="btn" @click="logout" :disabled="sending">Logout</button>
      </div>
    </header>

    <!-- Logo (kept small under the bar; remove if you don't want it) -->
    <img class="logo" src="/neurosharp-logo.png" alt="NeuroSharp" draggable="false" />

    <main class="log" ref="logPane">
      <div v-if="messages.length===0" class="empty">
        [Console ready] Type <code>/help</code> to see commands.
      </div>
      <div v-else>
        <div v-for="(m,i) in messages" :key="i" class="row" :class="m.role">
          <span class="time">[{{ m.time }}]</span>
          <span class="who">{{ m.role === 'user' ? 'You' : 'Oracle' }}:</span>
          <span class="text">{{ m.text }}</span>
        </div>
      </div>
    </main>

    <footer class="inputbar">
      <input
        class="input"
        v-model="draft"
        placeholder="Type a command… (/help)"
        :disabled="sending"
        @keyup.enter="send"
        autocomplete="off"
      />
      <button class="btn primary" :disabled="!draft || sending" @click="send">
        {{ sending ? 'Sending…' : 'Send' }}
      </button>
      <button class="btn subtle" :disabled="messages.length===0 || sending" @click="clear">
        Clear
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
const apiLabel = computed(() => API || 'same-origin')

const token = localStorage.getItem('token') || ''
if (!token) router.replace('/login')

const messages = ref([])
const draft = ref('')
const sending = ref(false)
const logPane = ref(null)

function joinUrl (base, path) {
  return `${base || ''}/${path}`.replace(/([^:]\/)\/+/g, '$1')
}

function now () {
  const d = new Date()
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function scrollToBottom () {
  nextTick(() => { if (logPane.value) logPane.value.scrollTop = logPane.value.scrollHeight })
}

function clear () {
  messages.value = []
  scrollToBottom()
}

function logout () {
  localStorage.removeItem('token')
  router.replace('/login')
}

async function fetchHistory () {
  try {
    const url = joinUrl(API, 'console/history')
    const res = await fetch(url, {
      headers: { Authorization: token ? `Bearer ${token}` : undefined }
    })
    const raw = await res.text()
    let data = null
    try { data = raw ? JSON.parse(raw) : null } catch {}
    if (Array.isArray(data?.items)) messages.value = data.items
  } catch { /* ignore */ }
  scrollToBottom()
}

async function send () {
  const text = draft.value.trim()
  if (!text) return

  messages.value.push({ role: 'user', text, time: now() })
  draft.value = ''
  sending.value = true
  scrollToBottom()

  try {
    const url = joinUrl(API, 'console')
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined
      },
      body: JSON.stringify({ message: text })
    })

    const raw = await res.text()
    let data = null
    try { data = raw ? JSON.parse(raw) : null } catch {}

    let reply =
      (data && typeof data.reply === 'string' && data.reply) ||
      (raw && raw.trim()) ||
      (data && data.error) ||
      ''

    if (!res.ok || !reply) {
      reply = `No reply from server (HTTP ${res.status}${raw?.trim() ? `: ${raw.trim().slice(0, 200)}` : ''})`
    }

    messages.value.push({ role: 'assistant', text: reply, time: now() })
  } catch (e) {
    messages.value.push({ role: 'assistant', text: String(e?.message || e), time: now() })
  } finally {
    sending.value = false
    scrollToBottom()
  }
}

onMounted(fetchHistory)
</script>

<style scoped>
.shell {
  display:flex; flex-direction:column;
  height: calc(100vh - 40px);
  max-width: 900px; margin: 20px auto;
  padding: 0 10px; box-sizing: border-box;
}

/* Top bar */
.bar { display:flex; align-items:center; justify-content:space-between; padding:8px 2px; }
.left { display:flex; gap:8px; align-items:center; }
.label { color:#6b7280; font-weight:600; }
.api { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; color:#111827; }
.right .btn { background:#f3f4f6; color:#111827; border:0; border-radius:10px; padding:8px 12px; cursor:pointer; }
.right .btn:disabled { opacity:.6; cursor:default; }

/* Logo under the bar */
.logo { width: 200px; max-width: 90%; height:auto; display:block; margin: 0 auto 10px; user-select:none; }

.log {
  flex:1; overflow:auto;
  background:#0b0f1a; color:#e5e7eb;
  padding:10px 12px; border-radius:10px;
}
.row { display:block; margin:6px 0; line-height:1.35; }
.row .time { color:#9ca3af; margin-right:8px; }
.row .who { color:#93c5fd; margin-right:6px; font-weight:600; }
.row.user .who { color:#34d399; }
.row .text { white-space: pre-wrap; word-break: break-word; }
.empty { color:#9ca3af; }
.inputbar { display:flex; gap:8px; padding:10px 0; }
.input {
  flex:1; padding:10px 12px; border-radius:10px;
  border:1px solid #d1d5db; outline:none;
}
.btn { padding:10px 12px; border:0; border-radius:10px; cursor:pointer; }
.btn.primary { background:#2563eb; color:#fff; font-weight:700; }
.btn.subtle { background:#eef2ff; color:#111827; }
.btn:disabled { opacity:.6; cursor:default; }
code { background: rgba(255,255,255,.08); padding: 1px 6px; border-radius: 6px; }
</style>
