# cms-admin-ui

通用管理端前端框架库（Vue 3 + Vite + Element Plus + Pinia + Tailwind，gin-vue-admin 系）。本仓库**只是库**（源码形态，无独立构建）——应用仓库（工作区的 `ui-admin/`、`ui-control/` 等）通过 npm `file:` 链接依赖本库，只写业务页面。配套后端框架库：`backend-base`（github.com/go-utils2/cms-backend）。

## 应用接入方式

### 1. 依赖（应用 package.json）

```json
"dependencies": {
  "cms-admin-ui": "file:../ui-base"
}
```

npm ≥ 9 对目录型 `file:` 依赖做符号链接，Vite 将其视作源码编译（.vue 正常走 SFC 编译器），同盘编辑即时生效。

> **注意**：`ui-base/` 自身也要 `npm install`（需要自己的 node_modules）。Node/Vite 按真实路径向上解析依赖，链接包的依赖必须能从 `ui-base/` 目录内解析到（vitePlugin 的 chokidar、库源码的 vue/element-plus 等）。应用侧 vite 已配 `dedupe` 保证共享库单实例。

### 2. 应用 main.js（约 12 行）

```js
import { createAdminApp } from 'cms-admin-ui'
import pathInfo from './pathInfo.json'

const app = createAdminApp({
  appName: '我的后台',
  appLogo: 'logo.png',
  views: import.meta.glob('./view/**/*.vue'), // 业务视图,component 字符串 'view/...' 自动匹配
  pathInfo
})
app.mount('#app')
```

### 3. 应用 vite.config.js 必配项

```js
import { VueFilePathPlugin } from 'cms-admin-ui/vitePlugin/componentName/index.js'

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve('./src'), '@base': path.resolve('../ui-base/src') },
    dedupe: ['vue']
  },
  plugins: [
    vue(),
    // 扫描应用与库两侧视图目录,合并生成应用内 src/pathInfo.json(keep-alive 组件名)
    VueFilePathPlugin({
      scanDirs: ['src/view', 'src/plugin', '../ui-base/src/view', '../ui-base/src/plugin']
    })
  ]
})
```

### 4. 应用 tailwind.config.js

```js
module.exports = {
  presets: [require('cms-admin-ui/tailwind.preset')],
  content: ['./index.html', './src/**/*.{vue,js}', '../ui-base/src/**/*.{vue,js}']
}
```

### 5. 应用保留自己的 `.env.*`（VITE_BASE_API 等）、`index.html`、`public/`

## 库内容（src/）

| 目录 | 内容 |
|---|---|
| `index.js` | `createAdminApp` 引导工厂（样式/全局注册/路由/守卫/pinia 一条链） |
| `router/` + `permission.js` | 静态路由（login/init/404）+ 动态菜单路由守卫（白名单、keep-alive 修复、nprogress） |
| `pinia/` | app(主题/布局)、user(token/登录)、router(动态菜单)、dictionary、params 五个 store |
| `utils/` | request.js（x-token/x-user-id、code===0、new-token 刷新、401 登出——绑定 Go 后端约定）、asyncRouter 视图注册表、bus、btnAuth、字典/参数等 |
| `api/` | gva 系系统接口（login、sysUser、menu、authority、casbin、字典、参数、autoCode 等） |
| `view/` | 登录、init 向导、layout（多模式侧栏/头部/tabs/搜索/主题设置）、superAdmin（用户/角色/菜单/API/字典/参数/操作记录）、systemTools（代码生成等）、dashboard、person、example |
| `components/` | 上传/裁剪、富文本、echarts、office 预览、导入导出 Excel、svgIcon 等 18 个公共组件 |
| `plugin/` | gva 插件包（announcement、email） |
| `style/` + `hooks/` + `directive/` | tailwind 入口 scss、element 主题覆盖、v-auth 指令、响应式 hooks |
| `vitePlugin/` | `VueFilePathPlugin`（pathInfo.json 生成，可参数化扫描目录） |

## 约定

- 库内导入一律用 `@base/` 前缀（应用侧提供 `@base → ../ui-base/src` 别名）；应用自己的代码用 `@/`
- 后端菜单的 `component` 字符串（`view/xxx.vue` / `plugin/xxx.vue`）无需改动——库视图与应用视图在注册表中合并匹配
- `pathInfo.json` 由应用侧 vite 插件生成（含库+应用两侧），库运行时通过 `createAdminApp({ pathInfo })` 注入
