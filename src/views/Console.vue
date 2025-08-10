<template>
  <div class="shell">
    <header class="site-header">
      <div class="title">Welcome to NeuroSharp Console</div>
      <div class="actions">
        <button class="btn ghost" @click="clear" :disabled="messages.length===0 || sending">Clear</button>
        <button class="btn ghost" @click="logout">Logout</button>
      </div>
    </header>

    <main class="main">
      <!-- LEFT: Console -->
      <section class="console">
        <div class="log" ref="logPane">
          <div v-if="messages.length===0" class="empty">No messages yet.</div>

          <template v-else>
            <div v-for="(m, i) in messages" :key="i" class="row" :class="m.role">
              <span class="time">[{{ m.time }}]</span>
              <span class="who" v-if="m.role==='user'">You:</span>
              <span class="who" v-else-if="m.role==='assistant'">Oracle:</span>
              <span class="who" v-else>System:</span>
              <span class="text">{{ m.text }}</span>
            </div>
          </template>
        </div>

        <!-- Single-line composer: Enter sends -->
        <form class="composer" @submit.prevent="send">
          <input
            v-model="text"
            class="input"
            type="text"
            placeholder="Ask Oracle…"
            aria-label="Ask Oracle"
            :disabled="sending"
            autocomplete="off"
            spellcheck="false"
            inputmode="text"
            @keydown.enter.exact.prevent="send"
          />
          <button class="btn primary" type="submit" :disabled="sending || !text.trim()">
            {{ sending ? 'Sending…' : 'Send' }}
          </button>
        </form>
      </section>

      <!-- RIGHT: Sidebar actions -->
      <aside class="sidebar">
        <button class="btn block" @click="addSystem('Starting drill…')">📘 Start Drill</button>
        <button class="btn block" @click="refreshLog">🔁 Refresh Log</button>
        <button class="btn block" @click="addSystem('Loading profile…')">🧠 Load Profile</button>
        <button class="btn block" @click="addSystem('Displaying metrics…')">📊 Show Metrics</button>
        <button class="btn block" @click="health">🩺 Backend Health</button>
        <button class="btn block danger" @click="logout">🔒 Logout</button>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { askGPT } from '../lib/api'

const router = useRouter()
const messages = ref([])
const text = ref('')
const sending = ref(false)
const logPane = ref(null)

const API = import.meta.env.VITE_API_URL || ''

const now = () => new Date().toLocaleTimeString()

const scrollToEnd = () => {
  nextTick(() => {
    const el = logPane.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

function addSystem(msg) {
  messages.value.push({ role: 'system', text: msg, time: now() })
  scrollToEnd()
}
function refreshLog() {
  messages.value.push({ role: 'system', text: 'Log refreshed.', time: now() })
  scrollToEnd()
}
async function health() {
  try {
    const r = await fetch(`${API}/health`)
    const ok = r.ok ? 'ok' : `HTTP ${r.status}`
    messages.value.push({ role: 'system', text: `Health: ${ok}`, time: now() })
  } catch (e) {
    messages.value.push({ role: 'system', text: `Health error: ${e.message || e}`, time: now() })
  } finally {
    scrollToEnd()
  }
}

async function send () {
  const t = text.value.trim()
  if (!t || sending.value) return
  messages.value.push({ role: 'user', text: t, time: now() })
  text.value = ''
  sending.value = true
  scrollToEnd()
  try {
    const reply = await askGPT(t)
    messages.value.push({ role: 'assistant', text: reply || '(empty response)', time: now() })
  } catch (e) {
    messages.value.push({ role: 'assistant', text: `Error: ${e.message || e}`, time: now() })
  } finally {
    sending.value = false
    scrollToEnd()
  }
}

function clear () { messages.value = [] }
function logout () { localStorage.removeItem('token'); router.push('/login') }
</script>

<style scoped>
/* Fill the viewport; prevent page-level scrolling */
.shell {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
  color: #111;
  overflow: hidden;
}

/* Fixed-height header */
.site-header {
  flex: 0 0 56px;
  height: 56px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.title { font-size: 20px; font-weight: 700; }
.actions { display: flex; gap: 8px; }

/* Main area fills the rest of the viewport */
.main {
  flex: 1 1 auto;
  min-height: 0;            /* allow children to size/scroll */
  display: flex;
  gap: 18px;
  padding: 16px;
  overflow: hidden;         /* no page scroll */
}

/* Left: console column with its own layout */
.console {
  flex: 3 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;            /* important for flex children */
}

/* Log takes all leftover height and scrolls */
.log {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px;
}
.empty {
  text-align: center;
  color: #6b7280;
  padding: 24px 0;
}
.row {
  font-size: 14px;
  line-height: 1.45;
  padding: 6px 4px;
  border-bottom: 1px dashed #f1f5f9;
}
.row:last-child { border-bottom: 0; }
.row.user .who { color: #2563eb; font-weight: 600; }
.row.assistant .who { color: #0ea5e9; font-weight: 600; }
.time { color: #9ca3af; margin-right: 6px; }
.who { margin-right: 6px; }
.text { white-space: pre-wrap; }

/* Composer stays visible at bottom */
.composer {
  flex: 0 0 auto;
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.input {
  flex: 1;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  color: #111827;
  outline: none;
  transition: border .15s, box-shadow .15s, background .15s;
  min-width: 0;
}
.input::placeholder { color: #6b7280; }
.input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,.15);
  background: #fff;
}

/* Right: sidebar */
.sidebar {
  flex: 1 1 0;
  min-width: 220px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

/* Buttons */
.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #111827;
  font-weight: 600;
  cursor: pointer;
  transition: transform .05s ease, box-shadow .15s ease, filter .15s ease, opacity .15s ease;
}
.btn:hover { box-shadow: 0 6px 14px rgba(0,0,0,0.08); }
.btn:active { transform: translateY(1px); }
.btn:disabled { opacity: .6; cursor: default; }
.btn.block { width: 100%; text-align: left; }
.btn.primary { border-color: #2563eb; background: #2563eb; color: #fff; }
.btn.primary:hover { box-shadow: 0 8px 18px rgba(37,99,235,.25); }
.btn.ghost { background: #fff; color: #111827; }
.btn.danger { border-color: #ef4444; color: #ef4444; }
.btn.danger:hover { box-shadow: 0 8px 18px rgba(239,68,68,.2); }

/* Mobile: stack sidebar under console */
@media (max-width: 900px) {
  .main { flex-direction: column; }
  .sidebar { min-width: 0; }
}
</style>
