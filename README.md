# jinjiangyanxuaun

晋江严选市集 · 追场集章 H5 demo（纯前端 mock，无后端）。

- 线上地址：https://yanxuan-market.pages.dev/
- 规划文档：`严选市集小程序-落地规划.md`

## 功能（demo 四页）

- 下一场：进行中多场并行展示（厦门宝龙 / 晋江宝龙双场同开）+ 下一场倒计时 + 巡回时间轴 + 到场盖章
- 本场集章：多场切换、摊位盖章（模拟扫桌贴码）、防重、进度
- 打卡护照：场次章 / 摊位章 / 积分 / 称号 / 成就徽章 / canvas 分享卡片
- 运营看板：客流漏斗 + 回头客 / 私域召回 mock 数据

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
