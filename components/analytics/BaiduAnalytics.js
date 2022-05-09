import Script from 'next/script'
import siteMetadata from '@/data/siteMetadata'

const BAScript = () => {
  return (
    <>
      <Script strategy="lazyOnload" id="ba-script">
        {`
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?${siteMetadata.analytics.baiduAnalyticsId}";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
          })();
        `}
      </Script>
    </>
  )
}

export default BAScript
