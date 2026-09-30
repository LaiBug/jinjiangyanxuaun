<script setup>
import { ref, computed } from 'vue'
import { MARKETS, BADGES, STATUS_TEXT } from '../data.js'
import { state, litCount, stallStampCount, levelTitle } from '../store.js'

const lit = computed(() => litCount())
const stallCount = computed(() => stallStampCount())
const isLit = (m) => !!state.marketStamps[m.id]
const sealName = (m) => m.name.replace(/场$/, '')
const stampDate = (m) => {
  const ts = state.marketStamps[m.id]
  if (!ts) return ''
  const d = new Date(ts)
  return d.getMonth() + 1 + '.' + d.getDate()
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

  // 7 枚场次章：上 4 下 3
  const rows = [MARKETS.slice(0, 4), MARKETS.slice(4)]
  rows.forEach((row, r) => {
    const cy = 400 + r * 165
    row.forEach((m, i) => {
      const cx = 750 / (row.length + 1) * (i + 1)
      const on = isLit(m)
      ctx.beginPath()
      ctx.arc(cx, cy, 56, 0, Math.PI * 2)
      ctx.strokeStyle = on ? '#c8342b' : '#cfc6b8'
      ctx.lineWidth = 5
      ctx.setLineDash(on ? [] : [8, 7])
      ctx.stroke()
      ctx.setLineDash([])
      if (on) {
        ctx.beginPath()
        ctx.arc(cx, cy, 46, 0, Math.PI * 2)
        ctx.lineWidth = 2
        ctx.stroke()
      }
      ctx.fillStyle = on ? '#c8342b' : '#b9b0a0'
      ctx.font = '700 24px KaiTi, STKaiti, serif'
      ctx.fillText(sealName(m), cx, cy + 2)
      ctx.font = '15px sans-serif'
      ctx.fillText(on ? stampDate(m) : STATUS_TEXT[m.status], cx, cy + 30)
    })
  })

  ctx.fillStyle = '#2f2a26'
  ctx.font = '700 38px sans-serif'
  ctx.fillText(`点亮 ${lit.value}/${MARKETS.length} 场 · 摊位章 ${stallCount.value} 枚 · ${state.points} 积分`, 375, 700)

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
        <div><b>{{ stallCount }}</b><span>摊位章</span></div>
        <div><b>{{ state.points }}</b><span>积分</span></div>
      </div>
      <div class="muted tip-line">再集 {{ Math.max(0, 3 - lit) }} 场解锁「闽南通」· 积分可换严选好物 / 商户券</div>
    </section>

    <section class="card">
      <h2>我的印章册</h2>
      <div class="grid">
        <div v-for="m in MARKETS" :key="m.id" class="cell">
          <div v-if="isLit(m)" class="seal">
            <span class="s-name" :class="{ long: sealName(m).length > 3 }">{{ sealName(m) }}</span>
            <span class="s-sub">{{ stampDate(m) }}</span>
          </div>
          <div v-else class="seal gray">
            <span class="s-name" :class="{ long: sealName(m).length > 3 }">{{ sealName(m) }}</span>
            <span class="s-sub">{{ STATUS_TEXT[m.status] }}</span>
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
