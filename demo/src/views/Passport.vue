<script setup>
import { ref, computed } from 'vue'
import { MARKETS, BADGES, STATUS_TEXT } from '../data.js'
import { state, litCount, verifiedStamps, levelTitle, marketStampStatus, pendingRecords } from '../store.js'

const lit = computed(() => litCount())
const stamps = computed(() => verifiedStamps())
const pendCount = computed(() => pendingRecords().length)
const sealName = (m) => m.name.replace(/场$/, '')
const stampDate = (m) => {
  // 取该场最近一条已核销记录的时间做章面日期
  const recs = state.records.filter((r) => r.marketId === m.id && r.status === 'verified')
  if (!recs.length) return ''
  const d = new Date(Math.max(...recs.map((r) => r.time)))
  return d.getMonth() + 1 + '.' + d.getDate()
}
const subText = (m) => {
  const s = marketStampStatus(m.id)
  if (s === 'verified') return stampDate(m)
  if (s === 'pending') return '待核验'
  return STATUS_TEXT[m.status]
}

const posterUrl = ref('')
function closePoster() {
  posterUrl.value = ''
}

// 分享卡片：canvas 画护照战绩图（7 枚章两排），长按可保存/转发
function makePoster() {
  const c = document.createElement('canvas')
  c.width = 750
  c.height = 1050
  const ctx = c.getContext('2d')

  ctx.fillStyle = '#f8f1e3'
  ctx.fillRect(0, 0, 750, 1050)
  ctx.strokeStyle = '#c8342b'
  ctx.lineWidth = 10
  ctx.strokeRect(24, 24, 702, 1002)
  ctx.lineWidth = 2
  ctx.strokeRect(40, 40, 670, 970)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#c8342b'
  ctx.font = '700 44px KaiTi, STKaiti, serif'
  ctx.fillText('晋江严选市集', 375, 120)
  ctx.fillStyle = '#8a8072'
  ctx.font = '24px sans-serif'
  ctx.fillText('跟着市集游闽南 · 集章护照', 375, 162)

  ctx.fillStyle = '#2f2a26'
  ctx.font = '700 56px KaiTi, STKaiti, serif'
  ctx.fillText('我的集章战绩', 375, 254)

  // 7 枚场次章：上 4 下 3（红=已到账 / 橙虚线=待核验 / 灰=未登记）
  const rows = [MARKETS.slice(0, 4), MARKETS.slice(4)]
  rows.forEach((row, r) => {
    const cy = 400 + r * 165
    row.forEach((m, i) => {
      const cx = 750 / (row.length + 1) * (i + 1)
      const st = marketStampStatus(m.id)
      const color = st === 'verified' ? '#c8342b' : st === 'pending' ? '#d9822b' : '#cfc6b8'
      ctx.beginPath()
      ctx.arc(cx, cy, 56, 0, Math.PI * 2)
      ctx.strokeStyle = color
      ctx.lineWidth = 5
      ctx.setLineDash(st === 'verified' ? [] : [8, 7])
      ctx.stroke()
      ctx.setLineDash([])
      if (st === 'verified') {
        ctx.beginPath()
        ctx.arc(cx, cy, 46, 0, Math.PI * 2)
        ctx.lineWidth = 2
        ctx.stroke()
      }
      ctx.fillStyle = st ? color : '#b9b0a0'
      ctx.font = '700 24px KaiTi, STKaiti, serif'
      ctx.fillText(sealName(m), cx, cy + 2)
      ctx.font = '15px sans-serif'
      ctx.fillText(subText(m), cx, cy + 30)
    })
  })

  ctx.fillStyle = '#2f2a26'
  ctx.font = '700 38px sans-serif'
  ctx.fillText(`点亮 ${lit.value}/${MARKETS.length} 场 · 消费章 ${stamps.value} 枚 · ${state.points} 积分`, 375, 700)

  ctx.fillStyle = '#c8342b'
  ctx.font = '700 64px KaiTi, STKaiti, serif'
  ctx.fillText('『' + levelTitle() + '』', 375, 800)

  ctx.fillStyle = '#8a8072'
  ctx.font = '22px sans-serif'
  ctx.fillText('厦门宝龙 / 晋江宝龙 双场进行中 · 等你来盖章', 375, 900)
  ctx.fillText('demo 数据 · 正式版接真实场次', 375, 975)

  c.toBlob((blob) => {
    posterUrl.value = URL.createObjectURL(blob)
  }, 'image/png')
}
</script>

<template>
  <div>
    <section class="card summary">
      <div class="lv">
        <b>{{ levelTitle() }}</b>
        <span class="muted">当前称号</span>
      </div>
      <div class="nums">
        <div><b>{{ lit }}/{{ MARKETS.length }}</b><span>场次章</span></div>
        <div><b>{{ stamps }}</b><span>消费章(已到账)</span></div>
        <div><b>{{ state.points }}</b><span>积分</span></div>
      </div>
      <div class="muted tip-line">
        <template v-if="pendCount">还有 {{ pendCount }} 笔登记「待核验」· 兑奖时集卡处扫码抽查后到账<br /></template>
        再集 {{ Math.max(0, 3 - lit) }} 场解锁「闽南通」· 积分可换严选好物 / 商户券
      </div>
    </section>

    <section class="card">
      <h2>我的印章册</h2>
      <div class="legend">
        <i class="dot v"></i>已核销到账 <i class="dot p"></i>登记待核验 <i class="dot g"></i>未登记
      </div>
      <div class="grid">
        <div v-for="m in MARKETS" :key="m.id" class="cell">
          <div class="seal" :class="marketStampStatus(m.id) || 'gray'">
            <span class="s-name" :class="{ long: sealName(m).length > 3 }">{{ sealName(m) }}</span>
            <span class="s-sub">{{ subText(m) }}</span>
          </div>
          <div class="cell-name">{{ m.venue }}<em>{{ m.city }}</em></div>
        </div>
      </div>
    </section>

    <section class="card">
      <h2>成就徽章</h2>
      <div v-for="b in BADGES" :key="b.id" class="badge" :class="{ got: b.test(lit) }">
        <i></i>
        <div>
          <b>{{ b.name }}</b>
          <em>{{ b.desc }}</em>
        </div>
        <u>{{ b.test(lit) ? '已解锁' : '未解锁' }}</u>
      </div>
    </section>

    <button class="btn solid wide" @click="makePoster">生成我的分享卡片</button>
    <div class="muted center">卡片可发朋友圈 / 粉丝群 —— 抖音转发的是视频，这个转发的是你的打卡战绩</div>

    <div v-if="posterUrl" class="mask" @click="closePoster">
      <img :src="posterUrl" alt="集章分享卡片" />
      <div class="tip">长按图片保存或转发 · 点空白处关闭</div>
    </div>
  </div>
</template>

<style scoped>
.summary {
  text-align: center;
}
.lv b {
  display: inline-block;
  font-size: 26px;
  font-family: 'Kaiti SC', KaiTi, STKaiti, serif;
  color: var(--seal-dark);
  letter-spacing: 2px;
}
.lv .muted {
  display: block;
  margin-top: 2px;
}
.nums {
  display: flex;
  justify-content: center;
  gap: 34px;
  margin: 14px 0 10px;
}
.nums b {
  display: block;
  font-size: 22px;
  font-weight: 800;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.nums span {
  font-size: 11px;
  color: var(--muted);
}
.tip-line {
  border-top: 1px dashed var(--line);
  padding-top: 10px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 10px;
  justify-content: flex-start;
}
.legend {
  font-size: 10px;
  color: var(--muted);
  margin: -6px 0 10px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.legend .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 8px;
}
.legend .dot:first-child {
  margin-left: 0;
}
.legend .dot.v {
  background: var(--seal);
}
.legend .dot.p {
  background: #d9822b;
}
.legend .dot.g {
  background: #cfc6b8;
}
.cell {
  width: 31%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.cell .seal {
  width: 76px;
  height: 76px;
}
.cell .s-name.long {
  font-size: 15px;
  letter-spacing: 0;
}
.cell-name {
  font-size: 11px;
  font-weight: 700;
  text-align: center;
}
.cell-name em {
  font-style: normal;
  color: var(--muted);
  font-weight: 400;
  margin-left: 3px;
  font-size: 10px;
}

.badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px dashed var(--line);
  opacity: 0.5;
}
.badge:last-child {
  border-bottom: none;
}
.badge.got {
  opacity: 1;
}
.badge i {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--gold);
  flex: none;
  background: radial-gradient(circle at 35% 30%, #ffe9c0, #e5c078);
}
.badge:not(.got) i {
  filter: grayscale(1);
}
.badge div {
  flex: 1;
}
.badge b {
  font-size: 14px;
}
.badge em {
  display: block;
  font-style: normal;
  font-size: 11px;
  color: var(--muted);
}
.badge u {
  text-decoration: none;
  font-size: 11px;
  font-weight: 800;
  color: var(--gold);
}
.badge.got u {
  color: var(--seal);
}

.wide {
  margin-top: 4px;
}
.center {
  text-align: center;
  margin-top: 8px;
  line-height: 1.6;
}
</style>
