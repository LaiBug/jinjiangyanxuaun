<script setup>
import { ref, computed } from 'vue'
import { state } from './store.js'
import NextMarket from './views/NextMarket.vue'
import Stalls from './views/Stalls.vue'
import Passport from './views/Passport.vue'
import Boss from './views/Boss.vue'

const tabs = [
  { id: 'next', label: '下一场', comp: NextMarket },
  { id: 'stalls', label: '本场集章', comp: Stalls },
  { id: 'passport', label: '打卡护照', comp: Passport },
  { id: 'boss', label: '运营看板', comp: Boss },
]
const cur = ref('next')
const curComp = computed(() => tabs.find((t) => t.id === cur.value).comp)
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
      <button v-for="t in tabs" :key="t.id" :class="{ on: cur === t.id }" @click="cur = t.id">
        {{ t.label }}
      </button>
    </nav>

    <transition name="fade">
      <div v-if="state.toastText" class="toast">{{ state.toastText }}</div>
    </transition>
  </div>
</template>
