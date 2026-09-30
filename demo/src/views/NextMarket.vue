<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MARKETS, STATUS_TEXT, ongoingMarkets, nextMarket, daysLeft } from '../data.js'
import { marketStampStatus } from '../store.js'
import { toast } from '../store.js'

const ongoing = ongoingMarkets()
const next = nextMarket()

// 下一场开市倒计时（秒级）
const target = new Date(next.start + 'T09:00:00').getTime()
const cd = ref({ d: 0, h: 0, m: 0, s: 0 })
let timer = null
function tick() {
  const diff = Math.max(0, target - Date.now())
  cd.value = {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}
onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})
onUnmounted(() => clearInterval(timer))

const cdUnits = computed(() => [
  { v: cd.value.d, l: '天' },
  { v: cd.value.h, l: '时' },
  { v: cd.value.m, l: '分' },
  { v: cd.value.s, l: '秒' },
])

// 场次章状态仅做展示（来源=消费登记核销，不在首页盖章）
const statusOf = (m) => marketStampStatus(m.id)
const sealName = (m) => m.name.replace(/场$/, '')
const STATUS_SEAL_TEXT = { verified: '已到账', pending: '待核验' }

function nav() {
  toast('demo 占位：正式版接腾讯地图一键导航')
}
function remind() {
  toast('demo 占位：正式版接微信订阅消息·开市自动提醒')
}
function fmt(m) {
  if (!m.start) return '待定'
  return m.start.slice(5).replace('-', '.') + ' - ' + m.end.slice(5).replace('-', '.')
}
</script>

<template>
  <div>
    <div v-if="ongoing.length > 1" class="duo">
      <span>本周 {{ ongoing.length }} 场同开</span>
      <em>{{ ongoing.map((m) => m.city + '·' + m.venue).join(' ／ ') }}</em>
    </div>

    <!-- 进行中的场次：双场并行展示 -->
    <section v-for="m in ongoing" :key="m.id" class="card live">
      <div class="live-top">
        <div class="pill-red pulse">进行中 · 剩 {{ daysLeft(m) }} 天</div>
        <span class="muted">{{ m.city }}</span>
      </div>
      <h1>
        {{ m.venue }}
        <small>{{ m.specialty }}</small>
      </h1>
      <div class="date">{{ fmt(m) }}</div>
      <div class="stamp-zone">
        <div class="seal" :class="{ gray: !statusOf(m), pending: statusOf(m) === 'pending' }">
          <span class="s-name">{{ sealName(m) }}</span>
          <span class="s-sub">{{ statusOf(m) ? STATUS_SEAL_TEXT[statusOf(m)] : '待集' }}</span>
        </div>
        <div class="live-btns">
          <button class="btn solid" @click="nav">一键导航</button>
          <button class="btn ghost" @click="remind">提醒我</button>
        </div>
      </div>
      <div class="muted howto">到场扫摊位码付款 → 扫摊位静态码登记消费 → 集章兑好礼（去「本场集章」体验）</div>
    </section>

    <!-- 下一场预告 -->
    <section class="card hero">
      <div class="pill-red">下一场 · {{ cd.d }} 天后开市</div>
      <h1>
        {{ next.venue }}
        <small>{{ next.city }} · {{ next.specialty }}</small>
      </h1>
      <div class="date">{{ fmt(next) }}</div>

      <div class="cd">
        <div v-for="u in cdUnits" :key="u.l" class="cd-u">
          <b>{{ String(u.v).padStart(2, '0') }}</b>
          <span>{{ u.l }}</span>
        </div>
      </div>

      <div class="row">
        <button class="btn ghost" @click="nav">一键导航</button>
        <button class="btn ghost" @click="remind">开市提醒我</button>
      </div>
    </section>

    <section class="card">
      <h2>巡回时间轴</h2>
      <ul class="tl">
        <li v-for="m in MARKETS" :key="m.id" :class="m.status">
          <i></i>
          <div class="tl-body">
            <b>{{ m.venue }}</b>
            <em>{{ m.city }} · {{ m.specialty }}</em>
          </div>
          <span class="tl-date">
            {{ fmt(m) }}
            <u>{{ STATUS_TEXT[m.status] }}</u>
          </span>
        </li>
      </ul>
      <div class="muted tl-foot">跨晋江 + 南安 + 厦门巡回 · 跟着严选市集游闽南</div>
    </section>
  </div>
</template>

<style scoped>
.duo {
  background: linear-gradient(135deg, #d8433a, var(--seal-dark));
  color: #ffe9c9;
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 14px;
}
.duo span {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
}
.duo em {
  display: block;
  font-style: normal;
  font-size: 11px;
  opacity: 0.9;
  margin-top: 3px;
  line-height: 1.6;
}

.live {
  border-color: rgba(200, 52, 43, 0.35);
  box-shadow: 0 4px 18px rgba(200, 52, 43, 0.12);
}
.live-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.pill-red {
  display: inline-block;
  background: rgba(200, 52, 43, 0.1);
  color: var(--seal);
  font-size: 12px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 999px;
}
.pill-red.pulse {
  background: var(--seal);
  color: #fff;
  animation: breathe 1.8s infinite;
}
@keyframes breathe {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(200, 52, 43, 0.4);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(200, 52, 43, 0);
  }
}

.live h1,
.hero h1 {
  font-size: 24px;
  font-family: 'Kaiti SC', KaiTi, STKaiti, serif;
  letter-spacing: 2px;
  color: var(--seal-dark);
  text-align: center;
}
.live h1 small,
.hero h1 small {
  display: block;
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 1px;
  margin-top: 4px;
  font-family: -apple-system, 'PingFang SC', sans-serif;
}
.date {
  font-size: 13px;
  color: var(--muted);
  margin: 8px 0 12px;
  text-align: center;
}

.stamp-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 4px 0 8px;
}
.live-btns {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
}
.howto {
  border-top: 1px dashed var(--line);
  padding-top: 8px;
  text-align: center;
  line-height: 1.6;
}
.row {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.hero {
  text-align: center;
}
.hero .pill-red {
  margin-bottom: 10px;
}
.cd {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}
.cd-u b {
  display: block;
  background: var(--ink);
  color: #ffe9c9;
  font-size: 22px;
  font-weight: 800;
  border-radius: 8px;
  padding: 6px 10px;
  min-width: 44px;
  font-variant-numeric: tabular-nums;
}
.cd-u span {
  font-size: 11px;
  color: var(--muted);
}

.tl {
  list-style: none;
}
.tl li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px dashed var(--line);
}
.tl li:last-child {
  border-bottom: none;
}
.tl i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #cfc6b4;
  flex: none;
}
.tl li.ongoing i {
  background: var(--seal);
  animation: breathe 1.8s infinite;
}
.tl li.upcoming i {
  background: var(--gold);
}
.tl-body {
  flex: 1;
  min-width: 0;
}
.tl-body b {
  font-size: 14px;
}
.tl-body em {
  display: block;
  font-style: normal;
  font-size: 11px;
  color: var(--muted);
}
.tl-date {
  font-size: 11px;
  color: var(--muted);
  text-align: right;
}
.tl-date u {
  display: block;
  text-decoration: none;
  font-weight: 700;
  color: var(--gold);
}
.tl li.ongoing .tl-date u {
  color: var(--seal);
}
.tl-foot {
  margin-top: 10px;
  text-align: center;
}
</style>
