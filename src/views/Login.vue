
<template>
  <div style="padding: 20px;">
    <h2>Login to NeuroSharp</h2>
    <input v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="login">Login</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

function login() {
  if (email.value && password.value) {
    localStorage.setItem('userEmail', email.value)
    router.push('/console')
  } else {
    alert('Please enter both fields')
  }
}
</script>
