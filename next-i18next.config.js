const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'uz',
    locales: ['uz', 'ru'],
    localeDetection: false,
  },
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}