/**
 * 网站配置文件
 */
const greenText = (text) => `\x1b[32m${text}\x1b[0m`

const config = {
  appName: 'Cms Admin',
  appLogo: 'logo.png',
  showViteLogo: true,
  logs: []
}

// setAppConfig 覆盖默认配置(应用通过 createAdminApp({ appName, appLogo }) 注入)
export const setAppConfig = (override) => {
  Object.assign(config, override)
}

export const viteLogo = (env) => {
  if (config.showViteLogo) {
    console.log(
      greenText(
        `> 默认自动化文档地址:http://127.0.0.1:${env.VITE_SERVER_PORT}/swagger/index.html`
      )
    )
    console.log(
      greenText(`> 默认前端文件运行地址:http://127.0.0.1:${env.VITE_CLI_PORT}`)
    )
    console.log('\n')
  }
}

export default config
