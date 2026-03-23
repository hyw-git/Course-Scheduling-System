<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <li><router-link to="/" class="nav-item">总览</router-link></li>
        <li><router-link to="/plans" class="nav-item">排课方案</router-link></li>
        <li><router-link to="/timetable" class="nav-item">课表</router-link></li>
        <li><router-link to="/settings" class="nav-item">设置</router-link></li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>
