<script setup>
import { ref, computed } from 'vue'
import { switchableMarkets, stallsOf, STATUS_TEXT, stampsForAmount, tierLabel, marketById } from '../data.js'
import { state, recordByStall, registerConsumption } from '../store.js'

const markets = switchableMarkets()
const cur = ref(markets[0].id)
const market = computed(() => markets.find((m) => m.id === cur.value))
const stalls = computed(() => stallsOf(cur.value))

// —— 消费登记弹窗（模拟：扫摊位静态码 → 上传付款截图 → OCR → 确认预到账）——
const modalStall = ref(null)
const ocrState = ref('idle') // idle | scanning | done
let ocrTimer = null

function openRegister(s) {
  if (recordByStall(s.id)) return
  modalStall.value = s
  ocrState.value = 'idle'
}
function closeRegister() {
  modalStall.value = null
  ocrState.value = 'idle'
  clearTimeout(ocrTimer)
}
function uploadShot() {
  ocrState.value = 'scanning'
  ocrTimer = setTimeout(() => {
    ocrState.value = 'done'
  }, 900)
}
function submitRegister() {
  const s = modalStall.value
  registerConsumption(s, s.price)
  closeRegister()
}

function recOf(s) {
  return recordByStall(s.id)
}
const litCount = computed(() => stalls.value.filter((s) => recOf(s)).length)
function fmtTime(ts) {
  const d = new Date(ts)
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}
</script>

<template>
  <div>
    <div class="note">
      玩法口径（与现场一致）：扫摊位聚合码付款（钱进商家）→ 扫摊位静态码登记这笔消费 → 上传付款截图 OCR 读金额/单号 → 章预到账 → 兑奖时集卡处扫码抽查一次放行。
    </div>

    <!-- 多场并行切换 -->
    <div class="chips">
      <button v-for="m in markets" :key="m.id" class="chip" :class="{ on: cur === m.id }" @click="cur = m.id">
        {{ m.venue }}<u>{{ STATUS_TEXT[m.status] }}</u>
      </button>
    </div>

    <section class="card head">
      <h2>{{ market.venue }} · 消费集章</h2>
      <div class="prog">
        <div class="prog-bar"><i :style="{ width: (litCount / stalls.length) * 100 + '%' }"></i></div>
        <span>已登记 {{ litCount }}/{{ stalls.length }}</span>
      </div>
      <div class="muted">档位：¥10 以下 1 章 · ¥10~30 两章 · ¥30 以上 3 章（多消费多得）</div>
    </section>

    <section v-for="s in stalls" :key="s.id" class="card stall">
      <div class="info">
        <div class="name">
          <span class="tag">{{ s.type === 'food' ? '美食' : '严选好物' }}</span>
          {{ s.name }}
        </div>
        <div class="muted">必试：{{ s.mustTry }} · {{ s.tag }} · 客单约 ¥{{ s.price }}</div>
        <div v-if="recOf(s)" class="rec">
          <u :class="recOf(s).status">
            {{ recOf(s).status === 'verified' ? '已到账' : '待核验' }}
          </u>
          ¥{{ recOf(s).amount }} · {{ recOf(s).stamps }} 章 · 单号 {{ recOf(s).receiptNo }}
        </div>
      </div>
      <div v-if="recOf(s)" class="seal mini" :class="{ pending: recOf(s).status === 'pending' }">
        <span class="s-name">{{ recOf(s).stamps }}章</span>
      </div>
      <button v-else class="btn ghost stamp-btn" @click="openRegister(s)">扫码登记</button>
    </section>

    <!-- 登记弹窗 -->
    <div v-if="modalStall" class="mask reg" @click.self="closeRegister">
      <div class="sheet">
        <div class="sheet-hd">
          <b>登记消费 · {{ modalStall.name }}</b>
          <button class="x" @click="closeRegister">关闭</button>
        </div>
        <div class="muted step">第 1 步 · 已扫摊位静态码（摊位ID：{{ modalStall.id.toUpperCase() }}）· 付款走摊位聚合码，钱不进平台</div>

        <div v-if="ocrState === 'idle'" class="shot-zone">
          <button class="btn solid wide" @click="uploadShot">上传付款截图</button>
          <div class="muted">第 2 步 · 上传后 OCR 自动读金额 / 时间 / 单号</div>
        </div>

        <div v-else-if="ocrState === 'scanning'" class="shot-zone">
          <div class="shot scanning">OCR 识别中…</div>
        </div>

        <div v-else class="ocr-card">
          <div class="shot ok">付款截图已识别</div>
          <div class="ocr-row"><span>付款金额</span><b>¥{{ modalStall.price }}</b></div>
          <div class="ocr-row"><span>付款时间</span><b>今天 {{ fmtTime(Date.now()) }}</b></div>
          <div class="ocr-row"><span>支付单号</span><b>SQB••••{{ String(Date.now()).slice(-4) }}</b></div>
          <div class="ocr-tier">
            档位 {{ tierLabel(modalStall.price) }} → 可记 <b>{{ stampsForAmount(modalStall.price) }}</b> 枚章（预到账，兑奖核验后生效）
          </div>
          <button class="btn solid wide" @click="submitRegister">确认无误 · 提交登记</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin-bottom: 12px;
  padding-bottom: 2px;
}
.chip {
  flex: none;
  padding: 8px 14px;
  border-radius: 999px;
  background: #fff;
  border: 1.5px solid var(--line);
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
}
.chip.on {
  border-color: var(--seal);
  color: var(--seal);
  background: rgba(200, 52, 43, 0.08);
}
.chip u {
  text-decoration: none;
  font-size: 10px;
  margin-left: 5px;
  color: var(--gold);
}
.chip.on u {
  color: var(--seal);
}

.head .prog {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.prog-bar {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: #eee4d2;
  overflow: hidden;
}
.prog-bar i {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0655c, var(--seal));
  transition: width 0.4s;
}
.prog span {
  font-size: 12px;
  font-weight: 800;
  color: var(--seal);
  white-space: nowrap;
}

.stall {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
}
.info {
  min-width: 0;
}
.name {
  font-size: 15px;
  font-weight: 800;
  margin-bottom: 5px;
}
.rec {
  margin-top: 6px;
  font-size: 11px;
  color: var(--muted);
}
.rec u {
  text-decoration: none;
  font-weight: 800;
  font-size: 10px;
  border-radius: 4px;
  padding: 1px 6px;
  margin-right: 6px;
}
.rec u.pending {
  color: #d9822b;
  background: rgba(217, 130, 43, 0.12);
}
.rec u.verified {
  color: var(--seal);
  background: rgba(200, 52, 43, 0.1);
}
.stamp-btn {
  flex: none;
  padding: 8px 16px;
}

/* 登记弹窗 */
.mask.reg {
  align-items: flex-end;
  padding: 0;
}
.sheet {
  width: 100%;
  max-width: 480px;
  background: var(--card);
  border-radius: 20px 20px 0 0;
  padding: 18px 18px calc(22px + env(safe-area-inset-bottom));
  animation: up 0.25s ease-out;
}
@keyframes up {
  from {
    transform: translateY(40px);
    opacity: 0.4;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.sheet-hd {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.sheet-hd b {
  font-size: 16px;
}
.x {
  font-size: 12px;
  color: var(--muted);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 4px 12px;
}
.step {
  margin-bottom: 12px;
  line-height: 1.6;
}
.shot-zone {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 6px 0 4px;
}
.shot {
  height: 96px;
  border-radius: 12px;
  border: 1.5px dashed var(--gold);
  background: rgba(184, 134, 45, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--gold);
}
.shot.scanning {
  animation: breathe 1s infinite;
}
.shot.ok {
  border-style: solid;
  border-color: #4a8f4a;
  background: rgba(74, 143, 74, 0.08);
  color: #4a8f4a;
  height: 64px;
  margin-bottom: 10px;
}
.ocr-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ocr-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  background: #faf6ec;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 12px;
}
.ocr-row b {
  font-variant-numeric: tabular-nums;
}
.ocr-tier {
  font-size: 12px;
  color: var(--seal);
  background: rgba(200, 52, 43, 0.07);
  border-radius: 8px;
  padding: 8px 12px;
  line-height: 1.6;
  margin-bottom: 4px;
}
</style>
