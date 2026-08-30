// pathInfo 注入点:keep-alive 组件名映射(文件路径 → defineOptions 组件名)。
// 原为直接 import '@/pathInfo.json';该文件由各应用的 vite 插件
// (vitePlugin/componentName)扫描库与应用两侧的视图目录合并生成,
// 因此由应用在 createAdminApp({ pathInfo }) 时注入。
let pathInfo = {}

export const setPathInfo = (info) => {
  pathInfo = info || {}
}

export const getPathInfo = () => pathInfo
