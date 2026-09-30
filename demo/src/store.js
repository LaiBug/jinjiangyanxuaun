import { reactive } from 'vue'
import { MARKETS, levelOf, stampsForAmount } from './data.js'

// 集章护照状态：localStorage 持久化（demo 无后端）
// v3 口径（会议纪要二）：消费驱动 —— 用户自助登记（章预到账/待核验）→ 兑奖扫码抽查 → 确认到账
const KEY = 'yx_passport_v3'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

const saved = load()

export const state = reactive({
  // 消费登记记录：{ id, stallId, marketId, amount, stamps, receiptNo, time, status:'pending'|'verified' }
  records: saved.records || [],
  points: saved.points || 0,
  toastText: '',
})

function persist() {
  localStorage.setItem(KEY, JSON.stringify({ records: state.records, points: state.points }))
}

let toastTimer = null
export function toast(msg) {
  state.toastText = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    state.toastText = ''
  }, 2200)
}

// 用户自助登记一笔消费（扫摊位静态码 + 付款截图 OCR）→ 章"预到账"
export function registerConsumption(stall, amount) {
  if (recordByStall(stall.id)) {
    toast('这个摊位已经登记过一笔啦（单号去重）')
    return null
  }
  const rec = {
    id: 'r' + Date.now(),
    stallId: stall.id,
    stallName: stall.name,
    marketId: stall.marketId,
    amount,
    stamps: stampsForAmount(amount),
    receiptNo: 'SQB' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10),
    time: Date.now(),
    status: 'pending',
  }
  state.records.push(rec)
  persist()
  toast('登记成功 · ' + rec.stamps + ' 枚章预到账，待兑奖核验')
  return rec
}

// 兑奖关口：工作人员扫核销码后一键确认到账（抽查放行）→ 发积分
export function verifyAll() {
  const pendings = state.records.filter((r) => r.status === 'pending')
  if (!pendings.length) {
    toast('没有待核验的消费登记')
    return null
  }
  let stamps = 0
  pendings.forEach((r) => {
    r.status = 'verified'
    stamps += r.stamps
  })
  state.points += stamps * 10
  persist()
  toast('核销放行 · ' + stamps + ' 枚章到账，积分 +' + stamps * 10)
  return { count: pendings.length, stamps }
}

export function recordByStall(stallId) {
  return state.records.find((r) => r.stallId === stallId)
}

export function recordsOfMarket(marketId) {
  return state.records.filter((r) => r.marketId === marketId)
}

export function pendingRecords() {
  return state.records.filter((r) => r.status === 'pending')
}

// 场次章状态：该场有已核销记录=亮章；仅有待核验=预亮；无=灰
export function marketStampStatus(marketId) {
  const recs = recordsOfMarket(marketId)
  if (recs.some((r) => r.status === 'verified')) return 'verified'
  if (recs.length) return 'pending'
  return null
}

export function verifiedStamps() {
  return state.records.filter((r) => r.status === 'verified').reduce((s, r) => s + r.stamps, 0)
}

export function litCount() {
  return MARKETS.filter((m) => marketStampStatus(m.id) === 'verified').length
}

export function levelTitle() {
  return levelOf(litCount())
}
