<template>
  <section class="card page new-plan">
    <div class="wizard-header">
      <div class="steps">
        <div v-for="(s, i) in steps" :key="s.key" :class="['step', { active: i === currentStep, completed: completed[i] }]">
          <div class="index">{{ i+1 }}</div>
          <div class="label">{{ s.label }}</div>
        </div>
      </div>
      <div class="wizard-actions">
        <button class="btn btn-ghost" @click="prev" :disabled="currentStep===0">上一步</button>
        <button class="btn btn-primary" @click="next" :disabled="saving">下一步</button>
      </div>
    </div>

    <div class="wizard-body">
      <section v-show="currentStep===0" class="step-pane">
        <h4>基本信息</h4>
        <label>方案名称</label>
        <input v-model="form.title" class="input" placeholder="输入方案名称" required />
        <label>状态</label>
        <select v-model="form.status" class="input">
          <option value="draft">草稿</option>
          <option value="saved">已保存</option>
        </select>
        <label>说明（可选）</label>
        <textarea v-model="form.note" class="input" rows="3" placeholder="添加说明"></textarea>
      </section>

      <section v-show="currentStep===1" class="step-pane">
        <h4>作息时间</h4>
        <p class="muted">填写学校的作息时间（例如：上午8:00-12:00，下午13:30-17:30），以便生成课表时使用。</p>
        <textarea v-model="form.scheduleTimes" class="input" rows="4" placeholder="每行一条作息规则"></textarea>
      </section>

      <section v-show="currentStep===2" class="step-pane">
        <h4>任课信息</h4>
        <p class="muted">填写或导入任课教师/课程映射（占位）。</p>
        <textarea v-model="form.teachers" class="input" rows="4" placeholder="示例：课程 - 任课教师"></textarea>
      </section>

      <section v-show="currentStep===3" class="step-pane">
        <h4>公共活动</h4>
        <p class="muted">例如集合、体育课等占用时间段。</p>
        <textarea v-model="form.publicActivities" class="input" rows="4" placeholder="每行一条公共活动"></textarea>
      </section>

      <section v-show="currentStep===4" class="step-pane">
        <h4>约束</h4>
        <p class="muted">填写需要传给排课算法的约束条件（示例：教师冲突、教室容量、时间偏好等）。</p>
        <textarea v-model="form.constraints" class="input" rows="6" placeholder="JSON 或 自然语言描述都可"></textarea>
      </section>

      <section v-show="currentStep===5" class="step-pane">
        <h4>课表预览</h4>
        <p class="muted">预览会展示后端生成的课表（暂为占位）。</p>
        <div class="preview">{{ preview || '尚未生成' }}</div>
        <div class="actions">
          <button class="btn btn-primary" @click="submitForGeneration" :disabled="!planId || generating">提交生成预览</button>
        </div>
      </section>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
// NOTE: 后端暂未就绪；在本地模拟保存与生成以便 UI 测试
// 保留 `api` 引入以便将来恢复真实交互
import api from '../api/plans'

const router = useRouter()
const steps = [
  { key: 'basic', label: '基本信息' },
  { key: 'times', label: '作息时间' },
  { key: 'teachers', label: '任课' },
  { key: 'activities', label: '公共活动' },
  { key: 'constraints', label: '约束' },
  { key: 'preview', label: '课表预览' }
]

const currentStep = ref(0)
const completed = ref(steps.map(() => false))

const form = reactive({
  // id 可由后端返回
  id: null,
  title: '',
  status: 'draft',
  note: '',
  scheduleTimes: '',
  teachers: '',
  publicActivities: '',
  constraints: ''
})

const saving = ref(false)
const generating = ref(false)
const error = ref('')
const preview = ref('')

const planId = computed(() => form.id)

async function saveDraft() {
  // 本地模拟保存：生成本地 id，并短暂等待以模拟网络延迟
  saving.value = true
  try {
    await new Promise(r => setTimeout(r, 200))
    if (!form.id) form.id = 'local-' + Date.now()
    // 模拟返回对象
    return { id: form.id, ...JSON.parse(JSON.stringify(form)) }
  } catch (e) {
    console.error('saveDraft(simulated)', e)
    error.value = e.message || '保存失败'
    return null
  } finally {
    saving.value = false
  }
}

async function next() {
  error.value = ''
  // basic validation: ensure title for step 0
  if (currentStep.value === 0 && !form.title) {
    error.value = '请填写方案名称'
    return
  }
  // save draft on step change
  const res = await saveDraft()
  if (res === null) return
  completed.value[currentStep.value] = true
  if (currentStep.value < steps.length - 1) currentStep.value++
}

function prev() {
  if (currentStep.value > 0) currentStep.value--
}

async function submitForGeneration() {
  // 本地模拟：不调用后端，生成一个示例预览文本
  error.value = ''
  if (!form.id) {
    const saved = await saveDraft()
    if (!saved || !saved.id) { error.value = '请先保存草稿'; return }
    form.id = saved.id
  }
  generating.value = true
  try {
    await new Promise(r => setTimeout(r, 400))
    // 简单模拟预览内容（可替换为更复杂的结构）
    preview.value = `模拟课表预览：\n方案：${form.title || '未命名'}\n作息：${(form.scheduleTimes || '').split('\n').slice(0,3).join(' | ')}`
    completed.value[steps.length - 1] = true
  } catch (e) {
    console.error('submitForGeneration(simulated)', e)
    error.value = e.message || '提交生成失败'
  } finally {
    generating.value = false
  }
}

function cancel() { router.push('/plans') }
</script>

<style scoped>
/* Wizard header box with horizontal steps */
.wizard-header{background:var(--surface);border:1px solid rgba(15,23,42,0.04);padding:12px;border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.steps{display:flex;gap:8px;align-items:center;flex:1;overflow:auto;padding-bottom:2px}
.step{display:inline-flex;align-items:center;gap:10px;padding:6px 10px;border-radius:8px;cursor:default;color:var(--muted);min-width:120px}
.step .index{width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;border:2px solid var(--primary-600);color:var(--primary-600);font-weight:700;background:transparent}
.step .label{font-size:13px;color:var(--muted);font-weight:600}
.step.active{background:rgba(30,136,229,0.08);color:var(--primary-600)}
.step.active .index{background:var(--primary-600);color:var(--surface);border-color:var(--primary-600)}
.step.completed{color:var(--success)}
.step.completed .index{background:var(--success);color:#fff;border-color:var(--success)}
/* 强化完成动画：缩放与背景颜色过渡 */
.step .index{transition:transform .32s ease, background-color .32s ease, border-color .32s ease}
.step.completed{animation:step-complete-bg .45s forwards}
.step.completed .index{transform:scale(1.08)}

@keyframes step-complete-bg{
  0%{background:transparent;color:var(--muted)}
  40%{background:rgba(30,136,229,0.08);color:var(--primary-600)}
  100%{background:transparent;color:var(--success)}
}

.wizard-actions{display:flex;gap:8px;align-items:center}

/* Body and panes */
.wizard-body{margin-top:12px}
.step-pane{background:transparent;padding:8px 0}
.step-pane h4{margin:0 0 8px 0;color:var(--primary-600)}

/* Form controls reuse global styles */
label{font-size:13px;color:var(--primary-600)}
.input{width:100%;padding:10px 12px;margin-top:6px;border:1px solid var(--border-muted);border-radius:6px;background:var(--bg-50);outline:none}
.actions{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}
.preview{margin-top:12px;padding:18px;border-radius:8px;background:var(--bg-50);min-height:140px}
.muted{color:var(--muted)}
.error{color:#d32f2f}

/* Responsive: allow steps to scroll horizontally on small widths */
@media (max-width:720px){
  .steps{overflow-x:auto}
  .step{min-width:100px}
}
</style>
