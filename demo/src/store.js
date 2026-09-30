import { reactive } from 'vue'
import { MARKETS, levelOf } from './data.js'

// 集章护照状态：localStorage 持久化，刷新/重开链接章不丢（demo 无后端）
const KEY = 'yx_passport_v2'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

const saved = load()

export const state = reactive({
  stallStamps: saved.stallStamps || {}, // { stallId: 时间戳 }
  marketStamps: saved.marketStamps || {}, // { marketId: 时间戳 } 场次到场章
  points: saved.points || 0,
  toastText: '',
})

function persist() {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      stallStamps: state.stallStamps,
      marketStamps: state.marketStamps,
      points: state.points,
    }),
  )
}

let toastTimer = null
export function toast(msg) {
  state.toastText = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    state.toastText = ''
  }, 1800)
}

// 摊位章：模拟扫摊位二维码盖章，防重（正式版由后端唯一约束保证）
export function stampStall(stall) {
  if (state.stallStamps[stall.id]) {
    toast('这个摊位已经盖过章啦')
    return false
  }
  state.stallStamps[stall.id] = Date.now()
  state.points += 10
  persist()
  toast('印章点亮 · 积分 +10')
  return true
}

// 场次章：到场打卡章，模拟 LBS 定位打卡；多场并行时各场独立
export function stampMarket(market) {
  if (state.marketStamps[market.id]) {
    toast(market.name + '的到场章已经集过啦')
    return false
  }
  state.marketStamps[market.id] = Date.now()
  state.points += 20
  persist()
  toast(market.name + ' 到场章落袋 · 积分 +20')
  return true
}

export function litMarkets() {
  return MARKETS.filter((m) => state.marketStamps[m.id])
}

export function litCount() {
  return litMarkets().length
}

export function stallStampCount() {
  return Object.keys(state.stallStamps).length
}

export function levelTitle() {
  return levelOf(litCount())
}
