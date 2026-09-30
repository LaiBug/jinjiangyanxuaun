<script setup>
import { ref, computed, provide } from 'vue'
import { state } from './store.js'
import NextMarket from './views/NextMarket.vue'
import Stalls from './views/Stalls.vue'
import Passport from './views/Passport.vue'
import Profile from './views/Profile.vue'
import Verify from './views/Verify.vue'
import Boss from './views/Boss.vue'

// 底部 tabBar 只放用户端 4 个一级入口（对齐微信小程序 tabBar 上限 5 的规范）
const tabs = [
  { id: 'next', label: '下一场' },
  { id: 'stalls', label: '消费登记' },
  { id: 'passport', label: '打卡护照' },
  { id: 'profile', label: '我的' },
]
// 全部页面（含非用户端：核销 / 看板，从「我的」入口进入，不占 tab）
const pages = {
  next: NextMarket,
  stalls: Stalls,
  passport: Passport,
  profile: Profile,
  verify: Verify,
  boss: Boss,
}
const cur = ref('next')
const curComp = computed(() => pages[cur.value])
// verify / boss 不在 tab 里，进入时让「我的」保持高亮
const activeTab = computed(() => (cur.value in pages && tabs.some((t) => t.id === cur.value) ? cur.value : 'profile'))

function nav(id) {
  cur.value = id
  window.scrollTo(0, 0)
}
provide('nav', nav)
</script>

<template>
  <div class="app">
    <header class="hd">
      <div class="brand">晋江严选<span class="sub"> · 追场集章</span></div>
      <div class="pill">{{ state.points }} 积分</div>
    </header>

    <main class="main">
      <component :is="curComp" />
    </main>

    <nav class="tabbar">
      <button v-for="t in tabs" :key="t.id" :class="{ on: activeTab === t.id }" @click="nav(t.id)">
        {{ t.label }}
      </button>
    </nav>

    <transition name="fade">
      <div v-if="state.toastText" class="toast">{{ state.toastText }}</div>
    </transition>
  </div>
</template>
