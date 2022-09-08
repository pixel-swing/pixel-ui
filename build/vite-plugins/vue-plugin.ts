import createVuePlugin from '@vitejs/plugin-vue'

export const vuePlugin = createVuePlugin({
  include: [/\.vue$/, /\.md$/, /\.entry$/]
})