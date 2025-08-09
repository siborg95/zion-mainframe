
<template>
  <div style="padding: 20px;">
    <h2>Console View</h2>
    <div class="log" v-html="logs.join('<br>')" style="border:1px solid #ccc; padding:10px; margin-bottom:10px;"></div>
    <input v-model="entry" placeholder="Type something..." />
    <button @click="submitLog">Submit</button>
    <div class="buttons" style="margin-top: 10px;">
      <button @click="addLog('Starting drill...')">📘 Start Drill</button>
      <button @click="clearLog">🔁 Refresh Log</button>
      <button @click="addLog('Loading profile...')">🧠 Load Profile</button>
      <button @click="addLog('Displaying metrics...')">📊 Show Metrics</button>
      <button @click="logout">🔒 Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const logs = ref(['[Console ready]'])
const entry = ref('')

function addLog(text) {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.push(`[${timestamp}] ${text}`)
}

function submitLog() {
  if (entry.value.trim()) {
    addLog(entry.value)
    entry.value = ''
  }
}

function clearLog() {
  logs.value = ['[Console ready]']
}

function logout() {
  localStorage.removeItem('userEmail')
  router.push('/login')
}
</script>
