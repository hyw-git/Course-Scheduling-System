// API helper for plans (排课方案)
// Replace base URL or integrate with your existing HTTP client as needed.

const base = '/api/plans'

async function fetchJSON(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export default {
  // 获取所有方案（包括草稿）
  async fetchPlans() {
    // 返回示例数据以便前端开发时使用
    try {
      // 若后端就绪，取消下面示例并使用：
      // return await fetchJSON(base)
      return [
        { id: 'p-1', title: '第一学期方案', status: '已保存', createdAt: '2026-03-01' },
        { id: 'p-2', title: '实验班草稿', status: '草稿', createdAt: '2026-03-12' }
      ]
    } catch (e) {
      console.error('fetchPlans error', e)
      return []
    }
  },

  // 获取单个方案详情
  async getPlan(id) {
    return fetchJSON(`${base}/${encodeURIComponent(id)}`)
  },

  // 创建新方案
  async createPlan(payload) {
    return fetchJSON(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  },

  // 更新方案
  async updatePlan(id, payload) {
    return fetchJSON(`${base}/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  }
  ,

  // 保存草稿（创建或更新）
  async saveDraft(payload) {
    if (payload && payload.id) {
      return this.updatePlan(payload.id, payload)
    }
    return this.createPlan(payload)
  },

  // 提交给排课设计算法（触发生成/预览）
  async submitForGeneration(id, payload) {
    // POST /api/plans/:id/generate
    return fetchJSON(`${base}/${encodeURIComponent(id)}/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  }
}
