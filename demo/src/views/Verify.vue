<script setup>
import { ref, computed } from 'vue'
import { marketById } from '../data.js'
import { state, pendingRecords, verifyAll, toast } from '../store.js'

// 集卡处 / 工作人员视角（demo 高光页）：扫用户核销码 → 消费清单自动带出 → 抽查一次 → 一键到账
const scanned = ref(false)
const doneInfo = ref(null) // { count, stamps } 最近一次核销结果

function scan() {
  scanned.value = true
  doneInfo.value = null
}
function reset() {
  scanned.value = false
  doneInfo.value = null
}
function confirmVerify() {
  const res = verifyAll()
  if (res) {
    doneInfo.value = res
    scanned.value = false
  }
}

const pendings = computed(() => pendingRecords())
const totalStamps = computed(() => pendings.value.reduce((s, r) => s + r.stamps, 0))
const totalAmount = computed(() => pendings.value.reduce((s, r) => s + r.amount, 0))
// 现状对比：逐笔人工核对 ≈ 每笔 40 秒；新方案一次扫码 ≈ 10 秒
const manualSeconds = computed(() => pendings.value.length * 40)

function stallName(r) {
  return r.stallName || ''
}
function fmtTime(ts) {
  const d = new Date(ts)
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}
</script>

<template>
  <div>
    <div class="note">
      集卡处工作人员视角（demo）。现状痛点：对着一堆付款记录<b>逐笔人工核对金额、算章、盖章</b>；新方案把人工压缩到「兑奖这一刻抽查一次」。
    </div>

    <!-- 未扫码：出示核销码 -->
    <section v-if="!scanned && !doneInfo" class="card center">
      <h2>兑奖核销</h2>
      <div class="qr" aria-hidden="true"></div>
      <div class="code">核销码 YX-88F3-20Q9（基于 openid）</div>
      <div class="muted">用户出示核销码 · 同超市出示会员码积分</div>
      <button class="btn solid wide" @click="scan">扫核销码（demo 模拟）</button>
    </section>

    <!-- 已扫码：消费清单自动带出 -->
    <section v-if="scanned" class="card">
      <h2>消费清单 · 自动带出</h2>
      <div v-if="!pendings.length" class="empty">
        该用户暂无待核验的消费登记。<br />
        <span class="muted">先去「本场集章」登记几笔消费再回来核销。</span>
        <div class="row"><button class="btn ghost" @click="reset">返回</button></div>
      </div>
      <template v-else>
        <div v-for="r in pendings" :key="r.id" class="vrow">
          <div class="vinfo">
            <b>{{ r.stallName }}</b>
            <em>{{ marketById(r.marketId)?.venue }} · {{ fmtTime(r.time) }} · 单号 {{ r.receiptNo }}</em>
          </div>
          <div class="vamt">
            ¥{{ r.amount }}
            <u>{{ r.stamps }} 章</u>
          </div>
        </div>
        <div class="vsum">
          共 {{ pendings.length }} 笔 · 合计 ¥{{ totalAmount }} · 应记 <b>{{ totalStamps }}</b> 枚章
        </div>
        <div class="compare">
          <div class="c-row old">
            <span>现状</span>逐笔人工核对 {{ pendings.length }} 笔 ≈ {{ manualSeconds }} 秒/人
          </div>
          <div class="c-row new">
            <span>现在</span>扫码一次带出清单 + 抽查 ≈ 10 秒/人
          </div>
        </div>
        <button class="btn solid wide" @click="confirmVerify">抽查无误 · 一键确认到账</button>
        <div class="muted center-tip">只记单号字符串做去重，不碰钱、不接支付回调</div>
      </template>
    </section>

    <!-- 核销完成 -->
    <section v-if="doneInfo" class="card done">
      <div class="seal pop">
        <span class="s-name">放行</span>
        <span class="s-sub">核销章</span>
      </div>
      <h2>核销完成</h2>
      <div class="muted">
        {{ doneInfo.count }} 笔消费抽查放行 · {{ doneInfo.stamps }} 枚章到账 · 积分已发<br />
        用户护照里的章由「待核验」转为「已到账」
      </div>
      <button class="btn ghost" @click="reset">核销下一位</button>
    </section>
  </div>
</template>

<style scoped>
.center {
  text-align: center;
}
.qr {
  width: 132px;
  height: 132px;
  margin: 10px auto 12px;
  border-radius: 10px;
  border: 6px solid #fff;
  outline: 1.5px solid var(--line);
  background: repeating-conic-gradient(var(--ink) 0 25%, #fff 0 50%) 0 0 / 12px 12px;
  position: relative;
}
.qr::after {
  content: '严';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 34px;
  height: 34px;
  background: var(--seal);
  color: #fff;
  font-family: 'Kaiti SC', KaiTi, STKaiti, serif;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}
.code {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 4px;
}
.center .muted {
  margin-bottom: 14px;
}

.vrow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--line);
}
.vinfo b {
  font-size: 14px;
}
.vinfo em {
  display: block;
  font-style: normal;
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}
.vamt {
  font-size: 15px;
  font-weight: 800;
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.vamt u {
  display: block;
  text-decoration: none;
  font-size: 11px;
  color: var(--seal);
}
.vsum {
  margin: 12px 0;
  font-size: 13px;
  font-weight: 700;
  background: #faf6ec;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 9px 12px;
}
.vsum b {
  color: var(--seal);
  font-size: 16px;
}

.compare {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}
.c-row {
  font-size: 12px;
  border-radius: 8px;
  padding: 8px 12px;
  line-height: 1.5;
}
.c-row span {
  font-weight: 800;
  margin-right: 8px;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 11px;
}
.c-row.old {
  background: rgba(138, 128, 114, 0.1);
  color: var(--muted);
}
.c-row.old span {
  background: var(--muted);
  color: #fff;
}
.c-row.new {
  background: rgba(74, 143, 74, 0.1);
  color: #3d7a3d;
}
.c-row.new span {
  background: #4a8f4a;
  color: #fff;
}

.empty {
  text-align: center;
  font-size: 13px;
  padding: 10px 0 4px;
  line-height: 1.8;
}
.empty .row {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}
.center-tip {
  text-align: center;
  margin-top: 8px;
}

.done {
  text-align: center;
}
.done .seal {
  margin: 4px auto 12px;
}
.done h2 {
  justify-content: center;
}
.done h2::before {
  display: none;
}
.done .muted {
  line-height: 1.8;
  margin-bottom: 14px;
}
</style>
