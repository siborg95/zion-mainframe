<template>
  <div class="console">
    <h1>Console</h1>

    <div class="gpt-box">
      <textarea v-model="prompt" placeholder="Ask GPT…" rows="4"></textarea>
      <button @click="send" :disabled="loading || !prompt.trim()">
        {{ loading ? 'Sending…' : 'Send' }}
      </button>
    </div>

    <pre v-if="reply" class="reply">{{ reply }}</pre>

    <button class="logout" @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { askGPT } from '../lib/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const prompt = ref('')
const reply = ref('')
const loading = ref(false)

async function send () {
  loading.value = true
  reply.value = ''
  try {
    reply.value = await askGPT(prompt.value)
  } catch (e) {
    reply.value = `Error: ${e.message || e}`
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
.logout { margin-top: 1rem; background: #eee; }
</style>
