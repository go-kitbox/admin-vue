import { fmtTitle } from '@base/utils/fmtRouterTitle'
import config from '@base/core/config'
export default function getPageTitle(pageTitle, route) {
  if (pageTitle) {
    const title = fmtTitle(pageTitle, route)
    return `${title} - ${config.appName}`
  }
  return `${config.appName}`
}
