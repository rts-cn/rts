import BAScript from './BaiduAnalytics'
import siteMetadata from '@/data/siteMetadata'

const isProduction = process.env.NODE_ENV === 'production'

const Analytics = () => {
  return <>{isProduction && siteMetadata.analytics.baiduAnalyticsId && <BAScript />}</>
}

export default Analytics
