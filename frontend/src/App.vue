<template>
  <div class="app-root">
    <TopBar project-name="课程排课系统" @open-login="showLogin = true" />
    <div class="layout">
      <Sidebar />
      <main class="main-content">
        <router-view />
      </main>
    </div>

    <div v-if="showAuthPrompt" class="auth-prompt">
      <span>访问该页面需要先登录。</span>
      <div class="prompt-actions">
        <button class="btn" @click="showLogin = true">登录</button>
        <button class="btn" @click="cancelAuthPrompt">取消</button>
      </div>
    </div>

    <LoginModal v-if="showLogin" @close="showLogin = false" />
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import Sidebar from './components/Sidebar.vue'
import LoginModal from './components/LoginModal.vue'
import auth from './api/auth'

export default {
  name: 'App',
  components: { TopBar, Sidebar, LoginModal },
  data() {
    return { showLogin: false, auth, showAuthPrompt: false }
  },
  mounted() {
    // Show a non-modal prompt when redirected after attempting to access protected route
    if (this.$route && this.$route.query && this.$route.query.attempted && !this.auth.isAuthenticated.value) {
      this.showAuthPrompt = true
    }
  },
  watch: {
    '$route.query.attempted'(val) {
      this.showAuthPrompt = !!(val && !this.auth.isAuthenticated.value)
    }
  },
  methods: {
    cancelAuthPrompt() {
      // Remove attempted query param
      const q = { ...this.$route.query }
      delete q.attempted
      this.$router.replace({ path: this.$route.path, query: q })
      this.showAuthPrompt = false
    }
  }
}
</script>

<style scoped>
.auth-prompt{position:fixed;left:50%;transform:translateX(-50%);bottom:20px;background:#fff;border:1px solid #ddd;padding:12px 16px;border-radius:6px;display:flex;align-items:center;gap:12px;z-index:1000}
.prompt-actions .btn{margin-left:8px}
</style>
