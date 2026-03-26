import { ref, computed } from 'vue'

const token = ref(localStorage.getItem('auth_token') || null)
const user = ref(null)

const isAuthenticated = computed(() => !!token.value)

async function login({ username, password }) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: '登录失败' }))
    throw new Error(err.message || 'Login failed')
  }

  const data = await res.json()
  // Expect backend to return a token and optionally user info
  if (data.token) {
    token.value = data.token
    localStorage.setItem('auth_token', data.token)
  }
  if (data.user) user.value = data.user
  return data
}

function logout() {
  token.value = null
  user.value = null
  localStorage.removeItem('auth_token')
}

export default {
  token,
  user,
  isAuthenticated,
  login,
  logout
}
