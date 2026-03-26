<template>
  <aside :class="['sidebar', { collapsed }]">
    <nav>
      <ul>
        <li>
          <router-link to="/" class="nav-item" :class="{ 'router-link-active': isActiveExact('/') }">
            <span class="icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" fill="currentColor"/></svg>
            </span>
            <span class="nav-label">总览</span>
          </router-link>
        </li>
        <li>
          <router-link to="/plans" class="nav-item" :class="{ 'router-link-active': isActive('/plans') }">
            <span class="icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18v2H3V6zm0 5h12v2H3v-2zm0 5h6v2H3v-2z" fill="currentColor"/></svg>
            </span>
            <span class="nav-label">排课方案</span>
          </router-link>
        </li>
        <li>
          <router-link to="/timetable" class="nav-item" :class="{ 'router-link-active': isActive('/timetable') }">
            <span class="icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10h5v5H7z" fill="currentColor"/><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" fill="currentColor"/></svg>
            </span>
            <span class="nav-label">课表</span>
          </router-link>
        </li>
        <li @mouseenter="showSubmenu('settings',$event)" @mouseleave="hideSubmenu">
          <router-link to="/settings" class="nav-item" :class="{ 'router-link-active': isActive('/settings') }">
            <span class="icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.14 12.936c.036-.3.056-.604.056-.936s-.02-.636-.056-.936l2.03-1.58a.5.5 0 0 0 .12-.64l-1.922-3.324a.5.5 0 0 0-.607-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.936l-.36-2.54A.5.5 0 0 0 13.5 2h-3a.5.5 0 0 0-.494.42l-.36 2.54c-.57.24-1.1.56-1.62.94l-2.39-.96a.5.5 0 0 0-.607.22L2.7 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.036.3-.056.604-.056.936s.02.636.056.936L2.82 15.66a.5.5 0 0 0-.12.64l1.922 3.323c.14.24.43.34.68.24l2.39-.96c.52.38 1.05.7 1.62.94l.36 2.54c.05.28.29.48.57.48h3c.28 0 .52-.2.57-.48l.36-2.54c.57-.24 1.1-.56 1.62-.94l2.39.96c.25.1.54 0 .68-.24l1.922-3.323a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" fill="currentColor"/></svg>
            </span>
            <span class="nav-label">设置</span>
          </router-link>

          <!-- submenu teleported to body to avoid being clipped by stacking contexts -->
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <button class="collapse-btn" @click="toggle" :aria-expanded="!collapsed">
        <span class="collapse-icon">
          <svg v-if="!collapsed" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z" fill="currentColor"/></svg>
        </span>
        <span class="collapse-label" v-if="!collapsed">收起</span>
      </button>
    </div>
  </aside>
  <teleport to="body">
    <div v-if="hoveredSubmenu === 'settings'" class="submenu" :style="submenuStyle" @mouseenter="showSubmenu('settings')" @mouseleave="hideSubmenu">
      <div class="sub-item" @click="navigateTo('/settings/rooms')">教室设置</div>
      <div class="sub-item" @click="navigateTo('/settings/teachers')">教师设置</div>
      <div class="sub-item" @click="navigateTo('/settings/courses')">课程设置</div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return { collapsed: false, hoveredSubmenu: null, submenuStyle: {}, closeTimer: null }
  },
  methods: {
    toggle() { this.collapsed = !this.collapsed },
    showSubmenu(name, ev) {
      // Cancel any pending close timer so submenu stays open when moving between elements
      if (this.closeTimer) { clearTimeout(this.closeTimer); this.closeTimer = null }
      this.hoveredSubmenu = name
      // 计算浮层在视口中的位置，使用 fixed 避免被其他 stacking context 覆盖
      this.$nextTick(() => {
        try {
          if (!ev) return
          const li = ev.currentTarget || ev.target
          const rect = li.getBoundingClientRect()
          const left = rect.right + 8
          const top = rect.top + rect.height / 2
          // 样式：固定定位，垂直居中（使用 translateY(-50%)）
          this.submenuStyle = {
            position: 'fixed',
            left: left + 'px',
            top: top + 'px',
            transform: 'translateY(-50%)',
            zIndex: 9999
          }
        } catch (e) {
          // Fallback: 清理样式
          this.submenuStyle = {}
        }
      })
    },
    hideSubmenu() {
      // Delay hiding to allow mouse to reach teleported submenu
      if (this.closeTimer) clearTimeout(this.closeTimer)
      this.closeTimer = setTimeout(() => {
        this.hoveredSubmenu = null
        this.submenuStyle = {}
        this.closeTimer = null
      }, 180)
    },
    navigateTo(path) { this.$router.push(path); this.hoveredSubmenu = null; this.submenuStyle = {}; if (this.closeTimer) { clearTimeout(this.closeTimer); this.closeTimer = null } }
    ,
    isActive(prefix) {
      try { return this.$route && this.$route.path && this.$route.path.startsWith(prefix) }
      catch (e) { return false }
    },
    isActiveExact(path) {
      try { return this.$route && this.$route.path === path }
      catch (e) { return false }
    }
  }
}
</script>

<style scoped>
.sidebar{background:var(--surface);width:220px;display:flex;flex-direction:column;transition:width .18s;overflow:hidden;border-right:1px solid rgba(15,23,42,0.04)}
.sidebar.collapsed{width:72px}
.sidebar nav{padding:8px}
.sidebar ul{list-style:none;padding:0;margin:6px 0;display:flex;flex-direction:column;gap:6px}
.sidebar nav ul li{position:relative}
.nav-item{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;color:var(--muted);transition:all .12s;width:100%;box-sizing:border-box;min-height:40px}
.nav-item{align-items:center}
.nav-item .icon{flex:0 0 20px;height:20px;display:inline-flex;align-items:center;justify-content:center;color:var(--primary-600);line-height:0}
.nav-item .icon svg{display:block;width:20px;height:20px}
.nav-item:hover{color:var(--primary-600);background:var(--bg-50)}
.nav-item.router-link-active{background:var(--primary-600);color:var(--surface)}
.nav-item.router-link-active .icon{color:var(--surface)}
.nav-label{white-space:nowrap;line-height:20px;display:inline-block}
.sidebar.collapsed .nav-item{justify-content:center;padding:6px 0;box-sizing:border-box}

/* When collapsed, remove nav horizontal padding so active background can span full width */
.sidebar.collapsed nav{padding-left:0;padding-right:0}
.sidebar.collapsed ul{margin-left:0;margin-right:0}
.sidebar.collapsed .nav-item{width:100%;padding-left:0;padding-right:0;border-radius:0}
.sidebar.collapsed .nav-item.router-link-active{border-radius:0}
.sidebar.collapsed .nav-label{display:none}

/* Ensure active background spans full collapsed width */
.sidebar.collapsed .nav-item.router-link-active{display:flex;justify-content:center;padding:6px 0;border-radius:8px;background:var(--primary-600);color:var(--surface);width:100%}
.sidebar.collapsed .nav-item.router-link-active .icon{color:var(--surface);margin:0}

/* Hide icons when sidebar is expanded to show labels only */
.sidebar:not(.collapsed) .icon{display:none}
.sidebar:not(.collapsed) .nav-item{gap:0;padding-left:16px}
.sidebar:not(.collapsed) .nav-label{display:inline-block}
.sidebar.collapsed .nav-item{gap:12px}
/* Ensure icon itself is perfectly centered when collapsed */
.sidebar.collapsed .nav-item .icon{margin:0;display:inline-flex;justify-content:center}
.sidebar.collapsed .nav-item .icon svg{margin:0}

/* Submenu shown on hovering settings */
.submenu{position:absolute;left:100%;top:50%;transform:translateY(-50%);margin-left:8px;min-width:180px;background:var(--surface);border:1px solid rgba(15,23,42,0.04);box-shadow:0 8px 20px rgba(2,31,64,0.08);border-radius:8px;padding:6px;z-index:1200}
.submenu .sub-item{padding:8px 10px;border-radius:6px;cursor:pointer;color:var(--muted);font-weight:600}
.submenu .sub-item:hover{background:var(--bg-50);color:var(--primary-600)}

/* If sidebar is collapsed, show submenu slightly inset to align visually */
.sidebar.collapsed li .submenu{left:72px;margin-left:6px}

.sidebar-footer{margin-top:auto;padding:12px;display:flex;justify-content:center}
.collapse-btn{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;border:none;background:transparent;color:var(--primary-600);cursor:pointer}
.collapse-btn .collapse-icon{display:inline-flex;align-items:center}
.collapse-label{font-size:13px;color:var(--primary-600)}
</style>
