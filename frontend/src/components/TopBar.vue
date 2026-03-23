<template>
  <header class="topbar">
    <div class="left">{{ projectName }}</div>
    <div class="right">
      <button class="btn login">登录</button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TopBar',
  props: {
    projectName: { type: String, default: '项目名称' }
  }
}
</script>
