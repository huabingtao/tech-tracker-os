/**
 * 面试题目数据定义
 * 本文件包含了各个技术领域的面试题库，以及根据技能名获取通用题目的逻辑。
 */

export interface Question {
  level: 'Beginner' | 'Intermediate' | 'Advanced'; // 题目难度级别
  text: string;                                     // 题目内容
  reference?: string;                               // 参考答案 (现在主要由 AI 评估，此字段可选)
}

/**
 * 预设的面试题库
 * key 为技能名称，value 为该技能下的题目数组
 */
export const INTERVIEW_QUESTIONS: Record<string, Question[]> = {
  'React Fiber Architecture': [
    { level: 'Beginner', text: '你能简单描述下 React 组件是如何渲染到屏幕上的吗？', reference: 'JSX -> Element -> Reconciler -> Renderer -> DOM.' },
    { level: 'Beginner', text: 'React 中的 key 有什么作用？为什么不建议用 index？', reference: '核心点：Diff 算法通过 key 识别节点稳定性，index 导致错位和性能下降。' },
    { level: 'Beginner', text: 'State 和 Props 的区别是什么？', reference: '核心点：Props 是外部传入的只读配置；State 是组件内部管理的可变状态。' },
    { level: 'Beginner', text: '什么是受控组件和非受控组件？', reference: '核心点：受控组件由 React state 驱动；非受控组件由 DOM 自身维护（如 ref）。' },
    { level: 'Beginner', text: 'React 生命周期的主要阶段有哪些？', reference: '核心点：Mounting, Updating, Unmounting。' },
    { level: 'Beginner', text: 'useEffect 的第二个参数（依赖数组）起什么作用？', reference: '核心点：控制副作用的执行频率，空数组仅挂载时运行，不传则每次更新运行。' },
    { level: 'Intermediate', text: '为什么要引入 Fiber？解决什么痛点？', reference: '核心点：Stack Reconciler 阻塞主线程；Fiber 实现了增量渲染 and 优先级调度。' },
    { level: 'Intermediate', text: '什么是 React Context？它解决了什么问题？', reference: '核心点：解决 Prop Drilling 问题，实现跨层级数据共享。' },
    { level: 'Intermediate', text: 'useMemo 和 useCallback 有什么区别？', reference: '核心点：useMemo 缓存计算结果；useCallback 缓存函数引用。' },
    { level: 'Intermediate', text: 'React 如何 handle 合成事件（SyntheticBaseEvent）？', reference: '核心点：事件委托到根节点，跨浏览器兼容，对象池化优化。' },
    { level: 'Intermediate', text: '什么是高阶组件 (HOC)？请举个例子。', reference: '核心点：接收组件返回新组件的纯函数。如权限校验、日志打点。' },
    { level: 'Intermediate', text: 'React.memo 的工作原理是什么？', reference: '核心点：浅比较 Props 防止不必要的重渲染。' },
    { level: 'Advanced', text: 'Fiber 架构中的“双缓存”是如何协作的？', reference: '核心点：current 树和 workInProgress 树切换，保证交互流畅。' },
    { level: 'Advanced', text: '请解释 Concurrent Mode (并发模式) 的核心原理。', reference: '核心点：可中断渲染、任务优先级（Lane 模型）、数据一致性。' },
    { level: 'Advanced', text: 'Suspense 的底层实现原理是什么？', reference: '核心点：利用 Promise throw 机制，结合 Error Boundary 捕获。' },
    { level: 'Advanced', text: '什么是 Lane 模型？它比之前的 ExpirationTime 优在哪里？', reference: '核心点：位掩码表示优先级，支持更细粒度的任务解耦和合并。' },
    { level: 'Advanced', text: '如何优化超大型 React 应用的性能？', reference: '核心点：代码分割、虚拟列表、状态下放、避免过度使用 Context。' },
    { level: 'Advanced', text: 'Server Components 和 SSR 的本质区别是什么？', reference: '核心点：RSC 只在服务端运行，不发送 JS 到客户端，减少 Bundle。' },
    { level: 'Advanced', text: '自定义 Hooks 如何实现逻辑复用？', reference: '核心点：内部调用原子 Hooks，符合组合优于继承原则。' },
    { level: 'Advanced', text: 'React 调度器 (Scheduler) 的工作循环是如何实现的？', reference: '核心点：MessageChannel 模拟宏任务，基于 5ms 的帧时间切片。' }
  ],
  'Vue 3 Reactivity (Proxy)': [
    { level: 'Beginner', text: 'Vue 3 页面自动更新的原理是什么？', reference: '核心点：Proxy 拦截 set/get，追踪依赖并触发 Effect。' },
    { level: 'Beginner', text: 'v-if 和 v-show 的区别是什么？', reference: '核心点：v-if 是 DOM 销毁重建；v-show 是切换 display 样式。' },
    { level: 'Beginner', text: 'Vue 3 组合式 API (Composition API) 相比 Options API 有什么优势？', reference: '核心点：更好的逻辑组织、类型推导和代码复用。' },
    { level: 'Beginner', text: 'watch 和 computed 的区别？', reference: '核心点：computed 带缓存、用于计算值；watch 用于执行异步或开销大的副作用。' },
    { level: 'Beginner', text: 'v-for 为什么要绑定 key？', reference: '核心点：辅助 Diff 算法高效更新 DOM。' },
    { level: 'Beginner', text: 'Vue 3 中如何获取 DOM 元素？', reference: '核心点：使用 ref() 声明同名变量并在挂载后访问。' },
    { level: 'Intermediate', text: 'reactive 和 ref 的实现原理区别？', reference: '核心点：reactive 基于 Proxy；ref 基于对象的 value getter/setter。' },
    { level: 'Intermediate', text: 'Vue 3 的生命周期钩子发生了哪些变化？', reference: '核心点：改为 setup 内部的 onX 形式，去掉了 beforeCreate/created。' },
    { level: 'Intermediate', text: '什么是 Teleport 组件？', reference: '核心点：将子节点挂载到应用之外的 DOM 节点（如全局弹窗）。' },
    { level: 'Intermediate', text: 'defineProps 和 defineEmits 的作用？', reference: '核心点：在 setup 中定义组件接口，编译器宏无需导入。' },
    { level: 'Intermediate', text: 'Vue 3 如何优化长列表渲染？', reference: '核心点：浅层响应式 shallowRef、虚拟滚动、v-memo。' },
    { level: 'Intermediate', text: '什么是 Fragment？Vue 3 为什么支持多个根节点？', reference: '核心点：底层虚拟 DOM 支持无根节点，减少 DOM 层级。' },
    { level: 'Advanced', text: 'Vue 3 的响应式系统如何处理深度代理？', reference: '核心点：按需代理，只有访问到深层属性时才包装 Proxy。' },
    { level: 'Advanced', text: '请描述 Vue 3 的 Diff 算法（最长递增子序列）。', reference: '核心点：双端对比 + 静态标记优化 + 最小移动次数算法。' },
    { level: 'Advanced', text: '什么是编译器优化 (PatchFlag, Hoisting)？', reference: '核心点：静态提升、预字符串化、标记动态节点。' },
    { level: 'Advanced', text: 'watchEffect 和 watch 的本质区别？', reference: '核心点：watchEffect 自动收集依赖、立即执行；watch 需指定来源、支持新旧值。' },
    { level: 'Advanced', text: 'Vue 3 的依赖收集过程（track/trigger）？', reference: '核心点：全局 targetMap -> Map -> Set 存储副作用。' },
    { level: 'Advanced', text: '如何实现一个简易版的 reactive？', reference: '核心点：基于 Proxy 的 get/set 结合 track/trigger 逻辑。' },
    { level: 'Advanced', text: 'Vue 3 的调度系统 (Job Queue) 是如何保证更新效率的？', reference: '核心点：Promise.resolve 微任务异步刷新队列，去重 Job。' },
    { level: 'Advanced', text: 'SSR 场景下 Vue 的响应式会有什么问题？', reference: '核心点：服务端不需要响应式，只需序列化状态，需防止跨请求状态污染。' }
  ],
  'Nginx Reverse Proxy & Load Balancing': [
    { level: 'Beginner', text: 'Nginx 是什么？', reference: '核心点：高性能 HTTP 服务器、反向代理、邮件代理服务器。' },
    { level: 'Beginner', text: '如何启动和停止 Nginx？', reference: '核心点：nginx 命令，-s stop/reload。' },
    { level: 'Beginner', text: 'Nginx 配置文件的默认位置通常在哪？', reference: '核心点：/etc/nginx/nginx.conf 或 /usr/local/nginx/conf。' },
    { level: 'Beginner', text: '什么是 404 和 502 错误？', reference: '核心点：404 资源未找到；502 后端服务无响应（网关错误）。' },
    { level: 'Beginner', text: 'root 和 alias 的区别？', reference: '核心点：root 拼路径，alias 替换路径。' },
    { level: 'Beginner', text: '如何设置静态资源缓存？', reference: '核心点：expires 指令或 add_header Cache-Control。' },
    { level: 'Intermediate', text: '什么是反向代理？如何配置 proxy_pass？', reference: '核心点：隐藏后端服务器，转发请求。' },
    { level: 'Intermediate', text: 'Nginx 支持哪些负载均衡策略？', reference: '核心点：轮询（默认）、权重、IP Hash、最少连接。' },
    { level: 'Intermediate', text: 'Master-Worker 进程模型是什么？', reference: '核心点：Master 负责配置和管理，Worker 负责处理请求，利用多核。' },
    { level: 'Intermediate', text: '如何配置 Nginx 支持 HTTPS？', reference: '核心点：listen 443 ssl，配置 ssl_certificate 和 key。' },
    { level: 'Intermediate', text: 'location 匹配的优先级？', reference: '核心点：精确匹配 (=) > 前缀匹配 (^~) > 正则 (~/~*) > 通用匹配。' },
    { level: 'Intermediate', text: '什么是 Gzip 压缩？如何开启？', reference: '核心点：gzip on; 减少带宽消耗。' },
    { level: 'Advanced', text: 'Nginx 解决大文件断点续传的原理？', reference: '核心点：Range 请求头支持。' },
    { level: 'Advanced', text: '什么是惊群效应？Nginx 如何解决？', reference: '核心点：accept_mutex 锁机制。' },
    { level: 'Advanced', text: '如何利用 Nginx 进行蓝绿发布/灰度发布？', reference: '核心点：upstream 权重或 Lua 动态切换。' },
    { level: 'Advanced', text: 'Nginx 的事件驱动模型（epoll）为什么快？', reference: '核心点：非阻塞 I/O，单线程多路复用，避免上下文切换开销。' },
    { level: 'Advanced', text: '什么是变量捕获？如何在 Nginx 中使用正则表达式？', reference: '核心点：rewrite 或 location 中的 () 配合 $1, $2。' },
    { level: 'Advanced', text: '如何配置 Nginx 防盗链？', reference: '核心点：valid_referers 指令。' },
    { level: 'Advanced', text: 'Nginx 如何处理 C10K 问题？', reference: '核心点：基于事件模型，极低的内存占用和高并发连接能力。' },
    { level: 'Advanced', text: '什么是 HTTP/2 Server Push？Nginx 支持吗？', reference: '核心点：http2_push 指令，减少往返次数。' }
  ],
  'TypeScript Advanced Types': [
    { level: 'Beginner', text: 'TypeScript 的最大价值是什么？', reference: '核心点：静态类型检查、增强代码健壮性和 IDE 体验。' },
    { level: 'Beginner', text: 'any, unknown, never 的区别？', reference: '核心点：any 跳过检查；unknown 安全的顶级类型；never 代表不可能发生的值。' },
    { level: 'Beginner', text: '如何定义一个数组类型？', reference: '核心点：number[] 或 Array<number>。' },
    { level: 'Beginner', text: '枚举 (Enum) 的优缺点？', reference: '核心点：增加代码可读性；缺点是编译后会生成额外的运行时对象。' },
    { level: 'Beginner', text: '联合类型 (Union) 和 交叉类型 (Intersection)？', reference: '核心点：| 代表或，& 代表并。' },
    { level: 'Beginner', text: '什么是类型断言 (Type Assertion)？', reference: '核心点：as 语法，明确告诉编译器“我知道这是什么类型”。' },
    { level: 'Intermediate', text: '什么是泛型约束 (Generic Constraints)？', reference: '核心点：T extends K，限制泛型的范围。' },
    { level: 'Intermediate', text: 'keyof 和 typeof 操作符的用法？', reference: '核心点：keyof 获取键名联合；typeof 获取变量的类型。' },
    { level: 'Intermediate', text: '常用的内置工具类型有哪些？', reference: '核心点：Partial, Required, Readonly, Pick, Record。' },
    { level: 'Intermediate', text: '什么是索引签名 (Index Signature)？', reference: '核心点：{[key: string]: any} 定义未知属性的对象。' },
    { level: 'Intermediate', text: '映射类型 (Mapped Types) 是什么？', reference: '核心点：从一个类型推导生成另一个类型。' },
    { level: 'Intermediate', text: '什么是类型守卫 (Type Guard)？', reference: '核心点：typeof, instanceof 或 is 关键字自定义守卫。' },
    { level: 'Advanced', text: '解释 infer 关键字。', reference: '核心点：在条件类型中推断待定类型（如提取函数返回值）。' },
    { level: 'Advanced', text: '如何实现一个 ReturnType 工具类型？', reference: '核心点：T extends (...args: any) => infer R ? R : any' },
    { level: 'Advanced', text: '什么是条件类型 (Conditional Types)？', reference: '核心点：T extends U ? X : Y 逻辑判断。' },
    { level: 'Advanced', text: '什么是分布式条件类型？如何触发？', reference: '核心点：当 T 是联合类型时，条件类型会分发到每个成员。' },
    { level: 'Advanced', text: '如何利用模板字面量类型实现路径解析？', reference: '核心点：`${A}.${B}` 语法。' },
    { level: 'Advanced', text: '如何手动实现 Exclude 和 Omit？', reference: '核心点：基于 T extends U ? never : T。' },
    { level: 'Advanced', text: '如何解决 TypeScript 递归深度限制？', reference: '核心点：尾递归优化或拆分辅助类型。' },
    { level: 'Advanced', text: '什么是 Branded Types (标称类型)？', reference: '核心点：通过私有属性或特定字段模拟名义类型。' }
  ],
  'CI/CD with GitHub Actions': [
    { level: 'Beginner', text: 'CI/CD 的全称和意义？', reference: '核心点：持续集成、持续部署；缩短反馈周期，保证质量。' },
    { level: 'Beginner', text: 'YAML 文件在 GitHub Actions 中代表什么？', reference: '核心点：定义 Workflow 的配置文件。' },
    { level: 'Beginner', text: '什么是 GitHub Actions 的触发器 (Events)？', reference: '核心点：push, pull_request, schedule 等。' },
    { level: 'Beginner', text: 'Step, Job, Workflow 的关系？', reference: '核心点：层级递进关系，一个 Workflow 包含多个 Job，Job 包含多个 Step。' },
    { level: 'Beginner', text: '如何在 Actions 中打印环境变量？', reference: '核心点：echo "$VAR_NAME" 或 ${{ env.VAR_NAME }}。' },
    { level: 'Beginner', text: '什么是 GitHub Marketplace？', reference: '核心点：获取他人编写好的 Actions（如 checkout, setup-node）。' },
    { level: 'Intermediate', text: '如何管理 Secrets 敏感信息？', reference: '核心点：在 Repo Settings 中配置，代码中 ${{ secrets.NAME }}。' },
    { level: 'Intermediate', text: 'Job 之间的依赖关系如何设置？', reference: '核心点：使用 needs 关键字。' },
    { level: 'Intermediate', text: '什么是 Matrix 策略 (Matrix Strategy)？', reference: '核心点：通过一组变量在多个操作系统或语言版本上跑任务。' },
    { level: 'Intermediate', text: '如何配置多环境部署 (Dev/Staging/Prod)？', reference: '核心点：利用 Environments 特性结合权限审批。' },
    { level: 'Intermediate', text: 'Artifacts 和 Cache 的区别？', reference: '核心点：Artifacts 用于作业间传递数据；Cache 用于跨流水线加速。' },
    { level: 'Intermediate', text: '如何实现定时任务流水线？', reference: '核心点：on: schedule 配合 cron 表达式。' },
    { level: 'Advanced', text: '如何编写一个可复用的复合 Action (Composite Action)？', reference: '核心点：将多个 Step 打包成一个 action.yml。' },
    { level: 'Advanced', text: '如何优化并行构建以降低成本？', reference: '核心点：concurrency 限制、精简依赖安装、条件分支。' },
    { level: 'Advanced', text: '什么是 Self-hosted Runner？', reference: '核心点：在自己的机器上运行 Actions，支持内网访问和自定义环境。' },
    { level: 'Advanced', text: '如何实现在 Actions 失败时发送 Slack/飞书通知？', reference: '核心点：if: failure() 条件判断配合相关通知 Action。' },
    { level: 'Advanced', text: '什么是 OIDC 认证？在 Actions 中有什么好处？', reference: '核心点：无需存储长效密钥，通过短效 Token 访问云资源（如 AWS/Azure）。' },
    { level: 'Advanced', text: '如何配置缓存以显著加速 node_modules 安装？', reference: '核心点：actions/cache 或 setup-node 自身的 cache 参数。' },
    { level: 'Advanced', text: '如何实现基于标签的发布流水线？', reference: '核心点：on: push: tags。' },
    { level: 'Advanced', text: '如何调试失败的 Actions 流水线？', reference: '核心点：启用 debug logging、检查 Step Log、使用 tmate 交互式调试。' }
  ]
};

/**
 * 当某个技能点没有预设题目时，生成一套通用题目
 * @param skillName 技能点名称
 * @returns 包含初中高三个级别的题目数组
 */
export const getGenericQuestions = (skillName: string): Question[] => {
  const q: Question[] = [];
  // 生成 7 道初级题
  for(let i=0; i<7; i++) q.push({ level: 'Beginner', text: `[B${i+1}] 请描述 ${skillName} 的基本概念。`, reference: '基础定义。' });
  // 生成 7 道中级题
  for(let i=0; i<7; i++) q.push({ level: 'Intermediate', text: `[I${i+1}] ${skillName} 如何解决复杂问题？`, reference: '中级应用。' });
  // 生成 6 道高级题
  for(let i=0; i<6; i++) q.push({ level: 'Advanced', text: `[A${i+1}] ${skillName} 的底层优化策略？`, reference: '高级原理。' });
  return q;
};
