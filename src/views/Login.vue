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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })
    const data = await res.json()
    if (!res.ok || !data?.ok) throw new Error(data?.error || `HTTP ${res.status}`)
    localStorage.setItem('token', data.token)
    router.push('/console')
  } catch (e) {
    error.value = String(e.message || e)
  } finally {
    loading.value = false
  }
}
</script>
