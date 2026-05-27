# 🌐 Tech Tracker OS (技术追踪系统)

`Tech Tracker OS` 是一个专为高级开发者设计的交互式技术学习、面试评估与基础设施管理系统。它融合了**现代前端核心原理实验室**、**基于 AI (支持 DeepSeek) 的面试沙盒**以及**间隔复习 (SRS) 算法**，帮助开发者系统性地掌握高级技术概念，评估自身实力，并提供极具科技感的多语言可视化面板。

---

## 🌟 核心功能特性

### 1. 📊 核心学习指标与技能矩阵雷达图 (Dashboard)
- **多维度数据可视化**：采用 `Recharts` 绘制多维度技能矩阵雷达图，直观展现用户在前端 (Frontend) 与运维部署 (DevOps) 领域的熟练度及知识差距 (Knowledge Gap)。
- **间隔复习机制 (SRS)**：集成经典 **SuperMemo-2 (SM-2) 间隔复习算法模型**。根据用户反馈的熟练度及掌握质量，动态计算下一次最佳复习日期，并在仪表盘中按优先级智能生成“今日待复习”的技能清单。
- **全局统计卡片**：实时展示总技能节点数、已掌握技能数、复习连击天数以及全局系统准备度 (System Readiness) 百分比。

### 2. 🧪 原理实验室 (Labs)
- **Vue 3 响应式模拟器 (Proxy)**：
  - 基于 ES6 `Proxy` 原生实现响应式代理。
  - 动态跟踪依赖收集 (`track`) 与派发更新 (`trigger`) 的执行流。
  - 提供可视化的状态树编辑面板与实时拦截日志输出，直观对比 Vue 2 `Object.defineProperty` 与 Vue 3 `Proxy` 的原理和面试核心考点。
- **React Hook 执行流模拟器**：
  - 模拟 `useInterval` 等实验，帮助开发者观察 Hook 闭包陷阱、Fiber 节点状态变化与组件生命周期的渲染流程。

### 3. 🤖 AI 面试沙盒 (Interview Sandbox)
- **DeepSeek 驱动的智能模拟面试**：
  - 调用 DeepSeek (采用 `deepseek-v4-flash` 模型) 对用户的文字回答进行高标准的资深面试官评估。
  - 支持 **SSE (Server-Sent Events) 流式内容传输**，给用户极致流畅的打字机交互体验。
  - 能够自动从 AI 的评审结果中提取分数标记 `[SCORE:数字]`，并自动实时同步更新本地的技能熟练度。
- **面试题矩阵配置**：
  - 针对每个核心技能点提供分级的面试题集，支持用户直接修改或自定义面试题目与期望等级。
  - 提供详细的回答记录和复盘点评 (Insight)。

### 4. 🎛️ 运维基础设施控制台 (DevOps Console)
- **节点状态监控**：实时展示 Nginx Gateway、Docker Registry、GitHub Runner 等关键运维节点的状态 (在线、待机、活跃) 和 CPU 负载。
- **流量监控占位**：预留全球流量监控和数据可视化接口。

### 5. 🌐 国际化与响应式设计
- **中英双语支持**：使用 `next-intl` 实现中英双语 (EN/ZH) 动态路由与多语言配置无缝切换。
- **Cyberpunk / Geek 暗黑设计主题**：采用极富科技感的霓虹绿 (Matrix Green)、电光蓝、高对比度暗黑背景以及流畅的微动画，打造极致的交互体验。

---

## 🛠️ 技术栈与依赖

- **框架**: Next.js 14.2.3 (App Router)
- **前端库**: React 18, Tailwind CSS / Vanilla CSS
- **可视化**: Recharts (图表库)
- **图标**: Lucide React
- **国际化**: `next-intl` (多语言方案)
- **AI 接口**: DeepSeek API (支持 SSE 流式返回)
- **测试**: Vitest + JSDOM + Testing Library
- **代码规范**: ESLint + TypeScript

---

## 📁 目录结构

```text
tech-tracker-os/
├── messages/               # 多语言翻译文件 (en.json, zh.json)
├── src/
│   ├── app/                # Next.js 路由与 API
│   │   ├── [locale]/       # 国际化区域路由 (devops, interview, labs)
│   │   └── api/            # 后端 API (DeepSeek AI 面试及评估接口)
│   ├── components/         # 可复用 UI 与图表组件 (charts, dashboard, layout)
│   ├── core/               # 核心工具类 (如 SRS 算法核心逻辑)
│   ├── data/               # 静态初始数据 (技能树与面试题集)
│   ├── i18n/               # next-intl 相关配置
│   ├── navigation.ts       # 国际化路由跳转辅助
│   ├── styles/             # 全局 CSS 样式配置
│   └── types/              # TypeScript 类型声明
├── tests/                  # 测试用例 (单元测试 & 端到端测试)
├── next.config.mjs         # Next.js 配置文件
├── tsconfig.json           # TypeScript 配置文件
├── vitest.config.ts        # Vitest 测试配置文件
└── package.json            # 依赖及脚本定义
```

---

## 🚀 快速开始

### 1. 克隆并安装依赖
```bash
git clone git@github.com:huabingtao/tech-tracker-os.git
cd tech-tracker-os
npm install
```

### 2. 配置环境变量
在项目根目录下创建 `.env.local` 文件，并配置你的 DeepSeek API 密钥：
```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 3. 运行本地开发服务器
```bash
npm run dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始使用。

### 4. 运行测试
```bash
npm run test
```

### 5. 构建生产版本
```bash
npm run build
npm run start
```

---

## 🤝 参与贡献
欢迎提交 Issue 和 PR！请在开发前确认符合以下规范：
- 编写规范的 TypeScript 类型
- 保证多语言 (EN/ZH) 配置文件同步更新
- 本地通过 `npm run lint` 和 `npm run test`

---

## 📄 开源协议
本项目基于 [MIT](LICENSE) 协议开源。
