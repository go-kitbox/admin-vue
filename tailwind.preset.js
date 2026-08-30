// cms-admin-ui 的 tailwind 预设;应用侧 tailwind.config.js:
//   module.exports = {
//     presets: [require('cms-admin-ui/tailwind.preset')],
//     content: ['./index.html', './src/**/*.{vue,js}', '../ui-base/src/**/*.{vue,js}']
//   }
module.exports = {
  important: true,
  theme: {
    extend: {
      backgroundColor: {
        main: '#F5F5F5'
      },
      textColor: {
        active: 'var(--el-color-primary)'
      },
      boxShadowColor: {
        active: 'var(--el-color-primary)'
      },
      borderColor: {
        'table-border': 'var(--el-border-color-lighter)'
      }
    }
  },
  darkMode: 'class',
  plugins: []
}
