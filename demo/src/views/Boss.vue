<script setup>
import { inject } from 'vue'
import { FUNNEL } from '../data.js'

const nav = inject('nav')
const max = FUNNEL[0].value
const pct = (v) => Math.max(8, (v / max) * 100) + '%'
const fmt = (v) => v.toLocaleString('zh-CN')
</script>

<template>
  <div>
    <button class="backbar" @click="nav('profile')">‹ 返回「我的」 · 运营看板（老板视角）</button>
    <div class="quote">
      “抖音后台告诉你视频多少人看；<br />这块看板告诉你<b>多少人真来了、来了几次、怎么再叫回来</b>。”
    </div>

    <section class="card">
      <h2>客流漏斗（本周双场·预演）</h2>
      <div v-for="f in FUNNEL" :key="f.label" class="frow">
        <div class="flabel">{{ f.label }}</div>
        <div class="ftrack"><div class="fbar" :style="{ width: pct(f.value) }"></div></div>
        <div class="fval">{{ fmt(f.value) }}</div>
      </div>
      <div class="muted">以上为 demo 模拟数据；正式版由查场次 / 导航 / 盖章行为自动统计生成</div>
    </section>

    <section class="card kpis">
      <h2>老板最关心的三个数</h2>
      <div class="kpi">
        <b>24.9%</b>
        <span>到场游客变回头客比例<br />（集满 3 章 / 真到场）</span>
      </div>
      <div class="kpi">
        <b>3.2 枚</b>
        <span>人均消费章数<br />＝ 每人平均在 3 个摊位花钱并登记</span>
      </div>
      <div class="kpi">
        <b>214 人</b>
        <span>私域可召回人数<br />＝ 订阅消息免费触达，不靠抖音投流</span>
      </div>
    </section>

    <section class="card verify-cmp">
      <h2>集章核销：现状 vs 新方案</h2>
      <div class="vc-row old">
        <b>现状</b>
        <span>集卡处对着付款记录<b>逐笔人工核对</b>：认截图、算档位、盖章，≈40 秒/笔，高峰期排长队、易错易漏</span>
      </div>
      <div class="vc-row new">
        <b>新方案</b>
        <span>用户扫码<b>自助登记</b>（截图 OCR 自动带出金额/单号），兑奖时扫核销码<b>抽查一次</b>放行，≈10 秒/人</span>
      </div>
      <div class="muted">人工只留在「兑奖这一刻」，其余环节零人工；单号字符串去重，不碰钱、不接支付回调</div>
    </section>

    <div class="note">
      收款码只记「成交了多少钱」，这块看板记「人怎么来、来了几次、怎么叫回来」——两者接力，不碰钱。
    </div>
  </div>
</template>

<style scoped>
.quote {
  background: var(--ink);
  color: #f4e8d4;
  border-radius: 16px;
  padding: 16px 18px;
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 14px;
}
.quote b {
  color: #ffcf8a;
}

.frow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.flabel {
  width: 108px;
  font-size: 11px;
  color: var(--muted);
  flex: none;
  line-height: 1.3;
}
.ftrack {
  flex: 1;
  height: 14px;
  background: #efe6d4;
  border-radius: 7px;
  overflow: hidden;
}
.fbar {
  height: 100%;
  border-radius: 7px;
  background: linear-gradient(90deg, #e0655c, var(--seal-dark));
}
.fval {
  width: 52px;
  text-align: right;
  font-size: 12px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  flex: none;
}
.card .muted {
  margin-top: 4px;
}

.kpis {
  display: block;
}
.kpi {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--line);
}
.kpi:last-child {
  border-bottom: none;
}
.kpi b {
  font-size: 24px;
  font-weight: 800;
  color: var(--seal);
  width: 86px;
  flex: none;
  font-variant-numeric: tabular-nums;
}
.kpi span {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.6;
}

.vc-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 12px;
  line-height: 1.7;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
}
.vc-row b {
  flex: none;
  font-size: 11px;
  color: #fff;
  border-radius: 4px;
  padding: 1px 7px;
  margin-top: 2px;
}
.vc-row span b {
  flex: none;
  font-size: 12px;
  color: inherit;
  background: none;
  padding: 0;
  margin: 0;
  font-weight: 800;
}
.vc-row.old {
  background: rgba(138, 128, 114, 0.1);
  color: var(--muted);
}
.vc-row.old > b {
  background: var(--muted);
}
.vc-row.new {
  background: rgba(74, 143, 74, 0.1);
  color: #3d7a3d;
}
.vc-row.new > b {
  background: #4a8f4a;
}
.verify-cmp .muted {
  margin-top: 2px;
}
</style>
