<script setup>
import { ref, computed } from 'vue'
import { switchableMarkets, stallsOf, STATUS_TEXT } from '../data.js'
import { state, stampStall } from '../store.js'

const markets = switchableMarkets()
const cur = ref(markets[0].id)
const market = computed(() => markets.find((m) => m.id === cur.value))
const stalls = computed(() => stallsOf(cur.value))

const popId = ref('')
function onStamp(s) {
  if (stampStall(s)) {
    popId.value = s.id
    setTimeout(() => (popId.value = ''), 700)
  }
}
const stamped = (s) => !!state.stallStamps[s.id]
const litCount = computed(() => stalls.value.filter(stamped).length)
</script>

<template>
  <div>
    <div class="note">
      demo 说明：点「盖章」模拟扫摊位二维码；正式版游客扫桌贴码触发、后端防重，章自动落进护照。多场同开时各场摊位独立集章。
    </div>

    <!-- 多场并行切换 -->
    <div class="chips">
      <button v-for="m in markets" :key="m.id" class="chip" :class="{ on: cur === m.id }" @click="cur = m.id">
        {{ m.venue }}<u>{{ STATUS_TEXT[m.status] }}</u>
      </button>
    </div>

    <section class="card head">
      <h2>{{ market.venue }} · 摊位集章</h2>
      <div class="prog">
        <div class="prog-bar"><i :style="{ width: (litCount / stalls.length) * 100 + '%' }"></i></div>
        <span>已亮 {{ litCount }}/{{ stalls.length }}</span>
      </div>
      <div class="muted">{{ market.city }} · {{ market.specialty }} · 集满美食章服务台换严选手信（奖品由商户出）</div>
    </section>

    <section v-for="s in stalls" :key="s.id" class="card stall">
      <div class="info">
        <div class="name">
          <span class="tag">{{ s.type === 'food' ? '美食' : '严选好物' }}</span>
          {{ s.name }}
        </div>
        <div class="muted">必试：{{ s.mustTry }} · {{ s.tag }}</div>
      </div>
      <div v-if="stamped(s)" class="seal mini" :class="{ pop: popId === s.id }">
        <span class="s-name">已盖</span>
      </div>
      <button v-else class="btn ghost stamp-btn" @click="onStamp(s)">盖章</button>
    </section>
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
.stamp-btn {
  flex: none;
  padding: 8px 20px;
}
</style>
