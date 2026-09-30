# jinjiangyanxuaun

晋江严选市集 · 追场集章 H5 demo（纯前端 mock，无后端）。

- 线上地址：https://yanxuan-market.pages.dev/
- 规划文档：`严选市集小程序-落地规划.md`
- 会议纪要：`严选市集小程序-会议纪要.md`

## 功能（demo 五页）

集章口径（会议纪要二收敛）：**消费驱动** —— 用户扫摊位聚合码付款 → 扫摊位静态码自助登记（付款截图 mock OCR 带出金额/单号）→ 章「预到账」→ 兑奖时集卡处扫核销码抽查一次放行到账。不演示「到场即盖章 / 付款即亮章」。

- 下一场：进行中多场并行展示（厦门宝龙 / 晋江宝龙双场同开）+ 下一场倒计时 + 巡回时间轴 + 一键导航
- 消费登记：多场切换、扫摊位码登记消费（上传截图 → mock OCR → 金额档位算章：满30得3章 / 满10得2章 / 其余1章）、单号去重
- 兑奖核销（集卡处视角）：出示/扫核销码 → 消费清单自动带出 → 现状逐笔人工核对 vs 扫码抽查耗时对比 → 一键确认到账
- 打卡护照：场次章三态（红=已核销到账 / 橙=登记待核验 / 灰=未登记）+ 积分 + 称号 + 成就徽章 + canvas 分享卡片
- 运营看板：客流漏斗 + 回头客 / 私域召回 + 核销效率对比（mock 数据）

## 本地运行

```bash
cd demo
npm install
npm run dev
```

## 部署（Cloudflare Pages）

```bash
cd demo
npm run build
npx wrangler pages deploy dist --project-name=yanxuan-market --branch=main
```
