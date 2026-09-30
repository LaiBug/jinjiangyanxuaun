<script setup>
import { computed, inject } from 'vue'
import { MARKETS } from '../data.js'
import { state, levelTitle, litCount, verifiedStamps, pendingRecords } from '../store.js'
import { toast } from '../store.js'

// 「我的」页：用户端一级 tab。二级功能与「工作人员/老板」入口都收在这里，
// 底部 tabBar 只保留纯用户端 4 个 tab，日后加功能=往这里加一个入口，不动主框架。
const nav = inject('nav')

const lit = computed(() => litCount())
const stamps = computed(() => verifiedStamps())
const pend = computed(() => pendingRecords().length)

function todo(label) {
  toast('demo 占位：正式版' + label)
}
</script>

<template>
  <div>
    <!-- 账号概览 -->
    <section class="card me">
      <div class="avatar">严</div>
      <div class="me-info">
        <b>{{ levelTitle() }}</b>
        <span class="muted">微信登录 · openid 绑定（正式版）</span>
      </div>
      <div class="me-nums">
        <div><b>{{ state.points }}</b><span>积分</span></div>
        <div><b>{{ lit }}/{{ MARKETS.length }}</b><span>场次章</span></div>
        <div><b>{{ stamps }}</b><span>消费章</span></div>
      </div>
      <div v-if="pend" class="pend-tip">还有 {{ pend }} 笔消费登记「待核验」，兑奖时集卡处扫码抽查后到账</div>
    </section>

    <!-- 用户端功能入口（二级功能收纳区，扩展只加这里） -->
    <section class="card">
      <h2>我的严选</h2>
      <div class="menu">
        <button class="mi" @click="nav('passport')">
          <i class="ic stamp"></i><span>打卡护照 · 分享卡片</span><u>›</u>
        </button>
        <button class="mi" @click="todo('接入积分商城兑换')">
          <i class="ic gift"></i><span>积分兑换 · 严选好物</span><u>›</u>
        </button>
        <button class="mi" @click="todo('接入微信订阅消息')">
          <i class="ic bell"></i><span>开市提醒 · 订阅消息</span><u>›</u>
        </button>
        <button class="mi" @click="todo('我的兑换订单/核销记录')">
          <i class="ic list"></i><span>我的订单 · 核销记录</span><u>›</u>
        </button>
      </div>
    </section>

    <!-- demo 专用：把非用户端（商户核销 / 老板看板）收在这里 -->
    <section class="card staff">
      <h2>演示入口 · 非用户端</h2>
      <div class="muted staff-tip">
        正式版里这两块不在用户小程序：核销是<b>商户/工作人员端</b>，看板是<b>运营后台</b>。demo 为方便你一次看完，收到这里。
      </div>
      <div class="menu">
        <button class="mi" @click="nav('verify')">
          <i class="ic scan"></i><span>兑奖核销（集卡处视角）</span><u>›</u>
        </button>
        <button class="mi" @click="nav('boss')">
          <i class="ic chart"></i><span>运营看板（老板视角）</span><u>›</u>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.me {
  display: block;
  text-align: center;
}
.avatar {
  width: 56px;
  height: 56px;
  margin: 0 auto 8px;
  border-radius: 50%;
  background: var(--seal);
  color: #fff;
  font-family: 'Kaiti SC', KaiTi, STKaiti, serif;
  font-size: 26px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.me-info b {
  display: block;
  font-size: 20px;
  font-family: 'Kaiti SC', KaiTi, STKaiti, serif;
  color: var(--seal-dark);
  letter-spacing: 1px;
}
.me-info .muted {
  display: block;
  margin-top: 2px;
}
.me-nums {
  display: flex;
  justify-content: center;
  gap: 34px;
  margin: 14px 0 4px;
}
.me-nums b {
  display: block;
  font-size: 20px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.me-nums span {
  font-size: 11px;
  color: var(--muted);
}
.pend-tip {
  margin-top: 10px;
  border-top: 1px dashed var(--line);
  padding-top: 10px;
  font-size: 11px;
  color: #d9822b;
  line-height: 1.6;
}

.menu {
  display: flex;
  flex-direction: column;
}
.mi {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  padding: 12px 2px;
  border-bottom: 1px dashed var(--line);
  font-size: 14px;
  font-weight: 600;
}
.mi:last-child {
  border-bottom: none;
}
.mi:active {
  opacity: 0.6;
}
.mi span {
  flex: 1;
}
.mi u {
  text-decoration: none;
  color: var(--muted);
  font-size: 18px;
}
.ic {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  flex: none;
  background: rgba(200, 52, 43, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}
.ic.stamp::before {
  content: '印';
}
.ic.gift::before {
  content: '礼';
}
.ic.bell::before {
  content: '醒';
}
.ic.list::before {
  content: '单';
}
.ic.scan::before {
  content: '核';
}
.ic.chart::before {
  content: '盘';
}
.ic::before {
  font-family: 'Kaiti SC', KaiTi, STKaiti, serif;
  color: var(--seal);
  font-weight: 700;
}

.staff {
  border-style: dashed;
  border-color: var(--gold);
  background: rgba(184, 134, 45, 0.04);
}
.staff h2::before {
  background: var(--gold);
}
.staff-tip {
  line-height: 1.6;
  margin: -4px 0 6px;
}
.staff-tip b {
  color: var(--gold);
}
.staff .ic {
  background: rgba(184, 134, 45, 0.14);
}
.staff .ic::before {
  color: var(--gold);
}
</style>
