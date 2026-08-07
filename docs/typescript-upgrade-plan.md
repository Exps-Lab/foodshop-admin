# Foodshop Admin TypeScript 升级方案

## 项目现状分析

### 当前技术栈
- Vue 3.2.25+ (Composition API)
- Vite 2.9+
- Pinia 2.0.14+
- Vue Router 4.0.15+
- Axios 1.7+
- Arco Design Vue 2.29+
- ESLint 8.31+
- Less 4.1+

### 项目规模
- API 模块：5个（common, coupon, goods, login, menu, shop）
- 页面模块：8个（dashboard, goods, layout, login, menu, noAuth, shop, userList）
- 核心工具：request.js, auth.js, SSE.js 等
- 状态管理：2个 store（auth.js, user.js）

## 升级原则

1. **严格保持业务逻辑不变** - 仅添加类型约束，不修改任何业务逻辑
2. **渐进式升级** - 分阶段进行，确保每个阶段可验证
3. **版本兼容性优先** - 使用与当前包版本兼容的 TypeScript 生态
4. **疑问交互** - 遇到不确定的地方主动询问确认

## 升级阶段

### 阶段一：基础设施准备（预计 0.5 天）

#### 1.1 安装 TypeScript 相关依赖
```bash
npm install -D typescript@~5.3.0
npm install -D @types/node@^18.0.0
npm install -D @types/js-cookie@^3.0.0
npm install -D @types/nprogress@^0.2.0
```

**版本选择说明：**
- TypeScript 5.3.x：稳定版本，与 Vue 3.2 兼容性良好
- @types/node 18.x：匹配项目成熟度，不过度追求新版本

#### 1.2 创建 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@api/*": ["src/api/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@pages/*": ["src/pages/*"],
      "@store/*": ["src/store/*"],
      "@router/*": ["src/router/*"]
    },
    
    /* Vue support */
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 1.3 创建 tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.*", "viteConf/**/*"]
}
```

#### 1.4 创建 src/vite-env.d.ts
```typescript
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

### 阶段二：Vite 配置升级（预计 0.5 天）

#### 2.1 升级 vite.config.js → vite.config.ts
- 重命名文件为 `vite.config.ts`
- 添加类型注解
- 保持所有配置逻辑不变

#### 2.2 更新 viteConf/index.js → viteConf/index.ts
- 转换配置文件为 TypeScript
- 添加类型定义

#### 2.3 更新 ESLint 配置
```javascript
module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "vue",
    "@typescript-eslint"
  ],
  "rules": {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'camelcase': 'off',
    'vue/no-mutating-props': 'off',
    'no-case-declarations': 'off',
    'no-new': 'off',
    'vue/no-setup-props-destructure': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn'
  }
}
```

#### 2.4 安装 ESLint TypeScript 支持
```bash
npm install -D @typescript-eslint/parser@^6.0.0
npm install -D @typescript-eslint/eslint-plugin@^6.0.0
```

### 阶段三：核心工具层升级（预计 1 天）

#### 3.1 升级 src/utils/request.js → request.ts
**需要确认的问题：**
1. `needLoading` 参数是否应该加入 axios 的 Config 类型扩展？
2. API 响应的统一结构是否需要定义 interface？

**升级内容：**
- 添加 axios 请求配置类型扩展
- 定义 API 响应基础类型
- 为 Loading 相关逻辑添加类型

#### 3.2 升级 src/utils/index.js → index.ts
- 添加函数参数和返回值类型
- 保持所有工具函数逻辑不变

#### 3.3 升级 src/utils/login_token.js → login_token.ts
- 添加 token 操作类型定义

#### 3.4 升级 src/utils/SSE.js → SSE.ts
- 添加 SSE 相关类型定义

#### 3.5 升级 src/auth.js → auth.ts
- 添加权限验证函数类型
- 定义路由元信息类型

### 阶段四：API 层升级（预计 1 天）

#### 4.1 创建 API 类型定义文件
创建 `src/api/types.ts`：
```typescript
// 基础响应类型
export interface BaseResponse<T = any> {
  code: number
  data: T
  message?: string
}

// 分页响应
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 各模块具体类型定义...
```

#### 4.2 逐个升级 API 模块
**升级顺序：**
1. `src/api/common/index.js` → `index.ts`
2. `src/api/login/index.js` → `index.ts`
3. `src/api/menu/index.js` → `index.ts`
4. `src/api/shop/index.js` → `index.ts`
5. `src/api/goods/index.js` → `index.ts`
6. `src/api/coupon/index.js` → `index.ts`

**每个模块需要确认：**
- API 请求参数结构
- API 响应数据结构
- 是否需要定义具体的 interface

### 阶段五：Store 层升级（预计 0.5 天）

#### 5.1 升级 src/store/auth.js → auth.ts
- 定义 state 类型
- 为 actions 添加参数和返回值类型

#### 5.2 升级 src/store/user.js → user.ts
- 定义用户信息 interface
- 为登录、登出等操作添加类型

### 阶段六：Router 层升级（预计 0.5 天）

#### 6.1 升级 src/router/index.js → index.ts
- 添加路由元信息类型定义
- 为路由配置添加类型注解

### 阶段七：组件层升级（预计 2 天）

#### 7.1 升级全局组件
- `src/components/ImgUpload/index.vue`
  - 添加 props 类型定义
  - 添加 emits 类型定义
  - script setup 添加 `lang="ts"`

#### 7.2 升级 composables
- `src/composables/Loading/index.js` → `index.ts`
- `src/composables/Loading/index.vue` 添加 `lang="ts"`

#### 7.3 升级 Layout 组件及其子组件
- `src/pages/layout/Layout.vue`
- `src/pages/layout/components/` 下所有组件

### 阶段八：页面层升级（预计 3 天）

#### 8.1 按模块逐个升级页面
**升级顺序：**
1. `src/pages/login/index.vue`
2. `src/pages/dashboard/index.vue`
3. `src/pages/noAuth/index.vue`
4. `src/pages/userList/index.vue`
5. `src/pages/menu/index.vue` & `detail.vue`
6. `src/pages/shop/index.vue` & `detail.vue`
7. `src/pages/goods/index.vue` & `detail.vue` & `categoryList.vue`
8. `src/pages/coupon/index.vue` & `detail.vue`

**每个页面升级内容：**
- `<script setup lang="ts">`
- 定义组件 props interface
- 定义 emits interface
- 为响应式数据添加类型
- 为函数添加参数和返回值类型

### 阶段九：入口文件升级（预计 0.5 天）

#### 9.1 升级 src/main.js → main.ts
- 添加类型导入
- 保持所有初始化逻辑不变

#### 9.2 升级 src/App.vue
- 添加 `lang="ts"`
- 添加必要的类型定义

### 阶段十：验证与测试（预计 1 天）

#### 10.1 类型检查
```bash
npx tsc --noEmit
```

#### 10.2 ESLint 检查
```bash
npm run lint
```

#### 10.3 构建验证
```bash
npm run build:dev
npm run build:prod
```

#### 10.4 功能验证
- 启动开发服务器验证所有页面
- 测试核心功能：登录、权限、CRUD 操作

## 需要确认的问题清单

### 基础设施相关
1. **是否需要添加 Vue 的 TypeScript 支持包？**
   - 建议安装 `vue-tsc` 用于 Vue 文件的类型检查
   - 是否需要？

2. **是否需要配置路径别名的 TypeScript 支持？**
   - tsconfig.json 中已配置 paths，但是否需要额外配置？

### API 类型相关
3. **API 响应结构是否统一？**
   - 当前看到 `code === 1` 为成功，是否需要定义统一的响应类型？
   - 不同模块的响应结构是否有差异？

4. **是否需要为每个 API 模块定义具体的请求/响应类型？**
   - 例如：商品列表的请求参数、响应数据结构
   - 还是使用通用类型 + any？

5. **API 错误处理是否需要类型化？**
   - 当前使用 `Promise.reject`，是否需要定义错误类型？

### 组件类型相关
6. **ImgUpload 组件的 fileList 类型是什么？**
   - 是字符串数组（URL）还是对象数组？
   - 需要定义具体的 interface

7. **表格组件的数据类型是否需要统一定义？**
   - 多个页面使用表格，是否需要创建通用的表格数据类型？

### Store 类型相关
8. **用户信息结构是什么？**
   - userStore 中存储的用户信息包含哪些字段？
   - 需要定义 User interface

9. **权限信息如何存储？**
   - authStore 中的权限数据结构是什么？

### 路由类型相关
10. **路由 meta 信息是否需要扩展类型？**
    - 当前只有 `title`，是否需要添加其他字段（如权限标识）？

### 开发体验相关
11. **是否需要添加 Vue 官方的 TypeScript 插件？**
    - `@vue/tsconfig` - Vue 推荐的 TS 配置
    - `vue-tsc` - Vue 文件类型检查

12. **是否需要在 VSCode 中配置 TypeScript 版本？**
    - 使用工作区版本还是全局版本？

## 风险点与应对策略

### 风险 1：类型定义不完整导致编译错误
**应对：**
- 使用 `any` 作为临时方案
- 逐步完善类型定义
- 配置 `strict: false` 作为过渡（不推荐）

### 风险 2：第三方库类型缺失
**应对：**
- 安装 `@types/xxx` 包
- 创建自定义声明文件
- 使用 `declare module` 进行模块声明

### 风险 3：Vue 组件类型推断问题
**应对：**
- 使用 `defineProps<T>()` 和 `defineEmits<T>()`
- 使用 `InstanceType<typeof Component>` 获取组件实例类型

### 风险 4：构建性能下降
**应对：**
- TypeScript 编译会增加构建时间
- 可以配置 `isolatedModules: true` 加速
- 使用 `skipLibCheck: true` 跳过库文件检查

## 升级检查清单

### 基础设施
- [ ] 安装 TypeScript 及相关依赖
- [ ] 创建 tsconfig.json 和 tsconfig.node.json
- [ ] 创建 vite-env.d.ts
- [ ] 更新 vite.config.ts
- [ ] 更新 ESLint 配置

### 工具层
- [ ] 升级 utils/request.ts
- [ ] 升级 utils/index.ts
- [ ] 升级 utils/login_token.ts
- [ ] 升级 utils/SSE.ts
- [ ] 升级 auth.ts

### API 层
- [ ] 创建 API 类型定义文件
- [ ] 升级 api/common/index.ts
- [ ] 升级 api/login/index.ts
- [ ] 升级 api/menu/index.ts
- [ ] 升级 api/shop/index.ts
- [ ] 升级 api/goods/index.ts
- [ ] 升级 api/coupon/index.ts

### Store 层
- [ ] 升级 store/auth.ts
- [ ] 升级 store/user.ts

### Router 层
- [ ] 升级 router/index.ts

### 组件层
- [ ] 升级 components/ImgUpload/index.vue
- [ ] 升级 composables/Loading/index.ts
- [ ] 升级 composables/Loading/index.vue
- [ ] 升级 layout 相关组件

### 页面层
- [ ] 升级 login/index.vue
- [ ] 升级 dashboard/index.vue
- [ ] 升级 noAuth/index.vue
- [ ] 升级 userList/index.vue
- [ ] 升级 menu 相关页面
- [ ] 升级 shop 相关页面
- [ ] 升级 goods 相关页面
- [ ] 升级 coupon 相关页面

### 入口文件
- [ ] 升级 main.ts
- [ ] 升级 App.vue

### 验证
- [ ] 运行 `npx tsc --noEmit` 通过
- [ ] 运行 `npm run lint` 通过
- [ ] 运行 `npm run build:dev` 成功
- [ ] 运行 `npm run build:prod` 成功
- [ ] 功能测试通过

## 预估工作量

| 阶段 | 工作内容 | 预计时间 |
|------|---------|---------|
| 阶段一 | 基础设施准备 | 0.5 天 |
| 阶段二 | Vite 配置升级 | 0.5 天 |
| 阶段三 | 核心工具层升级 | 1 天 |
| 阶段四 | API 层升级 | 1 天 |
| 阶段五 | Store 层升级 | 0.5 天 |
| 阶段六 | Router 层升级 | 0.5 天 |
| 阶段七 | 组件层升级 | 2 天 |
| 阶段八 | 页面层升级 | 3 天 |
| 阶段九 | 入口文件升级 | 0.5 天 |
| 阶段十 | 验证与测试 | 1 天 |
| **总计** | | **10.5 天** |

## 下一步行动

1. **确认升级方案** - 请审阅本方案，确认是否符合预期
2. **回答问题清单** - 请回答"需要确认的问题清单"中的问题
3. **开始执行** - 确认后立即开始阶段一的实施

---

**文档版本：** v1.0  
**创建时间：** 2026-08-07  
**最后更新：** 2026-08-07
