<template>
  <section class="card page plans-page">
    <div class="plans-header">
      <h3>排课方案</h3>
      <div class="actions">
        <button class="btn btn-primary" @click="createNew">新建方案</button>
      </div>
    </div>

    <div class="plans-container">
      <aside class="plans-list">
        <div v-if="loading" class="muted">加载中…</div>
        <div v-else>
          <div
            v-for="p in plans"
            :key="p.id"
            :class="['plan-item', { active: p.id === selectedId } ]"
            @click="selectPlan(p.id)">
            <div class="plan-title">{{ p.title || '未命名方案' }}</div>
            <div class="plan-meta">{{ p.status || '草稿' }}</div>
          </div>
          <div v-if="plans.length === 0" class="muted">暂无已保存的方案</div>
        </div>
      </aside>

      <section class="plan-detail">
        <template v-if="selected">
          <h4>{{ selected.title || '未命名方案' }}</h4>
          <p class="muted">状态：{{ selected.status || '草稿' }}</p>
          <p class="muted">创建：{{ selected.createdAt || '-' }}</p>
          <div class="preview">（方案预览占位）</div>
          <div class="detail-actions">
            <button class="btn btn-primary" @click="openEditor(selected.id)">打开编辑</button>
          </div>
        </template>
        <template v-else>
          <div class="muted">请选择左侧方案以查看详情或创建新方案。</div>
        </template>
      </section>
    </div>
  </section>
</template>

<script>
import api from '../api/plans'

export default {
  name: 'Plans',
  data() {
    return {
      plans: [],
      loading: false,
      selectedId: null
    }
  },
  computed: {
    selected() {
      return this.plans.find(p => p.id === this.selectedId) || null
    }
  },
  created() {
    this.loadPlans()
  },
  methods: {
    async loadPlans() {
      this.loading = true
      try {
        this.plans = await api.fetchPlans()
        if (this.plans.length) this.selectedId = this.plans[0].id
      } catch (e) {
        console.error('loadPlans', e)
      } finally {
        this.loading = false
      }
    },
    selectPlan(id) { this.selectedId = id },
    createNew() {
      // 跳转到新建方案页面（路由需在项目中实现）
      this.$router.push('/plans/new')
    },
    openEditor(id) {
      this.$router.push(`/plans/${id}/edit`)
    }
  }
}
</script>

<style scoped>
.plans-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.plans-header h3{margin:0;color:var(--primary-600);font-size:18px}
.plans-container{display:flex;gap:16px}
.plans-list{width:280px;border-right:1px solid rgba(15,23,42,0.04);padding:8px}
.plan-item{padding:12px;border-radius:8px;cursor:pointer;display:flex;flex-direction:column;gap:6px}
.plan-item .plan-title{font-weight:600;color:#0f172a}
.plan-item .plan-meta{font-size:12px;color:var(--muted)}
.plan-item:hover{background:var(--bg-50)}
.plan-item.active{background:var(--primary-600);color:var(--surface)}
.plan-item.active .plan-title,.plan-item.active .plan-meta{color:var(--surface)}
.plan-detail{flex:1;padding:12px}
.plan-detail h4{margin:0 0 8px 0;color:var(--primary-600)}
.plan-detail .muted{color:var(--muted)}
.preview{margin-top:12px;padding:18px;border-radius:8px;background:var(--bg-50);min-height:140px}
.detail-actions{margin-top:12px}
.btn-primary{font-size:14px}
.muted{color:var(--muted)}
</style>
