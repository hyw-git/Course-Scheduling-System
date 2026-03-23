<template>
  <div class="app-root">
    <TopBar project-name="课程排课系统" />
    <div class="layout">
      <Sidebar />
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: { TopBar, Sidebar }
}
</script>
