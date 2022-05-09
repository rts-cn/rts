var en = require('./locales/en.json')
var zh = require('./locales/zh.json')

const i18n = {
  translations: {
    en,
    zh,
  },
  defaultLang: 'zh',
  //useBrowserDefault: true, // 开启此选项优先跟浏览器语言一致
}

module.exports = i18n
