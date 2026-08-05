# Foodshop Admin 项目开发规则

## 项目概述

基于 Vue 3 + Vite + Arco Design 的后台管理系统，用于管理商铺、商品、菜单和用户。

## 技术栈

Vue 3.2+ (Composition API) | Vite 2.9+ | Arco Design Vue 2.29+ | Pinia 2.0+ | Vue Router 4.0+ | Axios 1.7+ | Less 4.1+ | ESLint 8.31+ | NProgress

## 目录结构

```
src/
├── api/          # API 接口层（按模块：common/goods/login/menu/shop）
├── assets/       # 静态资源
├── components/   # 全局组件（ImgUpload 图片上传）
├── composables/  # 组合式函数（Loading）
├── pages/        # 页面（dashboard/goods/layout/login/menu/noAuth/shop/userList）
├── router/       # 路由配置
├── store/        # Pinia 状态管理
├── styles/       # 全局样式
├── utils/        # 工具函数
└── auth.js       # 权限控制
```

## 路径别名（必须优先使用）

`@` → src/ | `@api` → src/api/ | `@components` → src/components/ | `@utils` → src/utils/ | `@pages` → src/pages/ | `@store` → src/store/ | `@router` → src/router/

## 核心规范

### 1. Vue 组件
- **必须使用 `<script setup>` Composition API**
- 组件命名：PascalCase；页面命名：camelCase 或 index.vue
- 样式：`<style lang="less" scoped>`
- 禁止直接修改 props，使用 emit 通知父组件

### 2. API 接口
- 每模块独立文件夹（`api/module/index.js`）
- 统一使用 `@utils/request`，GET 用 `params`，POST 用 `data`
- 命名：动词 + 名词（如 `getGoodsList`, `addGoods`）

```javascript
import request from '@utils/request'
export function getGoodsList(params) {
  return request({ url: '/admin/auth/food/list', method: 'get', params })
}
```

### 3. 状态管理（Pinia）
- 使用 `defineStore`，状态 camelCase，Action 动词开头
- Store 文件放 `src/store/`

### 4. 路由配置
- 静态路由：`constantRouterMap`；动态路由：`asyncRouterMap`（后端获取）
- **meta 必须含 `title`**，使用懒加载 `() => import('@pages/xxx/index.vue')`

### 5. 样式规范
- Less 编写，全局样式放 `src/styles/`，页面用 `scoped`
- 常用类：`.view-container`（白底 24px 内边距）、`.tool-bar`（右对齐）

### 6. HTTP 请求
- 统一 `@utils/request`，自动处理 Loading（可设 `needLoading: false`）
- 响应自动解包返回 `response.data`，成功码 `code === 1`
- 错误码 `10002` token 失效，自动跳登录页

### 7. 权限控制
- 逻辑集中在 `src/auth.js`，路由守卫检查 token 和动态路由
- 白名单：`/login`；无权限：`/noAuth/index`

### 8. 环境变量
- `.env.development` / `.env.production`，使用 `VITE_` 前缀
- 访问：`import.meta.env.VITE_XXX`

### 9. 代码提交
- Husky + lint-staged 自动检查，提交前运行 `npm run lint`

### 10. 构建部署
- 开发：`npm run dev`（端口 8888）
- 生产：`npm run build:prod`（输出 `admin-user/`）
- 部署：`npm run deploy`

## 常用组件

### ImgUpload（七牛云图片上传）

```vue
<ImgUpload
  :fileList="picFileList"
  :limitNum="3"
  accept="image/png,image/jpg"
  @imgUploadFinish="handleUpload"
  @removeImg="handleRemove"
/>
```

**Props**: `fileList`（必填）| `limitNum`（默认 1）| `acceptType` | `disabled`  
**Events**: `imgUploadFinish`（返回 url）| `removeImg`

## 关键约束

1. 所有 API 请求必须通过 `@utils/request`
2. 必须使用路径别名，禁止相对路径
3. 组件必须使用 Composition API
4. 样式必须使用 scoped（全局样式除外）
5. 路由必须配置 `meta.title`
6. 图片上传使用七牛云，不上传服务器
7. 禁止修改 `node_modules`

---

**最后更新**: 2026-08-04
