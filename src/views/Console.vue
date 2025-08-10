<template>
  <div class="console">
    <header>
      <h1>NeuroSharp Console</h1>
      <div class="actions">
        <button @click="clear" :disabled="sending || messages.length===0">Clear</button>
        <button @click="logout">Logout</button>
      </div>
    </header>

    <section class="chat" ref="chatPane">
      <div v-if="messages.length === 0" class="empty">No messages yet.</div>
      <div v-for="(m,i) in messages" :key="i" class="msg" :class="m.role">
        <div class="bubble">{{ m.text }}</div>
      </div>
    </section>

    <form class="composer" @submit.prevent="send">
      <textarea v-model="text" rows="3" placeholder="Ask GPT…" :disabled="sending"></textarea>
      <button type="submit" :disabled="sending || !text.trim()">
        {{ sending ? 'Sending…' : 'Send' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { askGPT } from '../lib/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const messages = ref([])
const text = ref('')
const sending = ref(false)
const chatPane = ref(null)

function scrollToEnd () {
  nextTick(() => { chatPane.value?.scrollTo({ top: chatPane.value.scrollHeight, behavior: 'smooth' }) })
}

async function send () {
  const t = text.value.trim()
  if (!t || sending.value) return
  messages.value.push({ role: 'user', text: t })
  text.value = ''
  sending.value = true
  scrollToEnd()
  try {
    const reply = await askGPT(t)
    messages.value.push({ role: 'assistant', text: reply || '(empty response)' })
  } catch (e) {
    messages.value.push({ role: 'assistant', text: `Error: ${e.message || e}` })
  } finally {
    sending.value = false
    scrollToEnd()
  }
}

function clear () { messages.value = [] }
function logout () { localStorage.removeItem('token'); router.push('/login') }
</script>

<style scoped>
.console { max-width: 880px; margin: 2rem auto; padding: 1rem; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
header { display:flex; align-items:center; justify-content:space-between; margin-bottom: .75rem; }
.actions { display:flex; gap:.5rem; }
button { padding:.55rem .9rem; border:0; border-radius:10px; cursor:pointer; font-weight:600; background:#0d6efd; color:white; }
button[disabled] { opacity:.6; cursor:not-allowed; }
.actions button { background:#eee; color:#222; }
.chat { height: 52vh; overflow:auto; border:1px solid #e0e5ea; border-radius:12px; padding: .75rem; background:#fafbfc; }
.empty { color:#777; text-align:center; margin-top: 2rem; }
.msg { display:flex; margin:.4rem 0; }
.msg.user { justify-content:flex-end; }
.bubble { max-width: 75%; padding:.6rem .8rem; border-radius:12px; white-space:pre-wrap; }
.msg.user .bubble { background:#dbeafe; }
.msg.assistant .bubble { background:#f1f5f9; }
.composer { display:grid; grid-template-columns: 1fr auto; gap:.6rem; margin-top:.75rem; }
textarea { width:100%; padding:.6rem .75rem; border:1px solid #d0d7de; border-radius:10px; outline:none; resize:vertical; }
textarea:focus { border-color:#0969da; box-shadow:0 0 0 3px rgba(9,105,218,.15); }
</style>
