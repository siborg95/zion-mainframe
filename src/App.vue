<template>
  <div class="app">
    <!-- TOP BAR -->
    <header class="site-header">
      <div class="brand">
        <img class="logo" src="/neurosharp-logo.png" alt="NeuroSharp" />
        <div class="titles">
          <div class="title">NeuroSharp Console</div>
          <div class="subtitle">Cloud Interface</div>
        </div>
      </div>

      <div class="actions">
        <span class="status" :class="online ? 'ok' : 'bad'">
          <span class="dot"></span>
          {{ online ? 'API: Online' : 'API: Offline' }}
        </span>
        <router-link to="/console" class="btn ghost">Console</router-link>
        <button class="btn" @click="logout">Logout</button>
      </div>
    </header>

    <!-- CONTENT -->
    <main class="page">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </main>

    <!-- FOOTER -->
    <footer class="site-footer">
      <span>© NeuroSharp</span>
      <span class="sep">•</span>
      <span>{{ year }}</span>
    </footer>

    <!-- TOAST (errors/info) -->
    <div v-if="toast" class="toast" role="status" aria-live="polite">
      {{ toast }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const year = new Date().getFullYear()
const toast = ref('')

const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
function joinUrl(base, path) {
  return `${base || ''}/${path}`.replace(/([^:]\/)\/+/g, '$1')
}

const online = ref(true)
let timer = null

async function pingOnce () {
  // If API not set, assume same-origin and consider it online for UI purposes
  if (!API) { online.value = true; return }
  try {
    const res = await fetch(joinUrl(API, 'console/ping'), { method: 'GET' })
    online.value = res.ok
  } catch {
    online.value = false
  }
}

function startPinger () {
  stopPinger()
  pingOnce()
  timer = setInterval(pingOnce, 15000)
}
function stopPinger () {
  if (timer) { clearInterval(timer); timer = null }
}

function logout () {
  try {
    localStorage.removeItem('token')
    router.push('/')
  } catch (e) {
    toast.value = String(e?.message || e)
    setTimeout(() => (toast.value = ''), 4000)
  }
}

onMounted(startPinger)
onUnmounted(stopPinger)
</script>

<style>
/* LAYOUT */
html, body, #app, .app { height: 100%; margin: 0; }
body {
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
    Ubuntu, Cantarell, "Helvetica Neue", Arial;
  color: #0b0f1a;
  background: #f7f8fb;
}
.app { display: flex; flex-direction: column; }

/* HEADER */
.site-header {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 10px 14px; background: #ffffff; border-bottom: 1px solid #e5e7eb;
  position: sticky; top: 0; z-index: 100;
}
.brand { display: flex; align-items: center; gap: 10px; }
.logo { width: 36px; height: 36px; object-fit: contain; border-radius: 8px; }
.titles { display: flex; flex-direction: column; line-height: 1.05; }
.title { font-weight: 700; }
.subtitle { font-size: 12px; color: #6b7280; }

.actions { display: flex; align-items: center; gap: 8px; }
.status {
  display: inline-flex; align-items: center; gap: 6px; font-size: 12px; padding: 4px 8px;
  border-radius: 999px; border: 1px solid #e5e7eb; background: #fff;
}
.status .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.status.ok .dot { background: #10b981; }
.status.bad .dot { background: #ef4444; }

/* MAIN */
.page { flex: 1; padding: 16px; }

/* FOOTER */
.site-footer {
  display: flex; align-items: center; gap: 8px; justify-content: center;
  font-size: 12px; color: #6b7280; padding: 10px 0 16px;
}
.sep { opacity: .6; }

/* BUTTONS */
.btn {
  padding: 8px 12px; border: 0; border-radius: 10px; cursor: pointer; font-weight: 700;
  background: #2563eb; color: #fff;
}
.btn.ghost { background: #ffffff; color: #111827; border: 1px solid #e5e7eb; }
.btn:disabled { opacity: .6; cursor: default; }

/* TRANSITIONS */
.fade-enter-active, .fade-leave-active { transition: opacity .16s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* TOAST */
.toast {
  position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%);
  background: #111827; color: #fff; padding: 10px 14px; border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,.25); font-size: 14px; z-index: 200;
}
</style>
