// 视图/插件组件注册表:库自身 glob 为初始值,应用通过 registerViewModules/
// registerPluginModules 注入自己的业务视图(import.meta.glob('./view/**/*.vue'))。
// key 统一归一化为 'view/...' / 'plugin/...' 前缀,与后端菜单返回的
// component 字符串(view/xxx.vue、plugin/xxx.vue)直接匹配。
const normalize = (modules, prefix) => {
  const result = {}
  for (const key of Object.keys(modules)) {
    const k = key.replace(/^.*?\/(view|plugin)\//, '$1/')
    if (k.startsWith(prefix)) {
      result[k] = modules[key]
    }
  }
  return result
}

const viewModules = { ...normalize(import.meta.glob('../view/**/*.vue'), 'view/') }
const pluginModules = { ...normalize(import.meta.glob('../plugin/**/*.vue'), 'plugin/') }

// registerViewModules 注册应用的业务视图 glob 表
export const registerViewModules = (modules) => {
  Object.assign(viewModules, normalize(modules || {}, 'view/'))
}

// registerPluginModules 注册应用的插件视图 glob 表
export const registerPluginModules = (modules) => {
  Object.assign(pluginModules, normalize(modules || {}, 'plugin/'))
}

export const asyncRouterHandle = (asyncRouter) => {
  asyncRouter.forEach((item) => {
    if (item.component && typeof item.component === 'string') {
      item.meta.path = '/src/' + item.component
      if (item.component.split('/')[0] === 'view') {
        item.component = dynamicImport(viewModules, item.component)
      } else if (item.component.split('/')[0] === 'plugin') {
        item.component = dynamicImport(pluginModules, item.component)
      }
    }
    if (item.children) {
      asyncRouterHandle(item.children)
    }
  })
}

function dynamicImport(dynamicViewsModules, component) {
  const keys = Object.keys(dynamicViewsModules)
  const matchKeys = keys.filter((key) => {
    return key === component
  })
  const matchKey = matchKeys[0]

  return dynamicViewsModules[matchKey]
}
