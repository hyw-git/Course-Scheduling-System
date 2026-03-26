<template>
  <header class="topbar">
    <div class="left">{{ projectName }}</div>
    <div class="right">
      <template v-if="!isAuthenticated">
        <button class="btn login" @click="openLogin">登录</button>
      </template>
      <template v-else>
        <div class="account">
          <span class="username">{{ displayName }}</span>
          <button class="btn" @click="logout">退出账号</button>
          <button class="btn" @click="switchAccount">切换账号</button>
        </div>
      </template>
    </div>
  </header>
</template>

<script>
import auth from '../api/auth'

export default {
  name: 'TopBar',
  emits: ['open-login'],
  props: {
    projectName: { type: String, default: '项目名称' }
  },
  computed: {
    auth() { return auth },
    isAuthenticated() {
      return !!auth.isAuthenticated?.value
    },
    displayName() {
      const u = auth.user && auth.user.value ? auth.user.value : null
      return (u && (u.name || u.username)) || '已登录'
    }
  },
  methods: {
    openLogin() { this.$emit('open-login') },
    logout() { auth.logout() },
    switchAccount() { auth.logout(); this.$emit('open-login') }
  }
}
</script>

<style scoped>
.topbar{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:linear-gradient(90deg,var(--surface),#f8fbff);border-bottom:1px solid rgba(30,136,229,0.06)}
.left{font-weight:600;color:var(--primary-600)}
.right .btn{margin-left:8px}
.account{display:flex;align-items:center;gap:8px}
.username{font-size:14px;color:var(--muted)}
</style>
