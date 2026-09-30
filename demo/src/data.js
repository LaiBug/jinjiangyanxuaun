// —— demo 阶段 mock 数据：场次 / 摊位全部使用严选市集真实场地风格命名 ——
// 正式版这些数据来自运营后台（markets / stalls 表），demo 先写死。
// 支持多场并行：status = done 已办完 / ongoing 进行中 / upcoming 预告 / tbd 筹备中

export const MARKETS = [
  { id: 'm001', name: '水头场', city: '南安', venue: '水头镇文化广场', start: '2026-09-12', end: '2026-09-14', status: 'done', specialty: '海鲜、紫菜、本地小吃' },
  { id: 'm002', name: '安海场', city: '晋江', venue: '安平桥景区广场', start: '2026-09-19', end: '2026-09-21', status: 'done', specialty: '土笋冻、捆蹄、菜粿' },
  { id: 'm006', name: '厦门宝龙场', city: '厦门', venue: '厦门宝龙广场', start: '2026-09-28', end: '2026-10-04', status: 'ongoing', specialty: '闽南小吃 · 严选礼盒' },
  { id: 'm007', name: '晋江宝龙场', city: '晋江', venue: '晋江宝龙广场', start: '2026-09-30', end: '2026-10-06', status: 'ongoing', specialty: '美食街 · 家居好物选' },
  { id: 'm003', name: '东石场', city: '晋江', venue: '东石镇滨海广场', start: '2026-10-03', end: '2026-10-05', status: 'upcoming', specialty: '海蛎煎、手打鱼丸' },
  { id: 'm004', name: '石井场', city: '南安', venue: '石井镇成功广场', start: '2026-10-17', end: '2026-10-19', status: 'upcoming', specialty: '糖饼、海味干货' },
  { id: 'm005', name: '青阳场', city: '晋江', venue: '青阳阳光广场', start: '', end: '', status: 'tbd', specialty: '面线糊、烧肉粽' },
]

// 摊位按 marketId 归属：每场一套摊，登记互不串场
// price = mock 客单价（演示 OCR 读出的付款金额），stamp 档位见 stampsForAmount
export const STALLS = [
  // 厦门宝龙场（进行中）
  { id: 'x01', marketId: 'm006', name: '沙茶面老档', type: 'food', mustTry: '沙茶面', tag: '厦门味', price: 18 },
  { id: 'x02', marketId: 'm006', name: '阿婆土笋冻', type: 'food', mustTry: '土笋冻', tag: '本地人认证', price: 15 },
  { id: 'x03', marketId: 'm006', name: '手打鱼丸·海蛎煎', type: 'food', mustTry: '鱼丸汤', tag: '现做现卖', price: 32 },
  { id: 'x04', marketId: 'm006', name: '严选好物·捆蹄礼盒', type: 'goods', mustTry: '安海捆蹄', tag: '严选自营', price: 68 },
  { id: 'x05', marketId: 'm006', name: '头水紫菜干货铺', type: 'goods', mustTry: '紫菜饼', tag: '可邮寄', price: 45 },
  // 晋江宝龙场（进行中）
  { id: 'j01', marketId: 'm007', name: '安海捆蹄现切摊', type: 'food', mustTry: '捆蹄', tag: '镇场之宝', price: 35 },
  { id: 'j02', marketId: 'm007', name: '炸菜粿·面线糊', type: 'food', mustTry: '炸菜粿', tag: '三十年老手艺', price: 12 },
  { id: 'j03', marketId: 'm007', name: '石井糖饼铺', type: 'food', mustTry: '花生糖饼', tag: '伴手礼', price: 16 },
  { id: 'j04', marketId: 'm007', name: '四果汤·甜水档', type: 'food', mustTry: '四果汤', tag: '解腻神器', price: 10 },
  { id: 'j05', marketId: 'm007', name: '严选家居好物馆', type: 'goods', mustTry: '联盟商户联展', tag: '家具/家电', price: 99 },
  // 东石场（预告·抢先看）
  { id: 's01', marketId: 'm003', name: '阿婆土笋冻', type: 'food', mustTry: '土笋冻', tag: '本地人认证', price: 15 },
  { id: 's02', marketId: 'm003', name: '东石海蛎煎', type: 'food', mustTry: '海蛎煎', tag: '现煎现吃', price: 25 },
  { id: 's03', marketId: 'm003', name: '渔港手打鱼丸', type: 'food', mustTry: '鱼丸汤', tag: '排队王', price: 20 },
  { id: 's04', marketId: 'm003', name: '菜粿面线糊老摊', type: 'food', mustTry: '炸菜粿', tag: '三十年老手艺', price: 12 },
  { id: 's05', marketId: 'm003', name: '严选好物·捆蹄礼盒', type: 'goods', mustTry: '安海捆蹄', tag: '严选自营', price: 68 },
  { id: 's06', marketId: 'm003', name: '石井紫菜干货铺', type: 'goods', mustTry: '头水紫菜', tag: '可邮寄', price: 45 },
]

// 金额档位 → 章数（消费驱动、多消费多得；细则待老板确认，demo 先按此演示）
export const STAMP_TIERS = [
  { min: 30, stamps: 3, label: '¥30 以上' },
  { min: 10, stamps: 2, label: '¥10 ~ 30' },
  { min: 0, stamps: 1, label: '¥10 以下' },
]

export function stampsForAmount(amount) {
  const tier = STAMP_TIERS.find((t) => amount >= t.min)
  return tier ? tier.stamps : 1
}

export function tierLabel(amount) {
  const tier = STAMP_TIERS.find((t) => amount >= t.min)
  return tier ? tier.label : ''
}

// 等级：点亮场次章数 → 称号（文档 3.1 身份层）
export function levelOf(litCount) {
  if (litCount >= 6) return '严选铁粉'
  if (litCount >= 3) return '闽南通'
  return '市集新手'
}

// 成就徽章（文档 3.1 身份层）
export const BADGES = [
  { id: 'b1', name: '闽南通', desc: '点亮任意 3 枚场次章', test: (n) => n >= 3 },
  { id: 'b2', name: '全勤追场', desc: '集齐全部 7 枚场次章', test: (n) => n >= MARKETS.length },
  { id: 'b3', name: '连续三场', desc: '连追 3 场市集（正式版自动记录）', test: () => false },
]

// 老板视角·客流漏斗（mock，文档 P0 页面四）
// 全部为小程序自有行为埋点，不依赖抖音开放接口
export const FUNNEL = [
  { label: '打开小程序查场次', value: 3200 },
  { label: '点导航 · 真到场', value: 860 },
  { label: '扫码登记消费', value: 540 },
  { label: '集满 3 章 · 回头客', value: 214 },
  { label: '私域可召回', value: 214 },
]

export const STATUS_TEXT = { done: '已办完', ongoing: '进行中', upcoming: '预告', tbd: '筹备中' }

export function marketById(id) {
  return MARKETS.find((m) => m.id === id)
}

// 进行中的场次（可多场并行）
export function ongoingMarkets() {
  return MARKETS.filter((m) => m.status === 'ongoing')
}

// 下一场（预告里最近的一场）
export function nextMarket() {
  return MARKETS.find((m) => m.status === 'upcoming')
}

// 集章页可切换的场次：进行中各场 + 下一场预告
export function switchableMarkets() {
  const next = nextMarket()
  return [...ongoingMarkets(), ...(next ? [next] : [])]
}

export function stallsOf(marketId) {
  return STALLS.filter((s) => s.marketId === marketId)
}

// 距收摊还有几天（进行中用）
export function daysLeft(m) {
  const end = new Date(m.end + 'T22:00:00').getTime()
  return Math.max(0, Math.ceil((end - Date.now()) / 86400000))
}
