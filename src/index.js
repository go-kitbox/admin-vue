// cms-admin-ui 应用引导工厂。
//
// 应用侧 main.js 示例(views 传业务视图目录的 import.meta.glob 扫描结果):
//   import { createAdminApp } from 'cms-admin-ui'
//   import pathInfo from './pathInfo.json'
//
//   const app = createAdminApp({
//     appName: '我的后台',
//     appLogo: 'logo.png',
//     views: import.meta.glob('./view/**/*.vue'), // 业务视图
//     pathInfo                                     // vite 插件生成的合并映射
//   })
//   app.mount('#app')
import './style/element_visiable.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'

// gin-vue-admin 系前端初始化(全局组件/图标注册)
import './core/ai-meva-admin'
import run from './core/ai-meva-admin.js'
// 封装好的 router 与路由守卫(白名单/动态路由/进度条)
import router from './router/index'
import './permission'
// v-auth 按钮权限指令与 pinia store
import auth from './directive/auth'
import { store } from './pinia'
import App from './App.vue'

import { setAppConfig } from './core/config'
import { setPathInfo } from './utils/pathInfo'
import { registerViewModules, registerPluginModules } from './utils/asyncRouter'

export function createAdminApp(options = {}) {
  const { appName, appLogo, views, plugins, pathInfo } = options

  if (appName || appLogo) {
    setAppConfig({ appName, appLogo })
  }
  if (views) {
    registerViewModules(views)
  }
  if (plugins) {
    registerPluginModules(plugins)
  }
  if (pathInfo) {
    setPathInfo(pathInfo)
  }

  const app = createApp(App)
  app.config.productionTip = false

  app.use(run).use(ElementPlus).use(store).use(auth).use(router)
  return app
}

export { default as router } from './router/index'
export { store } from './pinia'
export { default as request } from './utils/request'
