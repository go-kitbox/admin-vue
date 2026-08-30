import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'

const toPascalCase = (str) => {
  return str.replace(/(^\w|-\w)/g, clearAndUpper)
}

const clearAndUpper = (text) => {
  return text.replace(/-/, '').toUpperCase()
}

// 递归获取目录下所有的 .vue 文件
const getAllVueFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      getAllVueFiles(filePath, fileList)
    } else if (filePath.endsWith('.vue')) {
      fileList.push(filePath)
    }
  })
  return fileList
}

// 从 .vue 文件内容中提取组件名称
const extractComponentName = (fileContent) => {
  const regex = /defineOptions\(\s*{\s*name:\s*["']([^"']+)["']/
  const match = fileContent.match(regex)
  return match ? match[1] : null
}

// Vite 插件:扫描视图目录生成 pathInfo.json(keep-alive 组件名映射)。
// scanDirs: 待扫描目录(相对 vite root 或绝对路径),支持字符串或 [dir, component前缀] 二元组;
//           前缀默认取目录名(如 'src/view' → 'view','../ui-base/src/view' → 'view')。
//           应用侧应把库的视图目录一并传入,以生成合并映射。
// outFile:  输出文件(默认 src/pathInfo.json,生成在应用内)。
// 生成的 key 形如 '/src/view/xxx.vue',与后端菜单 component 字符串拼 '/src/' 后一致。
const vueFilePathPlugin = ({ scanDirs = ['src/view', 'src/plugin'], outFile = 'src/pathInfo.json' } = {}) => {
  let root

  const resolveDir = (dirSpec) => {
    const [dir, prefix] = Array.isArray(dirSpec) ? dirSpec : [dirSpec, path.basename(dirSpec)]
    return { absDir: path.resolve(root, dir), prefix }
  }

  const generatePathNameMap = () => {
    const pathNameMap = {}
    for (const dirSpec of scanDirs) {
      const { absDir, prefix } = resolveDir(dirSpec)
      if (!fs.existsSync(absDir)) {
        continue
      }
      for (const filePath of getAllVueFiles(absDir)) {
        const content = fs.readFileSync(filePath, 'utf-8')
        const componentName = extractComponentName(content)
        const component = `${prefix}/${path.relative(absDir, filePath).replace(/\\/g, '/')}`
        pathNameMap[`/src/${component}`] =
          componentName || toPascalCase(path.basename(filePath, '.vue'))
      }
    }
    fs.writeFileSync(path.resolve(root, outFile), JSON.stringify(pathNameMap, null, 2))
  }

  const watchDirectoryChanges = () => {
    const watchDirectories = scanDirs.map((d) => resolveDir(d).absDir).filter((d) => fs.existsSync(d))
    const watcher = chokidar.watch(watchDirectories, {
      persistent: true,
      ignoreInitial: true
    })
    watcher.on('all', () => {
      generatePathNameMap()
    })
  }

  return {
    name: 'vue-file-path-plugin',
    configResolved(resolvedConfig) {
      root = resolvedConfig.root
    },
    buildStart() {
      generatePathNameMap()
    },
    buildEnd() {
      if (process.env.NODE_ENV === 'development') {
        watchDirectoryChanges()
      }
    }
  }
}

export default vueFilePathPlugin
