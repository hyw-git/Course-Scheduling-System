<template>
  <div class="login-overlay">
    <div class="login-modal">
      <h3>登录</h3>
      <form @submit.prevent="submit">
        <label>账号</label>
        <input v-model="username" required />
        <label>密码</label>
        <input v-model="password" type="password" required />
        <div class="actions">
          <button type="submit" :disabled="loading">登录</button>
          <button type="button" @click="close" :disabled="loading">取消</button>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import auth from '../api/auth'

export default {
  name: 'LoginModal',
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      error: ''
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async submit() {
      this.error = ''
      this.loading = true
      try {
        await auth.login({ username: this.username, password: this.password })
        this.$emit('close')
      } catch (e) {
        this.error = e.message || '登录失败'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,25,56,0.45);z-index:999}
.login-modal{background:#ffffff;padding:24px;border-radius:10px;min-width:340px;box-shadow:0 8px 24px rgba(2,31,64,0.18);border-left:6px solid #1e88e5}
.login-modal h3{margin:0 0 12px 0;color:#0b66b2;font-weight:600}
.login-modal label{font-size:13px;color:#0b66b2;display:block;margin-top:8px}
.login-modal input{width:100%;padding:10px 12px;margin-top:6px;border:1px solid #d6e9fb;border-radius:6px;background:#f7fbff;outline:none;transition:box-shadow .15s,border-color .15s}
.login-modal input:focus{border-color:#1e88e5;box-shadow:0 0 0 4px rgba(30,136,229,0.12)}
.actions{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}
.actions button{padding:8px 14px;border-radius:6px;border:none;cursor:pointer;font-weight:600}
.actions button[type="submit"]{background:linear-gradient(180deg,#1e88e5,#1565c0);color:#fff;box-shadow:0 4px 12px rgba(30,136,229,0.24)}
.actions button[type="button"]{background:transparent;color:#0b66b2;border:1px solid rgba(11,102,178,0.12)}
.actions button:disabled{opacity:0.6;cursor:not-allowed}
.error{color:#d32f2f;margin-top:10px;font-size:13px}
</style>
